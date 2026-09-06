import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getStudentSession } from "@/lib/student-auth";

export async function POST(req: NextRequest) {
  const studentId = await getStudentSession();
  if (!studentId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { notificationId, markAllStudentId } = await req.json();

    if (markAllStudentId) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.studentId, Number(markAllStudentId)),
            eq(notifications.studentId, studentId)
          )
        );
      return NextResponse.json({ success: true });
    }

    if (notificationId) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.id, Number(notificationId)),
            eq(notifications.studentId, studentId)
          )
        );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}