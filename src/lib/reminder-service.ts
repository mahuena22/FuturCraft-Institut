"use server";

import { db } from "@/db";
import { eq, and, lt, gte, or, sql } from "drizzle-orm";
import {
  students,
  paymentSchedules,
  notifications,
  users,
  formations,
} from "@/db/schema";
import { sendEmail } from "@/lib/email";

interface OverdueSchedule {
  id: number;
  studentId: number;
  title: string;
  amount: number;
  dueDate: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  formationTitle: string;
  daysOverdue: number;
}

interface ReminderResult {
  totalOverdue: number;
  remindersSent: number;
  emailsSent: number;
  notificationsCreated: number;
  errors: string[];
}

/**
 * Récupère toutes les échéances en retard
 */
export async function getOverdueSchedules(): Promise<OverdueSchedule[]> {
  const today = new Date().toISOString().split("T")[0];

  const results = await db
    .select({
      id: paymentSchedules.id,
      studentId: paymentSchedules.studentId,
      title: paymentSchedules.title,
      amount: paymentSchedules.amount,
      dueDate: paymentSchedules.dueDate,
      studentNumber: students.studentNumber,
      firstName: students.firstName,
      lastName: students.lastName,
      email: students.email,
      phone: students.phone,
      formationTitle: formations.title,
    })
    .from(paymentSchedules)
    .innerJoin(students, eq(paymentSchedules.studentId, students.id))
    .innerJoin(formations, eq(students.formationId, formations.id))
    .where(
      and(
        eq(paymentSchedules.status, "en_attente"),
        lt(paymentSchedules.dueDate, today),
        or(
          gte(paymentSchedules.dueDate, sql`CURRENT_DATE - INTERVAL '90 DAYS'`),
          sql`TRUE`
        )
      )
    )
    .orderBy(paymentSchedules.dueDate);

  return results.map((r) => ({
    ...r,
    daysOverdue: Math.floor(
      (new Date().getTime() - new Date(r.dueDate).getTime()) / (1000 * 60 * 60 * 24)
    ),
  }));
}

/**
 * Envoie un email de rappel
 */
async function sendReminderEmail(
  email: string,
  firstName: string,
  schedule: OverdueSchedule
): Promise<boolean> {
  try {
    await sendEmail({
      to: email,
      subject: `Rappel : Échéance impayée - ${schedule.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #051269; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">FuturCraft Institut</h1>
          </div>
          <div style="padding: 20px; background: #f8faff;">
            <p>Bonjour <strong>${firstName}</strong>,</p>
            <p>Nous vous rappelons que votre paiement est en retard :</p>
            
            <div style="background: white; border-left: 4px solid #125195; padding: 15px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Échéance :</strong> ${schedule.title}</p>
              <p style="margin: 5px 0;"><strong>Montant :</strong> ${schedule.amount.toLocaleString("fr-FR")} FCFA</p>
              <p style="margin: 5px 0;"><strong>Date d'échéance :</strong> ${new Date(schedule.dueDate).toLocaleDateString("fr-FR")}</p>
              <p style="margin: 5px 0; color: #dc2626;"><strong>Retard :</strong> ${schedule.daysOverdue} jour(s)</p>
              <p style="margin: 5px 0;"><strong>Formation :</strong> ${schedule.formationTitle}</p>
            </div>

            <p>Merci de régulariser votre situation au plus vite via :</p>
            <ul>
              <li>Votre <a href="https://futurcraft.bj/espace-etudiant" style="color: #125195;">Espace Étudiant</a></li>
              <li>Mobile Money (MTN / Moov)</li>
              <li>Caisse de l'institut (Godomey)</li>
            </ul>

            <p style="font-size: 12px; color: #666; margin-top: 30px;">
              Si vous avez déjà effectué ce paiement, merci d'ignorer ce message.
              Contactez-nous au +229 43 32 78 32 pour toute question.
            </p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Erreur envoi email rappel:", error);
    return false;
  }
}

/**
 * Crée une notification in-app
 */
async function createInAppNotification(
  studentId: number,
  schedule: OverdueSchedule
): Promise<void> {
  await db.insert(notifications).values({
    studentId,
    title: "Rappel : Échéance impayée",
    message: `Votre échéance "${schedule.title}" de ${schedule.amount.toLocaleString("fr-FR")} FCFA est en retard de ${schedule.daysOverdue} jour(s). Merci de régulariser.`,
    type: "payment",
  });
}

/**
 * Envoie un SMS via WhatsApp (via lien wa.me)
 * Note: Pour un vrai SMS, intégrer Twilio/Orange API
 */
async function sendWhatsAppReminder(
  phone: string,
  firstName: string,
  schedule: OverdueSchedule
): Promise<boolean> {
  try {
    const message = encodeURIComponent(
      `Bonjour ${firstName}, rappel : votre échéance "${schedule.title}" de ${schedule.amount.toLocaleString("fr-FR")} FCFA est en retard de ${schedule.daysOverdue} jour(s). Merci de régulariser via votre Espace Étudiant ou en caisse. FuturCraft Institut.`
    );
    const waLink = `https://wa.me/229${phone.replace(/\D/g, "")}?text=${message}`;
    
    // En production, utiliser une vraie API SMS/WhatsApp Business
    // Pour l'instant, on log le lien
    console.log(`WhatsApp reminder link for ${firstName}: ${waLink}`);
    return true;
  } catch (error) {
    console.error("Erreur WhatsApp reminder:", error);
    return false;
  }
}

/**
 * Fonction principale : vérifie et envoie les rappels
 */
export async function processPaymentReminders(): Promise<ReminderResult> {
  const result: ReminderResult = {
    totalOverdue: 0,
    remindersSent: 0,
    emailsSent: 0,
    notificationsCreated: 0,
    errors: [],
  };

  try {
    const overdueSchedules = await getOverdueSchedules();
    result.totalOverdue = overdueSchedules.length;

    if (overdueSchedules.length === 0) {
      console.log("Aucune échéance en retard trouvée.");
      return result;
    }

    console.log(`${overdueSchedules.length} échéance(s) en retard trouvée(s).`);

    for (const schedule of overdueSchedules) {
      try {
        // 1. Créer notification in-app
        await createInAppNotification(schedule.studentId, schedule);
        result.notificationsCreated++;

        // 2. Envoyer email
        const emailSent = await sendReminderEmail(
          schedule.email,
          schedule.firstName,
          schedule
        );
        if (emailSent) result.emailsSent++;

        // 3. WhatsApp (si numéro dispo)
        const phone = schedule.whatsapp || schedule.phone;
        if (phone) {
          await sendWhatsAppReminder(phone, schedule.firstName, schedule);
        }

        // Marquer comme "rappel envoyé" (optionnel: ajouter champ reminderSentAt)
        // await db.update(paymentSchedules).set({ reminderSentAt: new Date() }).where(eq(paymentSchedules.id, schedule.id));

        result.remindersSent++;
        console.log(`Rappel envoyé pour ${schedule.studentNumber} - ${schedule.title}`);
      } catch (error) {
        const errorMsg = `Erreur pour ${schedule.studentNumber}: ${error}`;
        console.error(errorMsg);
        result.errors.push(errorMsg);
      }
    }

    console.log(`Traitement terminé: ${result.remindersSent}/${result.totalOverdue} rappels envoyés`);
    return result;
  } catch (error) {
    console.error("Erreur globale processPaymentReminders:", error);
    result.errors.push(`Erreur globale: ${error}`);
    return result;
  }
}

/**
 * Vérifie les échéances à venir (J-3, J-7) pour rappels préventifs
 */
export async function getUpcomingSchedules(daysAhead: number = 3): Promise<OverdueSchedule[]> {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysAhead);
  const targetDateStr = targetDate.toISOString().split("T")[0];

  const results = await db
    .select({
      id: paymentSchedules.id,
      studentId: paymentSchedules.studentId,
      title: paymentSchedules.title,
      amount: paymentSchedules.amount,
      dueDate: paymentSchedules.dueDate,
      studentNumber: students.studentNumber,
      firstName: students.firstName,
      lastName: students.lastName,
      email: students.email,
      phone: students.phone,
      formationTitle: formations.title,
    })
    .from(paymentSchedules)
    .innerJoin(students, eq(paymentSchedules.studentId, students.id))
    .innerJoin(formations, eq(students.formationId, formations.id))
    .where(
      and(
        eq(paymentSchedules.status, "en_attente"),
        eq(paymentSchedules.dueDate, targetDateStr)
      )
    );

  return results.map((r) => ({
    ...r,
    daysOverdue: -daysAhead, // négatif = à venir
  }));
}

/**
 * Envoie les rappels préventifs (J-3, J-7)
 */
export async function processUpcomingReminders(daysAhead: number = 3): Promise<ReminderResult> {
  const result: ReminderResult = {
    totalOverdue: 0,
    remindersSent: 0,
    emailsSent: 0,
    notificationsCreated: 0,
    errors: [],
  };

  try {
    const upcomingSchedules = await getUpcomingSchedules(daysAhead);
    result.totalOverdue = upcomingSchedules.length;

    for (const schedule of upcomingSchedules) {
      try {
        // Notification in-app
        await createInAppNotification(schedule.studentId, {
          ...schedule,
          daysOverdue: -daysAhead,
        });
        result.notificationsCreated++;

        // Email préventif
        const emailSent = await sendReminderEmail(
          schedule.email,
          schedule.firstName,
          { ...schedule, daysOverdue: -daysAhead }
        );
        if (emailSent) result.emailsSent++;

        result.remindersSent++;
      } catch (error) {
        result.errors.push(`Erreur ${schedule.studentNumber}: ${error}`);
      }
    }

    return result;
  } catch (error) {
    result.errors.push(`Erreur globale: ${error}`);
    return result;
  }
}

/**
 * Statistiques de recouvrement
 */
export async function getRecoveryStats() {
  const allSchedules = await db.select().from(paymentSchedules);
  const today = new Date().toISOString().split("T")[0];

  const total = allSchedules.length;
  const paid = allSchedules.filter((s) => s.status === "paye").length;
  const pending = allSchedules.filter((s) => s.status === "en_attente").length;
  const overdue = allSchedules.filter(
    (s) => s.status === "en_attente" && s.dueDate < new Date().toISOString().split("T")[0]
  ).length;

  const totalAmount = allSchedules.reduce((sum, s) => sum + s.amount, 0);
  const paidAmount = allSchedules
    .filter((s) => s.status === "paye")
    .reduce((sum, s) => sum + s.amount, 0);
  const overdueAmount = allSchedules
    .filter((s) => s.status === "en_attente" && s.dueDate < new Date().toISOString().split("T")[0])
    .reduce((sum, s) => sum + s.amount, 0);

  return {
    total,
    paid,
    pending,
    overdue,
    totalAmount,
    paidAmount,
    overdueAmount,
    recoveryRate: totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0,
  };
}