import { NextRequest, NextResponse } from "next/server";
import { confirmPaymentRequest, rejectPaymentRequest } from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const { id } = await context.params;
    const body = await req.json();
    const action = body.action;

    if (action === "confirmer") {
      const result = await confirmPaymentRequest(Number(id));
      return NextResponse.json({
        success: true,
        message: "Paiement confirmé et reçu généré",
        payment: result.payment,
        receipt: result.receipt,
      });
    }

    if (action === "rejeter") {
      await rejectPaymentRequest(Number(id));
      return NextResponse.json({ success: true, message: "Demande de paiement rejetée" });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/payment-requests/[id] error:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}