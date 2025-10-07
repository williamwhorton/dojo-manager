import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_users_name_prefix" ADD VALUE '' BEFORE 'Mr.';
  ALTER TYPE "public"."enum_users_name_suffix" ADD VALUE '' BEFORE 'Jr.';
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb DEFAULT '',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "belts_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "classes_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_sessions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "belts_sessions" CASCADE;
  DROP TABLE "classes_sessions" CASCADE;
  DROP TABLE "programs_sessions" CASCADE;
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_belts_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_classes_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_programs_fk";
  
  DROP INDEX "belts_email_idx";
  DROP INDEX "classes_email_idx";
  DROP INDEX "programs_email_idx";
  DROP INDEX "payload_preferences_rels_belts_id_idx";
  DROP INDEX "payload_preferences_rels_classes_id_idx";
  DROP INDEX "payload_preferences_rels_programs_id_idx";
  ALTER TABLE "users" ALTER COLUMN "name_first_name" SET NOT NULL;
  ALTER TABLE "users" ALTER COLUMN "name_last_name" SET NOT NULL;
  ALTER TABLE "users" ADD COLUMN "full_name" varchar;
  ALTER TABLE "belts" DROP COLUMN "email";
  ALTER TABLE "belts" DROP COLUMN "reset_password_token";
  ALTER TABLE "belts" DROP COLUMN "reset_password_expiration";
  ALTER TABLE "belts" DROP COLUMN "salt";
  ALTER TABLE "belts" DROP COLUMN "hash";
  ALTER TABLE "belts" DROP COLUMN "login_attempts";
  ALTER TABLE "belts" DROP COLUMN "lock_until";
  ALTER TABLE "classes" DROP COLUMN "email";
  ALTER TABLE "classes" DROP COLUMN "reset_password_token";
  ALTER TABLE "classes" DROP COLUMN "reset_password_expiration";
  ALTER TABLE "classes" DROP COLUMN "salt";
  ALTER TABLE "classes" DROP COLUMN "hash";
  ALTER TABLE "classes" DROP COLUMN "login_attempts";
  ALTER TABLE "classes" DROP COLUMN "lock_until";
  ALTER TABLE "programs" DROP COLUMN "email";
  ALTER TABLE "programs" DROP COLUMN "reset_password_token";
  ALTER TABLE "programs" DROP COLUMN "reset_password_expiration";
  ALTER TABLE "programs" DROP COLUMN "salt";
  ALTER TABLE "programs" DROP COLUMN "hash";
  ALTER TABLE "programs" DROP COLUMN "login_attempts";
  ALTER TABLE "programs" DROP COLUMN "lock_until";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "belts_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "classes_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "programs_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "belts_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "classes_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "programs_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  ALTER TABLE "home" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home" CASCADE;
  ALTER TABLE "users" ALTER COLUMN "name_prefix" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_name_prefix";
  CREATE TYPE "public"."enum_users_name_prefix" AS ENUM('Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.');
  ALTER TABLE "users" ALTER COLUMN "name_prefix" SET DATA TYPE "public"."enum_users_name_prefix" USING "name_prefix"::"public"."enum_users_name_prefix";
  ALTER TABLE "users" ALTER COLUMN "name_suffix" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_name_suffix";
  CREATE TYPE "public"."enum_users_name_suffix" AS ENUM('Jr.', 'Sr.', 'I', 'II', 'III', 'IV', 'V', 'MD', 'DDS', 'PhD', 'DVM');
  ALTER TABLE "users" ALTER COLUMN "name_suffix" SET DATA TYPE "public"."enum_users_name_suffix" USING "name_suffix"::"public"."enum_users_name_suffix";
  ALTER TABLE "users" ALTER COLUMN "name_first_name" DROP NOT NULL;
  ALTER TABLE "users" ALTER COLUMN "name_last_name" DROP NOT NULL;
  ALTER TABLE "belts" ADD COLUMN "email" varchar NOT NULL;
  ALTER TABLE "belts" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "belts" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "belts" ADD COLUMN "salt" varchar;
  ALTER TABLE "belts" ADD COLUMN "hash" varchar;
  ALTER TABLE "belts" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "belts" ADD COLUMN "lock_until" timestamp(3) with time zone;
  ALTER TABLE "classes" ADD COLUMN "email" varchar NOT NULL;
  ALTER TABLE "classes" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "classes" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "classes" ADD COLUMN "salt" varchar;
  ALTER TABLE "classes" ADD COLUMN "hash" varchar;
  ALTER TABLE "classes" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "classes" ADD COLUMN "lock_until" timestamp(3) with time zone;
  ALTER TABLE "programs" ADD COLUMN "email" varchar NOT NULL;
  ALTER TABLE "programs" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "programs" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "programs" ADD COLUMN "salt" varchar;
  ALTER TABLE "programs" ADD COLUMN "hash" varchar;
  ALTER TABLE "programs" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "programs" ADD COLUMN "lock_until" timestamp(3) with time zone;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "belts_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "classes_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "programs_id" integer;
  ALTER TABLE "belts_sessions" ADD CONSTRAINT "belts_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."belts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "classes_sessions" ADD CONSTRAINT "classes_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_sessions" ADD CONSTRAINT "programs_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "belts_sessions_order_idx" ON "belts_sessions" USING btree ("_order");
  CREATE INDEX "belts_sessions_parent_id_idx" ON "belts_sessions" USING btree ("_parent_id");
  CREATE INDEX "classes_sessions_order_idx" ON "classes_sessions" USING btree ("_order");
  CREATE INDEX "classes_sessions_parent_id_idx" ON "classes_sessions" USING btree ("_parent_id");
  CREATE INDEX "programs_sessions_order_idx" ON "programs_sessions" USING btree ("_order");
  CREATE INDEX "programs_sessions_parent_id_idx" ON "programs_sessions" USING btree ("_parent_id");
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_belts_fk" FOREIGN KEY ("belts_id") REFERENCES "public"."belts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_classes_fk" FOREIGN KEY ("classes_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "belts_email_idx" ON "belts" USING btree ("email");
  CREATE UNIQUE INDEX "classes_email_idx" ON "classes" USING btree ("email");
  CREATE UNIQUE INDEX "programs_email_idx" ON "programs" USING btree ("email");
  CREATE INDEX "payload_preferences_rels_belts_id_idx" ON "payload_preferences_rels" USING btree ("belts_id");
  CREATE INDEX "payload_preferences_rels_classes_id_idx" ON "payload_preferences_rels" USING btree ("classes_id");
  CREATE INDEX "payload_preferences_rels_programs_id_idx" ON "payload_preferences_rels" USING btree ("programs_id");
  ALTER TABLE "users" DROP COLUMN "full_name";`)
}
