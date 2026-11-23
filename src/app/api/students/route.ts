import { NextRequest, NextResponse } from "next/server";
import { getAllStudents, createStudentWithPlan } from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const students = await getAllStudents();
    return NextResponse.json(students);
  } catch (error) {
    console.error("GET /api/students error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const body = await req.json().catch(() => ({}));
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const formationId = Number(body.formationId);

    if (!firstName || !lastName || !isValidEmail(email) || !phone || !Number.isInteger(formationId) || formationId <= 0) {
      return NextResponse.json(
        { error: "Champs requis/invalides (firstName, lastName, email, phone, formationId)" },
        { status: 400 }
      );
    }

    const student = await createStudentWithPlan({
      ...body,
      firstName,
      lastName,
      email,
      phone,
      formationId,
      promotionId: body.promotionId ? Number(body.promotionId) : undefined,
    });
    return NextResponse.json({ success: true, student }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/students error:", error);
    const message = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
