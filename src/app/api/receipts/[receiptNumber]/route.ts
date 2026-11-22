import { NextRequest, NextResponse } from "next/server";
import { getReceiptDetails } from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";
import { getStudentSession } from "@/lib/student-auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ receiptNumber: string }> }
) {
  try {
    const { receiptNumber } = await context.params;
    const code = String(req.nextUrl.searchParams.get("code") || "").trim();
    const isAdmin = !(await requireAuth());
    const studentId = await getStudentSession();

    const details = await getReceiptDetails(receiptNumber, {
      verificationCode: code || undefined,
      studentId: !isAdmin ? studentId ?? undefined : undefined,
      includeSensitive: isAdmin,
    });
    if (!details) {
      return NextResponse.json({ error: "Reçu introuvable" }, { status: 404 });
    }
    if (!isAdmin && !studentId && !code) {
      return NextResponse.json({ error: "Code de vérification requis" }, { status: 403 });
    }
    return NextResponse.json(details);
  } catch (error) {
    console.error("GET /api/receipts/[receiptNumber] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
