import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    const formData = await req.formData();
    const kind = String(formData.get("kind") || "avatar"); // 'avatar' | 'cv'
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() || "").toLowerCase();
    const allowedImageExt = ["jpg", "jpeg", "png", "webp", "gif", "svg"];
    const allowedDocExt = ["pdf"];

    if (kind === "avatar" && !allowedImageExt.includes(ext)) {
      return NextResponse.json(
        { error: "Format d'image non supporté (JPG, PNG, WEBP acceptés)" },
        { status: 400 }
      );
    }

    if (kind === "cv" && !allowedDocExt.includes(ext)) {
      return NextResponse.json(
        { error: "Le CV doit être obligatoirement au format PDF" },
        { status: 400 }
      );
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (maximum 15 Mo)" },
        { status: 400 }
      );
    }

    const cleanBase = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const subFolder = kind === "cv" ? "cvs" : "students";
    const filename = `${kind}_${cleanBase}_${Date.now()}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads", subFolder);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

    const publicUrl = `/uploads/${subFolder}/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl, filename });
  } catch (error) {
    console.error("POST /api/admin/upload error:", error);
    return NextResponse.json(
      { error: "Erreur lors du téléversement du fichier" },
      { status: 500 }
    );
  }
}
