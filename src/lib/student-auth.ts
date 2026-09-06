import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

export const STUDENT_SESSION_COOKIE_NAME = "fc_student_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "fc-dev-secret";
}

function sign(value: string): string {
  const hash = createHash("sha256").update(`${value}:${secret()}`).digest("hex");
  return `${value}.${hash}`;
}

function verifyToken(token: string): boolean {
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

export async function createStudentSession(studentId: number): Promise<void> {
  const store = await cookies();
  const expires = Date.now() + MAX_AGE * 1000;
  store.set(STUDENT_SESSION_COOKIE_NAME, sign(`${studentId}.${expires}`), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getStudentSession(): Promise<number | null> {
  const store = await cookies();
  const token = store.get(STUDENT_SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const studentId = Number(parts[0]);
  const expires = Number(parts[1]);
  if (!Number.isInteger(studentId) || Number.isNaN(expires) || Date.now() > expires) return null;
  return verifyToken(token) ? studentId : null;
}

export async function destroyStudentSession(): Promise<void> {
  const store = await cookies();
  store.delete(STUDENT_SESSION_COOKIE_NAME);
}

export const STUDENT_SESSION_MAX_AGE = MAX_AGE;