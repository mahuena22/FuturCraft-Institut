import { db } from "@/db";
import {
  formations,
  promotions,
  students,
  paymentSchedules,
  payments,
  receipts,
  notifications,
  studentProjects,
  companyOffers,
  partnershipRequests,
  events,
  blogArticles,
  paymentRequests,
} from "@/db/schema";
import { ensureDatabaseSeeded } from "@/db/ensure-seed";
import { and, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { randomBytes } from "crypto";
import { sendValidationEmail } from "@/lib/email";

export async function getFormations() {
  await ensureDatabaseSeeded();
  return await db.select().from(formations).orderBy(desc(formations.isPopular));
}

function normalizePhone(p: string | null | undefined): string {
  // Strip all non-digits, then keep the last 8 digits (Benin local number length)
  const digits = (p || "").replace(/\D/g, "");
  return digits.slice(-8);
}

export async function findStudentByCredentials(studentNumber: string, phone: string) {
  await ensureDatabaseSeeded();
  const [row] = await db
    .select()
    .from(students)
    .where(eq(students.studentNumber, String(studentNumber).trim()))
    .limit(1);
  if (!row) return null;
  const matches =
    normalizePhone(phone) === normalizePhone(row.phone) ||
    (row.whatsapp !== null && normalizePhone(phone) === normalizePhone(row.whatsapp));
  return matches ? row : null;
}

export async function getFormationBySlug(slug: string) {
  await ensureDatabaseSeeded();
  const rows = await db.select().from(formations).where(eq(formations.slug, slug));
  return rows[0] || null;
}

export async function getPromotions(formationId?: number) {
  await ensureDatabaseSeeded();
  if (formationId) {
    return await db.select().from(promotions).where(eq(promotions.formationId, formationId));
  }
  return await db.select().from(promotions);
}

export async function getOpenPromotionsByFormation() {
  await ensureDatabaseSeeded();
  const rows = await db.select().from(promotions).where(inArray(promotions.status, ["ouverte", "en_cours"]));
  return rows.reduce<Record<number, typeof rows>>((acc, p) => {
    (acc[p.formationId] ||= []).push(p);
    return acc;
  }, {});
}

export async function getAllStudents() {
  await ensureDatabaseSeeded();
  return await db.select().from(students).orderBy(desc(students.createdAt));
}

export async function getStudentById(id: number) {
  await ensureDatabaseSeeded();
  const studentRows = await db.select().from(students).where(eq(students.id, id));
  if (!studentRows.length) return null;
  const student = studentRows[0];

  const formationRows = await db.select().from(formations).where(eq(formations.id, student.formationId));
  const promotionRows = student.promotionId
    ? await db.select().from(promotions).where(eq(promotions.id, student.promotionId))
    : [];
  const schedules = await db
    .select()
    .from(paymentSchedules)
    .where(eq(paymentSchedules.studentId, student.id));
  const studentPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.studentId, student.id))
    .orderBy(desc(payments.createdAt));
  const studentReceipts = await db
    .select()
    .from(receipts)
    .where(eq(receipts.studentId, student.id))
    .orderBy(desc(receipts.createdAt));
  const studentNotifs = await db
    .select()
    .from(notifications)
    .where(eq(notifications.studentId, student.id))
    .orderBy(desc(notifications.createdAt));
  const paymentRequestsList = await db
    .select()
    .from(paymentRequests)
    .where(eq(paymentRequests.studentId, student.id))
    .orderBy(desc(paymentRequests.createdAt));

  return {
    student,
    formation: formationRows[0] || null,
    promotion: promotionRows[0] || null,
    schedules,
    payments: studentPayments,
    receipts: studentReceipts,
    notifications: studentNotifs,
    paymentRequests: paymentRequestsList,
  };
}

export async function getStudentByNumber(studentNumber: string) {
  await ensureDatabaseSeeded();
  const rows = await db.select().from(students).where(eq(students.studentNumber, studentNumber));
  if (!rows.length) return null;
  return await getStudentById(rows[0].id);
}

export async function createStudentWithPlan(data: {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city?: string;
  formationId: number;
  promotionId?: number;
  previousDiploma?: string;
  studyLevel?: string;
  previousSchool?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  residenceCountry?: string;
}) {
  await ensureDatabaseSeeded();

  const [formation] = await db.select().from(formations).where(eq(formations.id, data.formationId));
  if (!formation) throw new Error("Formation introuvable");

  const countStudents = await db.select({ maxId: sql<number>`coalesce(max(${students.id}), 0)` }).from(students);
  const nextNum = String(countStudents[0].maxId + 1).padStart(4, "0");
  const studentNumber = `FC-2026-${nextNum}`;

  const total = formation.price + (formation.registrationFee || 0);

  const [newStudent] = await db
    .insert(students)
    .values({
      studentNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender || "M",
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      city: data.city || "Cotonou",
      formationId: data.formationId,
      promotionId: data.promotionId || null,
      previousDiploma: data.previousDiploma || "BAC",
      studyLevel: data.studyLevel || "BAC",
      previousSchool: data.previousSchool || "",
      guardianName: data.guardianName || "",
      guardianPhone: data.guardianPhone || "",
      guardianRelation: data.guardianRelation || "",
      residenceCountry: data.residenceCountry || "BÃ©nin",
      status: "preinscrit",
      totalAmount: total,
      paidAmount: 0,
      remainingAmount: total,
    })
    .returning();

  // Create default payment schedule: Frais de dossier + mensualitÃ©s (dossier ajoutÃ© au prix)
  const regFee = formation.registrationFee || 0;
  const tuition = formation.price;
  const installmentsCount = formation.installmentsCount || 4;
  const installmentAmount = Math.round(tuition / installmentsCount);

  // Frais de dossier
  if (regFee > 0) {
    await db.insert(paymentSchedules).values({
      studentId: newStudent.id,
      title: "Frais d'inscription & validation de dossier",
      amount: regFee,
      dueDate: "Ã€ rÃ©gler sous 7 jours",
      status: "en_attente",
    });
  }

  // Installments
  for (let i = 1; i <= installmentsCount; i++) {
    const isLast = i === installmentsCount;
    const amount = isLast
      ? tuition - installmentAmount * (installmentsCount - 1)
      : installmentAmount;
    await db.insert(paymentSchedules).values({
      studentId: newStudent.id,
      title: `MensualitÃ© ${i} â€” Formation ${formation.title.slice(0, 20)}...`,
      amount,
      dueDate: `Mois ${i} de formation`,
      status: "en_attente",
    });
  }

  // Welcome notification
  await db.insert(notifications).values({
    studentId: newStudent.id,
    title: "Inscription enregistrÃ©e ðŸŽ“",
    message: `Votre prÃ©inscription sous le numÃ©ro ${studentNumber} a Ã©tÃ© enregistrÃ©e avec succÃ¨s. Votre dossier est en attente de validation par l'administration. Vous serez notifiÃ© dÃ¨s que votre compte sera activÃ©.`,
    type: "admission",
  });

  return newStudent;
}

export async function validateStudent(id: number, adminName?: string, note?: string) {
  await ensureDatabaseSeeded();
  const [student] = await db.select().from(students).where(eq(students.id, id));
  if (!student) throw new Error("Ã‰tudiant introuvable");
  if (student.status === "rejete") throw new Error("Cet Ã©tudiant a dÃ©jÃ  Ã©tÃ© rejetÃ©. Modifiez d'abord son statut.");

  const [updated] = await db
    .update(students)
    .set({
      status: "inscrit",
      profileVisible: true,
      validationNote: note || null,
      validatedBy: adminName || null,
      validatedAt: new Date(),
    })
    .where(eq(students.id, id))
    .returning();

  await db.insert(notifications).values({
    studentId: id,
    title: "Compte activÃ© ðŸŽ‰",
    message: `FÃ©licitations ${student.firstName} ! Votre dossier a Ã©tÃ© validÃ© par l'administration. Vous pouvez maintenant vous connecter Ã  votre espace Ã©tudiant et finaliser vos frais d'inscription.`,
    type: "admission",
  });

  const [formation] = await db.select().from(formations).where(eq(formations.id, student.formationId));
  void sendValidationEmail({
    studentNumber: student.studentNumber,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    formationTitle: formation?.title,
    status: "validate",
    note: note || undefined,
  });

  return updated;
}

export async function rejectStudent(id: number, adminName?: string, note?: string) {
  await ensureDatabaseSeeded();
  const [student] = await db.select().from(students).where(eq(students.id, id));
  if (!student) throw new Error("Ã‰tudiant introuvable");

  const [updated] = await db
    .update(students)
    .set({
      status: "rejete",
      profileVisible: false,
      validationNote: note || null,
      validatedBy: adminName || null,
      validatedAt: new Date(),
    })
    .where(eq(students.id, id))
    .returning();

  await db.insert(notifications).values({
    studentId: id,
    title: "Dossier non retenu",
    message: note
      ? `Bonjour ${student.firstName}, votre dossier n'a pas Ã©tÃ© validÃ©. Raison : ${note}.`
      : `Bonjour ${student.firstName}, votre dossier n'a pas Ã©tÃ© validÃ© par l'administration. Veuillez nous contacter pour plus d'informations.`,
    type: "admission",
  });

  void sendValidationEmail({
    studentNumber: student.studentNumber,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    status: "reject",
    note: note || undefined,
  });

  return updated;
}

export async function getValidatedStudentTalents() {
  await ensureDatabaseSeeded();
  const rows = await db
    .select({
      id: students.id,
      studentNumber: students.studentNumber,
      firstName: students.firstName,
      lastName: students.lastName,
      city: students.city,
      avatarUrl: students.avatarUrl,
      cvUrl: students.cvUrl,
      status: students.status,
      formationTitle: formations.title,
      formationTools: formations.tools,
      validatedAt: students.validatedAt,
    })
    .from(students)
    .innerJoin(formations, eq(students.formationId, formations.id))
    .where(
      and(
        eq(students.profileVisible, true),
        isNotNull(students.validatedAt),
        inArray(students.status, ["inscrit", "actif", "termine", "alumni"])
      )
    );

  return rows.map((r) => {
    let tools: string[] = [];
    try {
      const parsed = JSON.parse(r.formationTools || "[]");
      if (Array.isArray(parsed)) tools = parsed.slice(0, 6).map(String);
    } catch {
      tools = [];
    }
    return {
      name: `${r.firstName} ${r.lastName}`,
      formation: r.formationTitle,
      skills: tools.length ? tools : ["â€”"],
      status: r.status === "actif" ? "Disponible immÃ©diatement" : "Recherche de stage",
      campus: r.city || "Cotonou, BÃ©nin",
      matricule: r.studentNumber,
      photoUrl: r.avatarUrl || undefined,
      cvUrl: r.cvUrl || undefined,
    };
  });
}

function formatPaymentDate(date: Date) { return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date); }
function nextReceiptRef(id: number, prefix: "REC" | "TRX") { return `${prefix}-2026-${String(id).padStart(5, "0")}`; }
export async function recordPayment(data: { studentId: number; scheduleId?: number; amount: number; paymentMethod: string; recordedBy?: string; notes?: string; transactionRef?: string; }) {
  await ensureDatabaseSeeded();
  if (!Number.isInteger(data.amount) || data.amount <= 0) throw new Error("Montant invalide");
  return await db.transaction(async (tx) => {
    const [student] = await tx.select().from(students).where(eq(students.id, data.studentId)).for("update");
    if (!student) throw new Error("Ã‰tudiant introuvable");
    let schedule: typeof paymentSchedules.$inferSelect | null = null;
    if (data.scheduleId) {
      const [s] = await tx.select().from(paymentSchedules).where(eq(paymentSchedules.id, data.scheduleId)).for("update");
      if (!s || s.studentId !== student.id) throw new Error("Ã‰chÃ©ance introuvable pour cet Ã©tudiant");
      if (s.status === "paye") throw new Error("Cette Ã©chÃ©ance est dÃ©jÃ  payÃ©e");
      if (data.amount > s.amount) throw new Error("Le montant dÃ©passe l'Ã©chÃ©ance sÃ©lectionnÃ©e");
      schedule = s;
    }
    if (data.amount > student.remainingAmount) throw new Error("Le montant dÃ©passe le solde restant");
    const [paymentInsert] = await tx.insert(payments).values({ receiptNumber: `TMP-REC-${randomBytes(8).toString("hex").toUpperCase()}`, studentId: student.id, scheduleId: schedule?.id || null, amount: data.amount, paymentMethod: data.paymentMethod, transactionRef: data.transactionRef || `TMP-TRX-${randomBytes(8).toString("hex").toUpperCase()}`, status: "valide", notes: data.notes || `Paiement pour ${student.firstName} ${student.lastName}`, recordedBy: data.recordedBy || "Portail en ligne (MTN/Moov)", paidAt: formatPaymentDate(new Date()) }).returning();
    const receiptNumber = nextReceiptRef(paymentInsert.id, "REC");
    const trxRef = data.transactionRef || nextReceiptRef(paymentInsert.id, "TRX");
    const verificationCode = `FC-SEC-${randomBytes(4).toString("hex").toUpperCase()}-${String(paymentInsert.id).padStart(4, "0")}`;
    const [paymentRecord] = await tx.update(payments).set({ receiptNumber, transactionRef: trxRef }).where(eq(payments.id, paymentInsert.id)).returning();
    if (schedule) await tx.update(paymentSchedules).set({ status: "paye", paidAt: paymentRecord.paidAt, transactionRef: trxRef }).where(eq(paymentSchedules.id, schedule.id));
    const [receiptRecord] = await tx.insert(receipts).values({ receiptNumber, paymentId: paymentRecord.id, studentId: student.id, verificationCode, qrData: `https://futurcraft.bj/recu/${receiptNumber}?code=${verificationCode}`, issuedAt: paymentRecord.paidAt }).returning();
    const newPaid = student.paidAmount + data.amount;
    const newRemaining = Math.max(0, student.totalAmount - newPaid);
    const newStatus = student.status === "preinscrit" || student.status === "inscrit" ? "actif" : student.status;
    await tx.update(students).set({ paidAmount: newPaid, remainingAmount: newRemaining, status: newStatus }).where(eq(students.id, student.id));
    await tx.insert(notifications).values({ studentId: student.id, title: "Nouveau reÃ§u de paiement gÃ©nÃ©rÃ©", message: `Votre versement de ${data.amount.toLocaleString("fr-FR")} FCFA a Ã©tÃ© validÃ©. ReÃ§u NÂ° ${receiptNumber} disponible.`, type: "payment" });
    return { payment: paymentRecord, receipt: receiptRecord };
  });
}

export async function getReceiptDetails(receiptNumber: string, options?: { verificationCode?: string; studentId?: number; includeSensitive?: boolean }) {
  await ensureDatabaseSeeded();
  const receiptRows = await db.select().from(receipts).where(eq(receipts.receiptNumber, receiptNumber));
  if (!receiptRows.length) return null;
  const receipt = receiptRows[0];
  if (options?.verificationCode && options.verificationCode !== receipt.verificationCode) return null;
  if (options?.studentId && options.studentId !== receipt.studentId) return null;
  const [payment] = await db.select().from(payments).where(eq(payments.id, receipt.paymentId));
  const [student] = await db.select().from(students).where(eq(students.id, receipt.studentId));
  const [formation] = student ? await db.select().from(formations).where(eq(formations.id, student.formationId)) : [null];
  if (!student) return null;
  const safeStudent = options?.includeSensitive ? student : { id: student.id, studentNumber: student.studentNumber, firstName: student.firstName, lastName: student.lastName };
  return { receipt, payment, student: safeStudent, formation };
}

export async function getAdminStats() {
  await ensureDatabaseSeeded();
  const allStudents = await db.select().from(students);
  const allPayments = await db.select().from(payments);
  const allFormations = await db.select().from(formations);

  const totalStudents = allStudents.length;
  const activeStudents = allStudents.filter((s) => s.status === "actif").length;
  const newInscriptions = allStudents.filter((s) => s.status === "preinscrit" || s.status === "en_attente").length;

  const totalExpectedAmount = allStudents.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalCollectedAmount = allStudents.reduce((acc, s) => acc + s.paidAmount, 0);
  const totalRemainingAmount = allStudents.reduce((acc, s) => acc + s.remainingAmount, 0);

  const recoveryRate = totalExpectedAmount > 0 ? Math.round((totalCollectedAmount / totalExpectedAmount) * 100) : 0;

  return {
    totalStudents,
    activeStudents,
    newInscriptions,
    totalExpectedAmount,
    totalCollectedAmount,
    totalRemainingAmount,
    recoveryRate,
    formationsCount: allFormations.length,
    recentPayments: allPayments.slice(0, 10),
  };
}

export async function getProjects() {
  await ensureDatabaseSeeded();
  const rows = await db
    .select({ project: studentProjects })
    .from(studentProjects)
    .innerJoin(students, eq(studentProjects.studentId, students.id))
    .where(
      and(
        eq(students.profileVisible, true),
        isNotNull(students.validatedAt),
        inArray(students.status, ["inscrit", "actif", "termine", "alumni"])
      )
    )
    .orderBy(desc(studentProjects.isFeatured));
  return rows.map(({ project }) => project);
}

export async function getAdminStudentProjects() {
  await ensureDatabaseSeeded();
  return await db
    .select({
      id: studentProjects.id,
      studentId: studentProjects.studentId,
      studentNumber: students.studentNumber,
      studentName: sql<string>`concat(${students.firstName}, ' ', ${students.lastName})`,
      slug: studentProjects.slug,
      title: studentProjects.title,
      tagline: studentProjects.tagline,
      description: studentProjects.description,
      coverImage: studentProjects.coverImage,
      formationTitle: studentProjects.formationTitle,
      technologies: studentProjects.technologies,
      teamMembers: studentProjects.teamMembers,
      projectUrl: studentProjects.projectUrl,
      githubUrl: studentProjects.githubUrl,
      isFeatured: studentProjects.isFeatured,
    })
    .from(studentProjects)
    .leftJoin(students, eq(studentProjects.studentId, students.id))
    .orderBy(desc(studentProjects.createdAt));
}

export async function createStudentProject(data: {
  studentId: number;
  title: string;
  tagline: string;
  description: string;
  coverImage: string;
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
}) {
  await ensureDatabaseSeeded();
  const [student] = await db
    .select({
      id: students.id,
      studentNumber: students.studentNumber,
      firstName: students.firstName,
      lastName: students.lastName,
      status: students.status,
      profileVisible: students.profileVisible,
      validatedAt: students.validatedAt,
      formationTitle: formations.title,
    })
    .from(students)
    .innerJoin(formations, eq(students.formationId, formations.id))
    .where(eq(students.id, data.studentId));

  if (
    !student ||
    !student.profileVisible ||
    !student.validatedAt ||
    !["inscrit", "actif", "termine", "alumni"].includes(student.status)
  ) {
    throw new Error("Seuls les Ã©tudiants validÃ©s peuvent avoir un projet publiÃ©");
  }

  const [project] = await db
    .insert(studentProjects)
    .values({
      studentId: student.id,
      slug: `${slugify(data.title, "projet")}-${randomBytes(3).toString("hex")}`,
      title: data.title,
      tagline: data.tagline,
      description: data.description,
      coverImage: data.coverImage,
      formationTitle: student.formationTitle,
      technologies: JSON.stringify(data.technologies),
      teamMembers: JSON.stringify([
        { name: `${student.firstName} ${student.lastName}`, role: "Ã‰tudiant" },
      ]),
      projectUrl: data.projectUrl || null,
      githubUrl: data.githubUrl || null,
      isFeatured: true,
    })
    .returning();

  return {
    ...project,
    studentNumber: student.studentNumber,
    studentName: `${student.firstName} ${student.lastName}`,
  };
}

export async function deleteStudentProject(id: number) {
  await ensureDatabaseSeeded();
  const [project] = await db
    .delete(studentProjects)
    .where(eq(studentProjects.id, id))
    .returning({ id: studentProjects.id });
  return project || null;
}

export async function getEvents() {
  await ensureDatabaseSeeded();
  return await db.select().from(events);
}

export async function getBlogArticles() {
  await ensureDatabaseSeeded();
  return await db.select().from(blogArticles);
}

export async function getBlogArticleBySlug(slug: string) {
  await ensureDatabaseSeeded();
  const [row] = await db.select().from(blogArticles).where(eq(blogArticles.slug, slug)).limit(1);
  return row || null;
}

export async function getCompanyOffers() {
  await ensureDatabaseSeeded();
  return await db.select().from(companyOffers).orderBy(desc(companyOffers.createdAt));
}

export async function getPartnershipRequests() {
  await ensureDatabaseSeeded();
  const rows = await db.select().from(partnershipRequests).orderBy(desc(partnershipRequests.createdAt));
  return rows.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt).toISOString(),
  }));
}

export async function createPaymentRequest(data: {
  studentId: number;
  amount: number;
  method: string;
  phone: string;
}) {
  await ensureDatabaseSeeded();
  const reference = `PR-${Date.now().toString().slice(-6)}-${randomBytes(2).toString("hex").toUpperCase()}`;
  const [row] = await db
    .insert(paymentRequests)
    .values({
      studentId: data.studentId,
      amount: data.amount,
      method: data.method,
      phone: data.phone,
      status: "en_attente",
      reference,
    })
    .returning();
  return row;
}

export async function getPaymentRequests() {
  await ensureDatabaseSeeded();
  const rows = await db
    .select({
      id: paymentRequests.id,
      studentId: paymentRequests.studentId,
      amount: paymentRequests.amount,
      method: paymentRequests.method,
      phone: paymentRequests.phone,
      status: paymentRequests.status,
      reference: paymentRequests.reference,
      createdAt: paymentRequests.createdAt,
      studentFirstName: students.firstName,
      studentLastName: students.lastName,
      studentNumber: students.studentNumber,
    })
    .from(paymentRequests)
    .leftJoin(students, eq(paymentRequests.studentId, students.id))
    .orderBy(desc(paymentRequests.createdAt));
  return rows.map((r) => ({ ...r, createdAt: new Date(r.createdAt).toISOString() }));
}

export async function getStudentPaymentRequests(studentId: number) {
  await ensureDatabaseSeeded();
  const rows = await db
    .select()
    .from(paymentRequests)
    .where(eq(paymentRequests.studentId, studentId))
    .orderBy(desc(paymentRequests.createdAt));
  return rows.map((r) => ({ ...r, createdAt: new Date(r.createdAt).toISOString() }));
}

export async function confirmPaymentRequest(id: number) {
  await ensureDatabaseSeeded();
  const [req] = await db.select().from(paymentRequests).where(eq(paymentRequests.id, id)).limit(1);
  if (!req) throw new Error("Demande de paiement introuvable");
  if (req.status !== "en_attente") throw new Error("Cette demande a dÃ©jÃ  Ã©tÃ© traitÃ©e");

  await db.update(paymentRequests).set({ status: "valide" }).where(eq(paymentRequests.id, id));

  const result = await recordPayment({
    studentId: req.studentId,
    amount: req.amount,
    paymentMethod: req.method,
    recordedBy: `Admin (Paiement en ligne ${req.phone})`,
    notes: `Paiement en ligne validÃ© â€” RÃ©f ${req.reference}`,
    transactionRef: req.reference,
  });

  return result;
}

export async function rejectPaymentRequest(id: number) {
  await ensureDatabaseSeeded();
  const [req] = await db.select().from(paymentRequests).where(eq(paymentRequests.id, id)).limit(1);
  if (!req) throw new Error("Demande de paiement introuvable");
  if (req.status !== "en_attente") throw new Error("Cette demande a dÃ©jÃ  Ã©tÃ© traitÃ©e");

  await db.update(paymentRequests).set({ status: "rejete" }).where(eq(paymentRequests.id, id));
  return { success: true };
}

export async function updateFormation(
  slug: string,
  data: {
    title?: string;
    duration?: string;
    price?: number;
    registrationFee?: number;
    installmentsCount?: number;
    campus?: string;
    mode?: string;
    isActive?: boolean;
    isPopular?: boolean;
  }
) {
  await ensureDatabaseSeeded();
  const [row] = await db
    .update(formations)
    .set(data)
    .where(eq(formations.slug, slug))
    .returning();
  return row || null;
}

function slugify(value: string, fallbackPrefix = "article"): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-");
  return normalized || `${fallbackPrefix}-${randomBytes(3).toString("hex")}`;
}

export async function createBlogArticle(data: {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author?: string;
  readTime?: string;
  category: string;
  publishedAt?: string;
}) {
  await ensureDatabaseSeeded();
  const [row] = await db
    .insert(blogArticles)
    .values({
      title: data.title,
      slug: data.slug || slugify(data.title),
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      author: data.author || "Ã‰quipe PÃ©dagogique FuturCraft",
      readTime: data.readTime || "5 min de lecture",
      category: data.category,
      publishedAt: data.publishedAt || new Date().toISOString(),
    })
    .returning();
  return row;
}

export async function updateBlogArticle(
  slug: string,
  data: {
    title?: string;
    newSlug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    author?: string;
    readTime?: string;
    category?: string;
    publishedAt?: string;
  }
) {
  await ensureDatabaseSeeded();
  const { newSlug, ...rest } = data;
  const patch: Record<string, unknown> = { ...rest };
  if (newSlug) patch.slug = newSlug;
  const [row] = await db
    .update(blogArticles)
    .set(patch)
    .where(eq(blogArticles.slug, slug))
    .returning();
  return row || null;
}

export async function deleteBlogArticle(slug: string) {
  await ensureDatabaseSeeded();
  await db.delete(blogArticles).where(eq(blogArticles.slug, slug));
  return { success: true };
}
