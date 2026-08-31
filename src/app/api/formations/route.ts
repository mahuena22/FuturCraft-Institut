import { NextResponse } from "next/server";
import { getFormations } from "@/lib/data-service";

export async function GET() {
  try {
    const data = await getFormations();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/formations error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
