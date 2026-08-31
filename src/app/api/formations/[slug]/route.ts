import { NextRequest, NextResponse } from "next/server";
import { getFormationBySlug, getPromotions } from "@/lib/data-service";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const formation = await getFormationBySlug(slug);
    if (!formation) {
      return NextResponse.json({ error: "Formation non trouvée" }, { status: 404 });
    }
    const promos = await getPromotions(formation.id);
    return NextResponse.json({ formation, promotions: promos });
  } catch (error) {
    console.error("GET /api/formations/[slug] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
