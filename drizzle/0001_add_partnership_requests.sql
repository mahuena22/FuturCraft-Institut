CREATE TABLE "partnership_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"partnership_type" text NOT NULL,
	"message" text,
	"status" text DEFAULT 'nouveau' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
