import { NextRequest, NextResponse } from "next/server";
import { processPaymentReminders, processUpcomingReminders } from "@/lib/reminder-service";

// Clé secrète pour sécuriser l'endpoint (à mettre dans .env.local)
const CRON_SECRET = process.env.CRON_SECRET || "futurcraft-cron-secret-2024";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  // Vérification de la clé secrète
  if (secret !== CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const type = url.searchParams.get("type") || "overdue";
  const days = parseInt(url.searchParams.get("days") || "3");

  try {
    let result;

    if (type === "upcoming") {
      const result = await processUpcomingReminders(3);
      return NextResponse.json({
        success: true,
        type: "upcoming",
        ...result,
      });
    } else {
      const result = await processPaymentReminders();
      return NextResponse.json({
        success: true,
        type: "overdue",
        ...result,
      });
    }
  } catch (error) {
    console.error("Erreur cron reminder:", error);
    return NextResponse.json(
      { error: "Erreur interne", details: String(error) },
      { status: 500 }
    );
  }
}

// POST pour déclencher manuellement
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const body = await request.json().catch(() => ({}));
  const secret = body.secret || request.headers.get("x-cron-secret");

  if (secret !== CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const { type = "overdue", days = 3 } = body;

  try {
    let result;
    if (type === "upcoming") {
      result = await processUpcomingReminders(days);
    } else {
      result = await processPaymentReminders();
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne", details: String(error) },
      { status: 500 }
    );
  }
}