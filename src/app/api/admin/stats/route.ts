import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
