import { NextRequest, NextResponse } from "next/server";
import { getReceiptDetails } from "@/lib/data-service";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ receiptNumber: string }> }
) {
  try {
    const { receiptNumber } = await context.params;
    const details = await getReceiptDetails(receiptNumber);
    if (!details) {
      return NextResponse.json({ error: "Reçu introuvable" }, { status: 404 });
    }
    return NextResponse.json(details);
  } catch (error) {
    console.error("GET /api/receipts/[receiptNumber] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
