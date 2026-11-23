import { NextRequest, NextResponse } from "next/server";
import { deleteStudentProject } from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const { id } = await context.params;
    const projectId = Number(id);
    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json({ error: "Identifiant de projet invalide" }, { status: 400 });
    }

    const project = await deleteStudentProject(projectId);
    if (!project) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/projects/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
