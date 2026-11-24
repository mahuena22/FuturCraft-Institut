import { NextRequest, NextResponse } from "next/server";
import { getStudentSession } from "@/lib/student-auth";
import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendAdminDocumentUploadEmail } from "@/lib/email";
import { deleteUpload, storeUpload } from "@/lib/uploads";

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
        await deleteUpload(previousUrl);
        return NextResponse.json({ success: true, removed: true });
      }
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
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
    const publicUrl = await storeUpload(file, "students", `${safeKey}-${kind}`);

    // Replace the previous file then persist the new URL
    const previousUrl = kind === "avatar" ? existing.avatarUrl : existing.cvUrl;
    await db
      .update(students)
      .set(kind === "avatar" ? { avatarUrl: publicUrl } : { cvUrl: publicUrl })
      .where(eq(students.id, studentId));
    await deleteUpload(previousUrl);

    void sendAdminDocumentUploadEmail({
      firstName: existing.firstName,
      lastName: existing.lastName,
      studentNumber: existing.studentNumber,
      kind: kind as "avatar" | "cv",
      url: publicUrl,
    });

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("POST /api/student-upload error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}