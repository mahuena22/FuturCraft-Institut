import { NextRequest, NextResponse } from "next/server";
import { getStudentById } from "@/lib/data-service";
import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const studentData = await getStudentById(Number(id));
    if (!studentData) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
    }
    return NextResponse.json(studentData);
  } catch (error) {
    console.error("GET /api/students/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const [updated] = await db
      .update(students)
      .set({
        ...(body.firstName && { firstName: body.firstName }),
        ...(body.lastName && { lastName: body.lastName }),
        ...(body.phone && { phone: body.phone }),
        ...(body.whatsapp && { whatsapp: body.whatsapp }),
        ...(body.email && { email: body.email }),
        ...(body.city && { city: body.city }),
        ...(body.address && { address: body.address }),
        ...(body.status && { status: body.status }),
        ...(body.promotionId !== undefined && { promotionId: body.promotionId }),
        ...(body.avatarUrl && { avatarUrl: body.avatarUrl }),
        ...(body.guardianName && { guardianName: body.guardianName }),
        ...(body.guardianPhone && { guardianPhone: body.guardianPhone }),
      })
      .where(eq(students.id, Number(id)))
      .returning();

    return NextResponse.json({ success: true, student: updated });
  } catch (error) {
    console.error("PATCH /api/students/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
