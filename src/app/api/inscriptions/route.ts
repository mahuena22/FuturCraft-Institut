import { NextRequest, NextResponse } from "next/server";
import { createStudentWithPlan } from "@/lib/data-service";
import { createStudentSession } from "@/lib/student-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.firstName || !body.lastName || !body.email || !body.phone || !body.formationId) {
      return NextResponse.json(
        { error: "Veuillez renseigner tous les champs obligatoires (nom, prénom, email, téléphone, formation)" },
        { status: 400 }
      );
    }

    const student = await createStudentWithPlan({
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender || "M",
      email: body.email,
      phone: body.phone,
      whatsapp: body.whatsapp,
      city: body.city,
      formationId: Number(body.formationId),
      promotionId: body.promotionId ? Number(body.promotionId) : undefined,
      previousDiploma: body.previousDiploma,
      studyLevel: body.studyLevel,
      previousSchool: body.previousSchool,
      guardianName: body.guardianName,
      guardianPhone: body.guardianPhone,
      guardianRelation: body.guardianRelation,
      residenceCountry: body.residenceCountry,
    });

    // Auto-authenticate the newly registered student
    await createStudentSession(student.id);

    return NextResponse.json({
      success: true,
      message: "Préinscription enregistrée avec succès",
      student,
    });
  } catch (error: any) {
    console.error("POST /api/inscriptions error:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur lors de l'enregistrement de l'inscription" },
      { status: 500 }
    );
  }
}
