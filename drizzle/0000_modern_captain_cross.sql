CREATE TABLE "blog_articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_image" text NOT NULL,
	"author" text DEFAULT 'Équipe Pédagogique FuturCraft' NOT NULL,
	"read_time" text DEFAULT '5 min de lecture' NOT NULL,
	"category" text NOT NULL,
	"published_at" text NOT NULL,
	CONSTRAINT "blog_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "company_offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"contact_person" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"offer_type" text NOT NULL,
	"title" text NOT NULL,
	"location" text DEFAULT 'Cotonou / Hybride' NOT NULL,
	"description" text NOT NULL,
	"skills_required" text NOT NULL,
	"deadline" text,
	"status" text DEFAULT 'en_attente' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"date" text NOT NULL,
	"location" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"attendees_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "formations" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"short_description" text NOT NULL,
	"full_description" text NOT NULL,
	"duration" text NOT NULL,
	"level" text NOT NULL,
	"price" integer NOT NULL,
	"registration_fee" integer NOT NULL,
	"installments_count" integer DEFAULT 3 NOT NULL,
	"campus" text NOT NULL,
	"mode" text DEFAULT 'Présentiel & Hybride' NOT NULL,
	"is_popular" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"competencies" text NOT NULL,
	"tools" text NOT NULL,
	"modules" text NOT NULL,
	"jobs" text NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "formations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text DEFAULT 'info' NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"title" text NOT NULL,
	"amount" integer NOT NULL,
	"due_date" text NOT NULL,
	"status" text DEFAULT 'en_attente' NOT NULL,
	"paid_at" text,
	"transaction_ref" text
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"receipt_number" text NOT NULL,
	"student_id" integer NOT NULL,
	"schedule_id" integer,
	"amount" integer NOT NULL,
	"payment_method" text NOT NULL,
	"transaction_ref" text NOT NULL,
	"status" text DEFAULT 'valide' NOT NULL,
	"notes" text,
	"recorded_by" text DEFAULT 'Plateforme en ligne' NOT NULL,
	"paid_at" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_receipt_number_unique" UNIQUE("receipt_number")
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"formation_id" integer NOT NULL,
	"name" text NOT NULL,
	"campus" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"status" text DEFAULT 'ouverte' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receipts" (
	"id" serial PRIMARY KEY NOT NULL,
	"receipt_number" text NOT NULL,
	"payment_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"verification_code" text NOT NULL,
	"qr_data" text NOT NULL,
	"issued_at" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "receipts_receipt_number_unique" UNIQUE("receipt_number"),
	CONSTRAINT "receipts_verification_code_unique" UNIQUE("verification_code")
);
--> statement-breakpoint
CREATE TABLE "student_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"tagline" text NOT NULL,
	"description" text NOT NULL,
	"cover_image" text NOT NULL,
	"formation_title" text NOT NULL,
	"technologies" text NOT NULL,
	"team_members" text NOT NULL,
	"project_url" text,
	"github_url" text,
	"is_featured" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "student_projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_number" text NOT NULL,
	"user_id" integer,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"gender" text DEFAULT 'M' NOT NULL,
	"birth_date" text,
	"birth_place" text,
	"nationality" text DEFAULT 'Béninoise',
	"residence_country" text DEFAULT 'Bénin',
	"city" text DEFAULT 'Cotonou',
	"address" text,
	"phone" text NOT NULL,
	"whatsapp" text,
	"email" text NOT NULL,
	"avatar_url" text,
	"previous_diploma" text,
	"study_level" text,
	"previous_school" text,
	"study_field" text,
	"previous_experience" text,
	"guardian_name" text,
	"guardian_relation" text,
	"guardian_phone" text,
	"guardian_email" text,
	"formation_id" integer NOT NULL,
	"promotion_id" integer,
	"status" text DEFAULT 'preinscrit' NOT NULL,
	"total_amount" integer DEFAULT 0 NOT NULL,
	"paid_amount" integer DEFAULT 0 NOT NULL,
	"remaining_amount" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "students_student_number_unique" UNIQUE("student_number")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"role" text DEFAULT 'etudiant' NOT NULL,
	"avatar_url" text,
	"password_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_schedules" ADD CONSTRAINT "payment_schedules_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_schedule_id_payment_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."payment_schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_formation_id_formations_id_fk" FOREIGN KEY ("formation_id") REFERENCES "public"."formations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_formation_id_formations_id_fk" FOREIGN KEY ("formation_id") REFERENCES "public"."formations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id") ON DELETE no action ON UPDATE no action;