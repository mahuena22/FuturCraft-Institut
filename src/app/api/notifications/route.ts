import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { notificationId, markAllStudentId } = await req.json();

    if (markAllStudentId) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.studentId, Number(markAllStudentId)));
      return NextResponse.json({ success: true });
    }

    if (notificationId) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, Number(notificationId)));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
