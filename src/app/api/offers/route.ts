import { NextRequest, NextResponse } from "next/server";
import { getCompanyOffers } from "@/lib/data-service";
import { db } from "@/db";
import { companyOffers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import {
  getClientIp,
  rateLimitKey,
  recordAttempt,
  resetAttempts,
  tooManyAttempts,
} from "@/lib/rate-limit";

const ALLOWED_OFFER_STATUS = new Set(["publie", "ferme", "brouillon"]);

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
  const ip = getClientIp(req);
  const key = rateLimitKey(ip, "offers-post");
  const limit = await tooManyAttempts(key);
  if (limit.blocked) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard.", retryAfter: limit.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }
  try {
    const body = await req.json().catch(() => ({}));
    const companyName = String(body.companyName || "").trim();
    const title = String(body.title || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const offerType = String(body.offerType || "").trim();
    if (!companyName || !title || !email || !offerType) {
      await recordAttempt(key);
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      await recordAttempt(key);
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const [offer] = await db
      .insert(companyOffers)
      .values({
        companyName,
        contactPerson: String(body.contactPerson || "Recruteur").trim(),
        email,
        phone: String(body.phone || "").trim(),
        offerType,
        title,
        location: String(body.location || "Cotonou / Hybride").trim(),
        description: String(body.description || "").trim(),
        skillsRequired: String(body.skillsRequired || "").trim(),
        deadline: String(body.deadline || "2026-12-31").trim(),
        status: "publie",
      })
      .returning();

    await resetAttempts(key);
    return NextResponse.json({ success: true, offer }, { status: 201 });
  } catch (error) {
    console.error("POST /api/offers error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const body = await req.json().catch(() => ({}));
    const id = Number(body.id);
    const status = String(body.status || "").trim();
    if (!Number.isInteger(id) || id <= 0 || !ALLOWED_OFFER_STATUS.has(status)) {
      return NextResponse.json({ error: "ID ou status invalide" }, { status: 400 });
    }

    const [updated] = await db
      .update(companyOffers)
      .set({ status })
      .where(eq(companyOffers.id, id))
      .returning();
    if (!updated) return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });

    return NextResponse.json({ success: true, offer: updated });
  } catch (error) {
    console.error("PATCH /api/offers error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
