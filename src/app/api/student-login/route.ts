import { NextRequest, NextResponse } from "next/server";
import { findStudentByCredentials } from "@/lib/data-service";
import { createStudentSession } from "@/lib/student-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const studentNumber = String(body.studentNumber || "").trim();
    const phone = String(body.phone || "").trim();
    if (!studentNumber || !phone) {
      return NextResponse.json(
        { error: "Veuillez saisir votre matricule et votre numéro de téléphone" },
        { status: 400 }
      );
    }

    const student = await findStudentByCredentials(studentNumber, phone);
    if (!student) {
      return NextResponse.json(
        { error: "Matricule ou téléphone incorrect. Vérifiez vos informations." },
        { status: 401 }
      );
    }

    await createStudentSession(student.id);
    return NextResponse.json({ success: true, studentId: student.id, name: student.firstName });
  } catch (error) {
    console.error("POST /api/student-login error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}