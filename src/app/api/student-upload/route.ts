import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { getStudentSession } from "@/lib/student-auth";
import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";

async function removeFile(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/students/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // ignore missing file
  }
}

export async function POST(req: NextRequest) {
  const studentId = await getStudentSession();
  if (!studentId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const [existing] = await db.select().from(students).where(eq(students.id, studentId));
    if (!existing) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
    }

    const formData = await req.formData();
    const kind = String(formData.get("kind") || "avatar"); // 'avatar' | 'cv'
    const file = formData.get("file");

    // Removal mode: no file, just clear the field and delete the stored file
    if (!(file instanceof File)) {
      const remove = String(formData.get("remove") || "") === "1";
      if (remove) {
        const previousUrl = kind === "avatar" ? existing.avatarUrl : existing.cvUrl;
        await db
          .update(students)
          .set(kind === "avatar" ? { avatarUrl: null } : { cvUrl: null })
          .where(eq(students.id, studentId));
        await removeFile(previousUrl);
        return NextResponse.json({ success: true, removed: true });
      }
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    const ext = kind === "cv" ? "pdf" : (file.name.split(".").pop() || "jpg").toLowerCase();
    const allowedImageExt = ["jpg", "jpeg", "png", "webp", "gif"];
    if (kind === "avatar" && !allowedImageExt.includes(ext)) {
      return NextResponse.json({ error: "Format de photo non supporté (jpg, png, webp attendus)" }, { status: 400 });
    }
    if (kind === "cv" && ext !== "pdf") {
      return NextResponse.json({ error: "Le CV doit être au format PDF" }, { status: 400 });
    }
    if (file.size > 6 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 6 Mo)" }, { status: 400 });
    }

    const safeKey = existing.studentNumber.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
    const filename = `${safeKey}-${kind}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "students");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

    const publicUrl = `/uploads/students/${filename}`;

    // Replace the previous file then persist the new URL
    const previousUrl = kind === "avatar" ? existing.avatarUrl : existing.cvUrl;
    await db
      .update(students)
      .set(kind === "avatar" ? { avatarUrl: publicUrl } : { cvUrl: publicUrl })
      .where(eq(students.id, studentId));
    await removeFile(previousUrl);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("POST /api/student-upload error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}