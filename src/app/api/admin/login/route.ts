import { NextRequest, NextResponse } from "next/server";
import { authenticate, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth";
import {
  recordAttempt,
  resetAttempts,
  tooManyAttempts,
  rateLimitKey,
  getClientIp,
} from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = typeof body?.password === "string" ? body.password : "";
    // Clé par IP : l'admin est un compte unique, un attaquant essaie de nombreux
    // mots de passe, il faut bloquer l'IP, pas une valeur de mot de passe donnée.
    const key = rateLimitKey(getClientIp(req), "admin");

    const limit = tooManyAttempts(key);
    if (limit.blocked) {
      return NextResponse.json(
        {
          error:
            "Trop de tentatives. Compte temporairement bloqué. Réessayez plus tard.",
          retryAfter: limit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        }
      );
    }

    const result = authenticate(password);

    if (!result.ok || !result.cookie) {
      recordAttempt(key);
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

    // Succès → réinitialise la jauge pour cet identifiant
    resetAttempts(key);

    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE_NAME, result.cookie, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  } catch (error) {
    console.error("POST /api/admin/login error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
