import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { partnershipRequests } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { sendPartnershipEmail } from "@/lib/email";

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
  try {
    const body = await req.json();
    if (!body.companyName || !body.contactName || !body.email || !body.partnershipType) {
      return NextResponse.json(
        { error: "Champs requis manquants (companyName, contactName, email, partnershipType)" },
        { status: 400 }
      );
    }

    const [request] = await db
      .insert(partnershipRequests)
      .values({
        companyName: body.companyName,
        contactName: body.contactName,
        email: body.email,
        phone: body.phone || "",
        partnershipType: body.partnershipType,
        message: body.message || "",
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

    return NextResponse.json({ success: true, request });
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