import { getAdminStats, getAllStudents, getFormations, getPartnershipRequests } from "@/lib/data-service";
import { AdminPortal } from "@/components/AdminPortal";
import { AdminLogin } from "@/components/AdminLogin";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/db";
import { payments, students, formations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Console d'Administration | FuturCraft Institut",
  description: "Gestion des étudiants, encaissements, cursus, rôles et statistiques administratives.",
};

export default async function AdminPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return <AdminLogin />;
  }

  const stats = await getAdminStats();
  const rawStudents = await getAllStudents();
  const formationsList = await getFormations();
  const partnerships = await getPartnershipRequests();

  const rawPayments = await db
    .select({
      id: payments.id,
      receiptNumber: payments.receiptNumber,
      studentId: payments.studentId,
      amount: payments.amount,
      paymentMethod: payments.paymentMethod,
      transactionRef: payments.transactionRef,
      status: payments.status,
      notes: payments.notes,
      recordedBy: payments.recordedBy,
      paidAt: payments.paidAt,
      studentFirstName: students.firstName,
      studentLastName: students.lastName,
      studentNumber: students.studentNumber,
      formationTitle: formations.title,
    })
    .from(payments)
    .leftJoin(students, eq(payments.studentId, students.id))
    .leftJoin(formations, eq(students.formationId, formations.id))
    .orderBy(desc(payments.createdAt));

  return (
    <AdminPortal
      initialStats={stats}
      initialStudents={rawStudents}
      initialPayments={rawPayments}
      formationsList={formationsList}
      initialPartnerships={partnerships}
    />
  );
}
