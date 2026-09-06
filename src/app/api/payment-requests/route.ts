import { NextRequest, NextResponse } from "next/server";
import { createPaymentRequest, getPaymentRequests } from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";
import { getStudentSession } from "@/lib/student-auth";

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const rows = await getPaymentRequests();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/payment-requests error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const studentId = await getStudentSession();
  if (!studentId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const amount = Number(body.amount);
    const method = String(body.method || "");
    const phone = String(body.phone || "");

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }
    if (!method) {
      return NextResponse.json({ error: "Méthode de paiement manquante" }, { status: 400 });
    }
    if (!phone || phone.replace(/\D/g, "").length < 8) {
      return NextResponse.json({ error: "Numéro de téléphone invalide" }, { status: 400 });
    }

    const req2 = await createPaymentRequest({ studentId, amount, method, phone });
    return NextResponse.json({
      success: true,
      message: "Demande de paiement envoyée. Elle sera validée par notre équipe.",
      paymentRequest: req2,
    });
  } catch (error) {
    console.error("POST /api/payment-requests error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}