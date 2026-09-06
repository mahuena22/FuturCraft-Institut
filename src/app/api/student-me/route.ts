import { NextRequest, NextResponse } from "next/server";
import { getStudentById } from "@/lib/data-service";
import { getStudentSession } from "@/lib/student-auth";
import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const studentId = await getStudentSession();
  if (!studentId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const studentData = await getStudentById(studentId);
    if (!studentData) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
    }
    return NextResponse.json(studentData);
  } catch (error) {
    console.error("GET /api/student-me error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const studentId = await getStudentSession();
  if (!studentId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const [updated] = await db
      .update(students)
      .set({
        ...(body.phone && { phone: String(body.phone) }),
        ...(body.whatsapp && { whatsapp: String(body.whatsapp) }),
        ...(body.city !== undefined && { city: body.city ? String(body.city) : null }),
        ...(body.address !== undefined && { address: body.address ? String(body.address) : null }),
      })
      .where(eq(students.id, studentId))
      .returning();
    return NextResponse.json({ success: true, student: updated });
  } catch (error) {
    console.error("PATCH /api/student-me error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}