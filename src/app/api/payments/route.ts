import { NextRequest, NextResponse } from "next/server";
import { recordPayment } from "@/lib/data-service";
import { db } from "@/db";
import { payments, students, formations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/db/ensure-seed";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    await ensureDatabaseSeeded();
    const rows = await db
      .select({
        id: payments.id,
        receiptNumber: payments.receiptNumber,
        studentId: payments.studentId,
        scheduleId: payments.scheduleId,
        amount: payments.amount,
        paymentMethod: payments.paymentMethod,
        transactionRef: payments.transactionRef,
        status: payments.status,
        notes: payments.notes,
        recordedBy: payments.recordedBy,
        paidAt: payments.paidAt,
        createdAt: payments.createdAt,
        studentFirstName: students.firstName,
        studentLastName: students.lastName,
        studentNumber: students.studentNumber,
        formationTitle: formations.title,
      })
      .from(payments)
      .leftJoin(students, eq(payments.studentId, students.id))
      .leftJoin(formations, eq(students.formationId, formations.id))
      .orderBy(desc(payments.createdAt));

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/payments error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const body = await req.json().catch(() => ({}));
    const studentId = Number(body.studentId);
    const amount = Number(body.amount);
    const paymentMethod = String(body.paymentMethod || "").trim();
    const scheduleId = body.scheduleId !== undefined && body.scheduleId !== null ? Number(body.scheduleId) : undefined;

    if (!Number.isInteger(studentId) || studentId <= 0 || !Number.isInteger(amount) || amount <= 0 || !paymentMethod) {
      return NextResponse.json(
        { error: "Paramètres invalides (studentId, amount > 0, paymentMethod requis)" },
        { status: 400 }
      );
    }
    if (scheduleId !== undefined && (!Number.isInteger(scheduleId) || scheduleId <= 0)) {
      return NextResponse.json({ error: "scheduleId invalide" }, { status: 400 });
    }

    const result = await recordPayment({
      studentId,
      scheduleId,
      amount,
      paymentMethod,
      recordedBy: typeof body.recordedBy === "string" ? body.recordedBy : undefined,
      notes: typeof body.notes === "string" ? body.notes : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Paiement enregistré et reçu généré avec succès",
      payment: result.payment,
      receipt: result.receipt,
    });
  } catch (error: any) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur lors de l'enregistrement du paiement" },
      { status: 500 }
    );
  }
}
