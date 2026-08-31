import { NextRequest, NextResponse } from "next/server";
import { getCompanyOffers } from "@/lib/data-service";
import { db } from "@/db";
import { companyOffers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const offers = await getCompanyOffers();
    return NextResponse.json(offers);
  } catch (error) {
    console.error("GET /api/offers error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.companyName || !body.title || !body.email || !body.offerType) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const [offer] = await db
      .insert(companyOffers)
      .values({
        companyName: body.companyName,
        contactPerson: body.contactPerson || "Recruteur",
        email: body.email,
        phone: body.phone || "",
        offerType: body.offerType,
        title: body.title,
        location: body.location || "Cotonou / Hybride",
        description: body.description || "",
        skillsRequired: body.skillsRequired || "",
        deadline: body.deadline || "2025-06-30",
        status: "publie",
      })
      .returning();

    return NextResponse.json({ success: true, offer });
  } catch (error) {
    console.error("POST /api/offers error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "ID et status requis" }, { status: 400 });
    }

    const [updated] = await db
      .update(companyOffers)
      .set({ status: body.status })
      .where(eq(companyOffers.id, Number(body.id)))
      .returning();

    return NextResponse.json({ success: true, offer: updated });
  } catch (error) {
    console.error("PATCH /api/offers error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
