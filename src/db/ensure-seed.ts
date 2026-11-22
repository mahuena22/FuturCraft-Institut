import { db } from "./index";
import { formations } from "./schema";
import { count } from "drizzle-orm";
import { seedDatabase } from "./seed";

let seedPromise: Promise<void> | null = null;

export async function ensureDatabaseSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const rows = await db.select({ c: count() }).from(formations);
      if (Number(rows[0]?.c ?? 0) === 0) {
        await seedDatabase();
      }
    })().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  await seedPromise;
}
