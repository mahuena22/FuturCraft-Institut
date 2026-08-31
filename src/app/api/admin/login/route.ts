import { NextRequest, NextResponse } from "next/server";
import { authenticate, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = typeof body?.password === "string" ? body.password : "";
    const result = authenticate(password);

    if (!result.ok || !result.cookie) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

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
