import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { students, formations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { validateStudent, rejectStudent } from "@/lib/data-service";

// GET /api/admin/admissions - list all students with formation for the admissions dashboard
export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const rows = await db
      .select({
        id: students.id,
        studentNumber: students.studentNumber,
        firstName: students.firstName,
        lastName: students.lastName,
        email: students.email,
        phone: students.phone,
        city: students.city,
        status: students.status,
        profileVisible: students.profileVisible,
        validationNote: students.validationNote,
        validatedBy: students.validatedBy,
        formationId: students.formationId,
        formationTitle: formations.title,
        validatedAt: students.validatedAt,
        createdAt: students.createdAt,
      })
      .from(students)
      .leftJoin(formations, eq(students.formationId, formations.id))
      .orderBy(desc(students.createdAt));

    return NextResponse.json(
      rows.map((r) => ({
        ...r,
        createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
        validatedAt: r.validatedAt instanceof Date ? r.validatedAt.toISOString() : null,
      }))
    );
  } catch (error) {
    console.error("GET /api/admin/admissions error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/admin/admissions - validate or reject a student
export async function PATCH(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const body = await req.json();
    const { studentId, action, note } = body;
    if (!studentId || !["validate", "reject"].includes(action)) {
      return NextResponse.json({ error: "studentId et action (validate|reject) requis" }, { status: 400 });
    }

    const result =
      action === "validate"
        ? await validateStudent(Number(studentId), "Yoan Melson DANSOU", note)
        : await rejectStudent(Number(studentId), "Yoan Melson DANSOU", note);

    return NextResponse.json({ success: true, student: result });
  } catch (error) {
    console.error("PATCH /api/admin/admissions error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}