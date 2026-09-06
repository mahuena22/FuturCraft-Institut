import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "fc_admin_session";
const MAX_AGE = 60 * 60 * 24 * 2; // 2 days

function secret(): string {
  return process.env.ADMIN_PASSWORD || "";
}

function sign(value: string): string {
  const hash = createHash("sha256").update(`${value}:${secret()}`).digest("hex");
  return `${value}.${hash}`;
}

function verify(token: string): boolean {
  const idx = token.lastIndexOf(".");
  if (idx < 0) return false;
  const value = token.slice(0, idx);
  const hash = token.slice(idx + 1);
  const expected = createHash("sha256").update(`${value}:${secret()}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const expires = Number(parts[0]);
  if (Number.isNaN(expires) || Date.now() > expires) return false;
  return verify(token);
}

export function authenticate(password: string): { ok: boolean; cookie: string | null } {
  const expected = Buffer.from(secret());
  const provided = Buffer.from(password);
  const valid =
    provided.length === expected.length &&
    timingSafeEqual(provided, expected);
  if (!valid) return { ok: false, cookie: null };
  const expires = Date.now() + MAX_AGE * 1000;
  return { ok: true, cookie: sign(String(expires)) };
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_MAX_AGE = MAX_AGE;

export async function requireAuth(): Promise<NextResponse | null> {
  const ok = await isAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  return null;
}
