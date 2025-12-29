CREATE TYPE "public"."todo_status" AS ENUM('pending', 'completed');--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."todo_status";--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "status" SET DATA TYPE "public"."todo_status" USING "status"::"public"."todo_status";