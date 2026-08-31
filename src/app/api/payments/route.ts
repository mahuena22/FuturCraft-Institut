import { NextRequest, NextResponse } from "next/server";
import { recordPayment } from "@/lib/data-service";
import { db } from "@/db";
import { payments, students, formations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/db/ensure-seed";

export async function GET() {
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
  try {
    const body = await req.json();
    if (!body.studentId || !body.amount || !body.paymentMethod) {
      return NextResponse.json(
        { error: "Paramètres manquants (studentId, amount, paymentMethod requis)" },
        { status: 400 }
      );
    }

    const result = await recordPayment({
      studentId: Number(body.studentId),
      scheduleId: body.scheduleId ? Number(body.scheduleId) : undefined,
      amount: Number(body.amount),
      paymentMethod: body.paymentMethod,
      recordedBy: body.recordedBy,
      notes: body.notes,
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
