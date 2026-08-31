import { NextRequest, NextResponse } from "next/server";
import { getAllStudents, createStudentWithPlan } from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const students = await getAllStudents();
    return NextResponse.json(students);
  } catch (error) {
    console.error("GET /api/students error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const student = await createStudentWithPlan(body);
    return NextResponse.json({ success: true, student });
  } catch (error: any) {
    console.error("POST /api/students error:", error);
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}
