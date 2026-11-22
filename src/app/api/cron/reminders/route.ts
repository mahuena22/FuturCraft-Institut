import { NextRequest, NextResponse } from "next/server";
import { processPaymentReminders, processUpcomingReminders } from "@/lib/reminder-service";

function getCronSecret(): string | null {
  return process.env.CRON_SECRET || null;
}

function isAuthorized(request: NextRequest, bodySecret?: unknown): boolean {
  const cronSecret = getCronSecret();
  if (!cronSecret) return false;
  const authHeader = request.headers.get("authorization");
  const headerSecret = request.headers.get("x-cron-secret");
  const provided = typeof bodySecret === "string" ? bodySecret : headerSecret;
  return authHeader === `Bearer ${cronSecret}` || provided === cronSecret;
}

export async function GET(request: NextRequest) {
  if (!getCronSecret()) {
    return NextResponse.json({ error: "CRON_SECRET non configuré" }, { status: 503 });
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "overdue";
  const days = Number.parseInt(url.searchParams.get("days") || "3", 10);
  const safeDays = Number.isFinite(days) && days > 0 ? Math.min(days, 30) : 3;

  try {
    if (type === "upcoming") {
      const result = await processUpcomingReminders(safeDays);
      return NextResponse.json({ success: true, type: "upcoming", ...result });
    }
    const result = await processPaymentReminders();
    return NextResponse.json({ success: true, type: "overdue", ...result });
  } catch (error) {
    console.error("Erreur cron reminder:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!getCronSecret()) {
    return NextResponse.json({ error: "CRON_SECRET non configuré" }, { status: 503 });
  }
  const body = await request.json().catch(() => ({}));
  if (!isAuthorized(request, body?.secret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const type = body?.type === "upcoming" ? "upcoming" : "overdue";
  const days = Number(body?.days ?? 3);
  const safeDays = Number.isFinite(days) && days > 0 ? Math.min(days, 30) : 3;

  try {
    const result = type === "upcoming" ? await processUpcomingReminders(safeDays) : await processPaymentReminders();
    return NextResponse.json({ success: true, type, ...result });
  } catch (error) {
    console.error("Erreur cron reminder:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}