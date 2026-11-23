import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { partnershipRequests } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { sendPartnershipEmail } from "@/lib/email";
import { getClientIp, rateLimitKey, recordAttempt, resetAttempts, tooManyAttempts } from "@/lib/rate-limit";

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const rows = await db
      .select()
      .from(partnershipRequests)
      .orderBy(desc(partnershipRequests.createdAt));
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/partnerships error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const key = rateLimitKey(ip, "partnerships-post");
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
    const contactName = String(body.contactName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const partnershipType = String(body.partnershipType || "").trim();
    if (!companyName || !contactName || !email || !partnershipType) {
      await recordAttempt(key);
      return NextResponse.json(
        { error: "Champs requis manquants (companyName, contactName, email, partnershipType)" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      await recordAttempt(key);
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const [request] = await db
      .insert(partnershipRequests)
      .values({
        companyName,
        contactName,
        email,
        phone: String(body.phone || "").trim(),
        partnershipType,
        message: String(body.message || "").trim(),
        status: "nouveau",
      })
      .returning();

    void sendPartnershipEmail({
      companyName: request.companyName,
      contactName: request.contactName,
      email: request.email,
      phone: request.phone,
      partnershipType: request.partnershipType,
      message: request.message || "",
    });

    await resetAttempts(key);
    return NextResponse.json({ success: true, request }, { status: 201 });
  } catch (error) {
    console.error("POST /api/partnerships error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "ID et status requis" }, { status: 400 });
    }
    const [updated] = await db
      .update(partnershipRequests)
      .set({ status: body.status })
      .where(eq(partnershipRequests.id, Number(body.id)))
      .returning();
    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("PATCH /api/partnerships error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}