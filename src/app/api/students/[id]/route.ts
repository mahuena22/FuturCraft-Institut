import { NextRequest, NextResponse } from "next/server";
import { getStudentById } from "@/lib/data-service";
import { db } from "@/db";
import { students, paymentSchedules, payments, receipts, notifications, paymentRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, getAdminName } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const { id } = await context.params;
    const studentData = await getStudentById(Number(id));
    if (!studentData) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
    }
    return NextResponse.json(studentData);
  } catch (error) {
    console.error("GET /api/students/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const { id } = await context.params;
    const body = await req.json();

    let formattedSkills: string | undefined = undefined;
    if (body.skills !== undefined) {
      if (Array.isArray(body.skills)) {
        formattedSkills = JSON.stringify(body.skills.map((s: unknown) => String(s).trim()).filter(Boolean));
      } else if (typeof body.skills === "string") {
        const trimmed = body.skills.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          formattedSkills = trimmed;
        } else {
          formattedSkills = JSON.stringify(trimmed.split(",").map((s: string) => s.trim()).filter(Boolean));
        }
      } else {
        formattedSkills = "[]";
      }
    }

    const patch: Record<string, unknown> = {
      ...(body.firstName && { firstName: body.firstName.trim() }),
      ...(body.lastName && { lastName: body.lastName.trim() }),
      ...(body.phone && { phone: body.phone.trim() }),
      ...(body.whatsapp !== undefined && { whatsapp: body.whatsapp?.trim() || null }),
      ...(body.email && { email: body.email.trim() }),
      ...(body.city !== undefined && { city: body.city?.trim() || "Cotonou" }),
      ...(body.address !== undefined && { address: body.address }),
      ...(body.status && { status: body.status }),
      ...(body.formationId && { formationId: Number(body.formationId) }),
      ...(body.promotionId !== undefined && { promotionId: body.promotionId }),
      ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl || null }),
      ...(body.cvUrl !== undefined && { cvUrl: body.cvUrl || null }),
      ...(body.professionalStatus !== undefined && { professionalStatus: body.professionalStatus || null }),
      ...(formattedSkills !== undefined && { skills: formattedSkills }),
      ...(body.guardianName !== undefined && { guardianName: body.guardianName }),
      ...(body.guardianPhone !== undefined && { guardianPhone: body.guardianPhone }),
      ...(body.customFormation !== undefined && { customFormation: body.customFormation ? String(body.customFormation).trim() : null }),
      ...(body.validationNote !== undefined && { validationNote: body.validationNote }),
    };

    // If profileVisible is explicitly passed
    if (body.profileVisible !== undefined) {
      patch.profileVisible = Boolean(body.profileVisible);
      if (patch.profileVisible) {
        patch.validatedBy = getAdminName();
        patch.validatedAt = new Date();
      }
    } else if (body.status) {
      // Keep Entreprise-page visibility in sync with status if profileVisible is not explicitly toggled
      const visibleStatuses = ["inscrit", "actif", "termine", "alumni"];
      patch.profileVisible = visibleStatuses.includes(body.status);
      if (visibleStatuses.includes(body.status) && !patch.validatedBy) {
        patch.validatedBy = getAdminName();
        patch.validatedAt = new Date();
      }
      if (body.status === "rejete" || body.status === "preinscrit") {
        patch.profileVisible = false;
      }
    }

    const [updated] = await db
      .update(students)
      .set(patch)
      .where(eq(students.id, Number(id)))
      .returning();

    return NextResponse.json({ success: true, student: updated });
  } catch (error) {
    console.error("PATCH /api/students/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const { id } = await context.params;
    const studentId = Number(id);

    // Clean up relations first
    await db.delete(notifications).where(eq(notifications.studentId, studentId));
    await db.delete(paymentRequests).where(eq(paymentRequests.studentId, studentId));
    await db.delete(receipts).where(eq(receipts.studentId, studentId));
    await db.delete(payments).where(eq(payments.studentId, studentId));
    await db.delete(paymentSchedules).where(eq(paymentSchedules.studentId, studentId));
    await db.delete(students).where(eq(students.id, studentId));

    return NextResponse.json({ success: true, message: "Profil étudiant supprimé" });
  } catch (error) {
    console.error("DELETE /api/students/[id] error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression de l'étudiant" }, { status: 500 });
  }
}
