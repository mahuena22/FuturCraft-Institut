import { NextRequest, NextResponse } from "next/server";
import {
  createStudentProject,
  getAdminStudentProjects,
} from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";

function isValidProjectUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isValidCoverImage(value: string) {
  if (value.startsWith("/images/") && !value.includes("..")) return true;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "images.pexels.com" ||
        url.hostname === "futurcraft.bj" ||
        url.hostname.endsWith(".futurcraft.bj"))
    );
  } catch {
    return false;
  }
}

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    return NextResponse.json(await getAdminStudentProjects());
  } catch (error) {
    console.error("GET /api/admin/projects error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Données de projet invalides" }, { status: 400 });
    }

    const studentId = Number(body.studentId);
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const tagline = typeof body.tagline === "string" ? body.tagline.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const coverImage = typeof body.coverImage === "string" ? body.coverImage.trim() : "";
    const technologies =
      typeof body.technologies === "string"
        ? body.technologies.split(",").map((technology: string) => technology.trim()).filter(Boolean)
        : [];
    const projectUrl = typeof body.projectUrl === "string" ? body.projectUrl.trim() : "";
    const githubUrl = typeof body.githubUrl === "string" ? body.githubUrl.trim() : "";

    if (!Number.isInteger(studentId) || studentId <= 0 || !title || !tagline || !description || !coverImage || technologies.length === 0) {
      return NextResponse.json(
        { error: "Étudiant, titre, résumé, description, image et technologies sont requis" },
        { status: 400 }
      );
    }

    if (!isValidCoverImage(coverImage)) {
      return NextResponse.json({ error: "L’image doit utiliser un chemin /images/ ou un domaine autorisé en HTTPS" }, { status: 400 });
    }
    if ((projectUrl && !isValidProjectUrl(projectUrl)) || (githubUrl && !isValidProjectUrl(githubUrl))) {
      return NextResponse.json({ error: "Les liens du projet doivent utiliser HTTPS" }, { status: 400 });
    }

    const project = await createStudentProject({
      studentId,
      title,
      tagline,
      description,
      coverImage,
      technologies,
      projectUrl,
      githubUrl,
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/projects error:", error);
    if (error instanceof Error && error.message === "Seuls les étudiants validés peuvent avoir un projet publié") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
