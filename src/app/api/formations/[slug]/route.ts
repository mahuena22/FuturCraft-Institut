import { NextRequest, NextResponse } from "next/server";
import { updateFormation } from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const { slug } = await params;
    const body = await req.json();

    const patch: Record<string, unknown> = {};
    if (typeof body.title === "string" && body.title.trim()) patch.title = body.title.trim();
    if (typeof body.duration === "string" && body.duration.trim()) patch.duration = body.duration.trim();
    if (typeof body.campus === "string" && body.campus.trim()) patch.campus = body.campus.trim();
    if (typeof body.mode === "string" && body.mode.trim()) patch.mode = body.mode.trim();
    if (typeof body.price === "number" && body.price >= 0) patch.price = body.price;
    if (typeof body.registrationFee === "number" && body.registrationFee >= 0) patch.registrationFee = body.registrationFee;
    if (typeof body.installmentsCount === "number" && body.installmentsCount > 0) patch.installmentsCount = body.installmentsCount;
    if (typeof body.isActive === "boolean") patch.isActive = body.isActive;
    if (typeof body.isPopular === "boolean") patch.isPopular = body.isPopular;

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 });
    }

    const row = await updateFormation(slug, patch);
    if (!row) {
      return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
    }
    return NextResponse.json({ success: true, formation: row });
  } catch (error) {
    console.error("PATCH /api/formations/[slug] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}