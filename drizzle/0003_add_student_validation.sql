ALTER TABLE "students" ADD COLUMN "profile_visible" boolean DEFAULT false NOT NULL;
ALTER TABLE "students" ADD COLUMN "validation_note" text;
ALTER TABLE "students" ADD COLUMN "validated_by" text;
ALTER TABLE "students" ADD COLUMN "validated_at" timestamp;