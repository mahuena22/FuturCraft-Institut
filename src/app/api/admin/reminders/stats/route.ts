import { NextResponse } from "next/server";
import { db } from "@/db";
import { eq, lt, sql, and } from "drizzle-orm";
import { paymentSchedules, students, formations } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const today = new Date().toISOString().split("T")[0];

    // Échéances en retard
    const overdueSchedules = await db
      .select({
        amount: paymentSchedules.amount,
      })
      .from(paymentSchedules)
      .where(
        and(
          eq(paymentSchedules.status, "en_attente"),
          lt(paymentSchedules.dueDate, today)
        )
      );

    const totalOverdue = overdueSchedules.length;
    const totalOverdueAmount = overdueSchedules.reduce((sum, s) => sum + s.amount, 0);

    // Pour les stats de rappels envoyés, on pourrait ajouter un champ reminderSentAt
    // Pour l'instant, on retourne les stats basiques
    return NextResponse.json({
      totalOverdue,
      totalOverdueAmount,
      remindersSent: 0, // À implémenter avec un champ reminderSentAt
      emailsSent: 0,
      notificationsCreated: 0,
    });
  } catch (error) {
    console.error("Erreur stats reminders:", error);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 }
    );
  }
}