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
    const body = await req.json().catch(() => ({}));
    const isSafeStudentFileUrl = (url: string) => /^\/uploads\/students\/[a-zA-Z0-9._-]+$/.test(url);
    const patch: Record<string, unknown> = {};
    if (body.phone !== undefined) patch.phone = String(body.phone || "").trim();
    if (body.whatsapp !== undefined) patch.whatsapp = String(body.whatsapp || "").trim();
    if (body.city !== undefined) patch.city = body.city ? String(body.city).trim() : null;
    if (body.address !== undefined) patch.address = body.address ? String(body.address).trim() : null;
    if (body.avatarUrl !== undefined) {
      const v = body.avatarUrl ? String(body.avatarUrl) : "";
      if (v && !isSafeStudentFileUrl(v)) return NextResponse.json({ error: "avatarUrl invalide" }, { status: 400 });
      patch.avatarUrl = v || null;
    }
    if (body.cvUrl !== undefined) {
      const v = body.cvUrl ? String(body.cvUrl) : "";
      if (v && !isSafeStudentFileUrl(v)) return NextResponse.json({ error: "cvUrl invalide" }, { status: 400 });
      patch.cvUrl = v || null;
    }
    if (Object.keys(patch).length === 0) return NextResponse.json({ error: "Aucune modification" }, { status: 400 });

    const [updated] = await db
      .update(students)
      .set(patch)
      .where(eq(students.id, studentId))
      .returning();
    return NextResponse.json({ success: true, student: updated });
  } catch (error) {
    console.error("PATCH /api/student-me error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}