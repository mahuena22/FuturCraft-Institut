CREATE TABLE "payment_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"method" text DEFAULT 'MTN Mobile Money' NOT NULL,
	"phone" text NOT NULL,
	"status" text DEFAULT 'en_attente' NOT NULL,
	"reference" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_requests_reference_unique" UNIQUE("reference")
);

DO $$ BEGIN
 ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN null;
END $$;