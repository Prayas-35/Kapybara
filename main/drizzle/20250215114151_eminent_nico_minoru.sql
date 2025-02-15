ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "categories" CASCADE;--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "category_id";