import { NextRequest, NextResponse } from "next/server";
import { createStudentWithPlan, getFormations } from "@/lib/data-service";
import { sendInscriptionEmails } from "@/lib/email";
import { getClientIp, rateLimitKey, recordAttempt, resetAttempts, tooManyAttempts } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const key = rateLimitKey(ip, "inscription-post");
  const limit = await tooManyAttempts(key);
  if (limit.blocked) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard.", retryAfter: limit.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    if (!body.firstName || !body.lastName || !email || !phone || !body.formationId) {
      await recordAttempt(key);
      return NextResponse.json(
        { error: "Veuillez renseigner tous les champs obligatoires (nom, prénom, email, téléphone, formation)" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      await recordAttempt(key);
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const student = await createStudentWithPlan({
      firstName: String(body.firstName).trim(),
      lastName: String(body.lastName).trim(),
      gender: body.gender || "M",
      email,
      phone,
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

    const [formation] = await getFormations().then((rows) => rows.filter((f) => f.id === student.formationId));
    void sendInscriptionEmails({
      studentNumber: student.studentNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      formationTitle: formation?.title || "Formation FuturCraft",
      totalAmount: student.totalAmount,
      phone: student.phone,
    });

    await resetAttempts(key);
    return NextResponse.json({
      success: true,
      message: "Préinscription enregistrée. Votre dossier est en attente de validation par l'administration.",
      pendingValidation: true,
      studentNumber: student.studentNumber,
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
