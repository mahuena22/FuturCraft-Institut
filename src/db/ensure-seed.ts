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
          ALTER TABLE IF EXISTS "students" ADD COLUMN IF NOT EXISTS "profile_visible" boolean DEFAULT false NOT NULL;
          ALTER TABLE IF EXISTS "students" ADD COLUMN IF NOT EXISTS "validation_note" text;
          ALTER TABLE IF EXISTS "students" ADD COLUMN IF NOT EXISTS "validated_by" text;
          ALTER TABLE IF EXISTS "students" ADD COLUMN IF NOT EXISTS "validated_at" timestamp;
          ALTER TABLE IF EXISTS "students" ADD COLUMN IF NOT EXISTS "cv_url" text;
        `);
      } catch (err) {
        console.error("Error executing auto-migration for students:", err);
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
