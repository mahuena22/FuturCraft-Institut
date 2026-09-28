import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  console.log('Connected to PostgreSQL. Running migrations...');

  await client.query(`
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

  console.log('Migration completed successfully!');

  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log('Updated tables in DB:');
  console.log(res.rows.map(r => r.table_name));

  await client.end();
}

main().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
