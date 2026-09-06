import { NextRequest, NextResponse } from "next/server";
import { findStudentByCredentials } from "@/lib/data-service";
import { createStudentSession } from "@/lib/student-auth";
import {
  recordAttempt,
  resetAttempts,
  tooManyAttempts,
  rateLimitKey,
  getClientIp,
} from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const studentNumber = String(body.studentNumber || "").trim();
    const phone = String(body.phone || "").trim();

    const ip = getClientIp(req);
    const matriculeKey = rateLimitKey(ip, `student|${studentNumber}`);
    const ipKey = rateLimitKey(ip, "student-ip");

    const limit = await tooManyAttempts(matriculeKey);
    const ipLimit = await tooManyAttempts(ipKey);
    if (limit.blocked || ipLimit.blocked) {
      const retryAfter = Math.max(limit.retryAfterSeconds, ipLimit.retryAfterSeconds);
      return NextResponse.json(
        {
          error:
            "Trop de tentatives. Compte temporairement bloqué. Réessayez plus tard.",
          retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    if (!studentNumber || !phone) {
      await recordAttempt(matriculeKey);
      await recordAttempt(ipKey);
      return NextResponse.json(
        { error: "Veuillez saisir votre matricule et votre numéro de téléphone" },
        { status: 400 }
      );
    }

    const student = await findStudentByCredentials(studentNumber, phone);
    if (!student) {
      await recordAttempt(matriculeKey);
      await recordAttempt(ipKey);
      return NextResponse.json(
        { error: "Matricule ou téléphone incorrect. Vérifiez vos informations." },
        { status: 401 }
      );
    }

    await resetAttempts(matriculeKey);
    await createStudentSession(student.id);
    return NextResponse.json({ success: true, studentId: student.id, name: student.firstName });
  } catch (error) {
    console.error("POST /api/student-login error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}