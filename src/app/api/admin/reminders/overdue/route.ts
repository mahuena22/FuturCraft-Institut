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

    const overdueSchedules = await db
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
        whatsapp: students.whatsapp,
        formationTitle: formations.title,
      })
      .from(paymentSchedules)
      .innerJoin(students, eq(paymentSchedules.studentId, students.id))
      .innerJoin(formations, eq(students.formationId, formations.id))
      .where(
        and(
          eq(paymentSchedules.status, "en_attente"),
          lt(paymentSchedules.dueDate, today)
        )
      )
      .orderBy(paymentSchedules.dueDate);

    const results = overdueSchedules.map((r) => ({
      ...r,
      daysOverdue: Math.floor(
        (new Date().getTime() - new Date(r.dueDate).getTime()) / (1000 * 60 * 60 * 24)
      ),
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Erreur overdue schedules:", error);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 }
    );
  }
}