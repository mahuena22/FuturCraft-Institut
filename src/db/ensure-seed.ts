import { db } from "./index";
import { formations } from "./schema";
import { count, sql } from "drizzle-orm";
import { seedDatabase } from "./seed";

let seedPromise: Promise<void> | null = null;

export async function ensureDatabaseSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      try {
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS "partnership_requests" (
            "id" serial PRIMARY KEY,
            "company_name" text NOT NULL,
            "contact_name" text NOT NULL,
            "email" text NOT NULL,
            "phone" text NOT NULL,
            "partnership_type" text NOT NULL,
            "message" text,
            "status" text DEFAULT 'nouveau' NOT NULL,
            "created_at" timestamp DEFAULT now() NOT NULL
          );

          CREATE TABLE IF NOT EXISTS "payment_requests" (
            "id" serial PRIMARY KEY,
            "student_id" integer NOT NULL REFERENCES "students"("id") ON DELETE cascade,
            "amount" integer NOT NULL,
            "method" text DEFAULT 'MTN Mobile Money' NOT NULL,
            "phone" text NOT NULL,
            "status" text DEFAULT 'en_attente' NOT NULL,
            "reference" text NOT NULL UNIQUE,
            "created_at" timestamp DEFAULT now() NOT NULL
          );

          ALTER TABLE IF EXISTS "students" ADD COLUMN IF NOT EXISTS "profile_visible" boolean DEFAULT false NOT NULL;
          ALTER TABLE IF EXISTS "students" ADD COLUMN IF NOT EXISTS "validation_note" text;
          ALTER TABLE IF EXISTS "students" ADD COLUMN IF NOT EXISTS "validated_by" text;
          ALTER TABLE IF EXISTS "students" ADD COLUMN IF NOT EXISTS "validated_at" timestamp;
          ALTER TABLE IF EXISTS "students" ADD COLUMN IF NOT EXISTS "cv_url" text;
          ALTER TABLE IF EXISTS "students" ADD COLUMN IF NOT EXISTS "skills" text;
          ALTER TABLE IF EXISTS "students" ADD COLUMN IF NOT EXISTS "professional_status" text;
          ALTER TABLE IF EXISTS "students" ADD COLUMN IF NOT EXISTS "custom_formation" text;
        `);
      } catch (err) {
        console.error("Error executing auto-migration for database:", err);
      }

      try {
        const rows = await db.select({ c: count() }).from(formations);
        if (Number(rows[0]?.c ?? 0) === 0) {
          await seedDatabase();
        }
      } catch (err) {
        console.error("Error checking seed:", err);
      }
    })();
  }
  await seedPromise;
}
