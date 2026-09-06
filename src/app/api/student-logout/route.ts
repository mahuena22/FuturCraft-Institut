import { NextResponse } from "next/server";
import { destroyStudentSession } from "@/lib/student-auth";

export async function POST() {
  await destroyStudentSession();
  return NextResponse.json({ success: true });
}