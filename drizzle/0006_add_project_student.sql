ALTER TABLE "student_projects"
ADD COLUMN "student_id" integer;
--> statement-breakpoint
ALTER TABLE "student_projects"
ADD CONSTRAINT "student_projects_student_id_students_id_fk"
FOREIGN KEY ("student_id") REFERENCES "students"("id")
ON DELETE CASCADE;
--> statement-breakpoint
CREATE INDEX "student_projects_student_id_idx"
ON "student_projects" ("student_id");
