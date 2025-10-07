import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_name_prefix" AS ENUM('Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.');
  CREATE TYPE "public"."enum_users_name_suffix" AS ENUM('Jr.', 'Sr.', 'I', 'II', 'III', 'IV', 'V', 'MD', 'DDS', 'PhD', 'DVM');
  CREATE TYPE "public"."enum_users_address_state" AS ENUM('AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY');
  CREATE TABLE "users_programs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"program_id" integer,
  	"belt_id" integer,
  	"number_of_classes_attended" numeric
  );
  
  CREATE TABLE "belts_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "belts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"level" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "classes_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "classes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"program_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "programs_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "programs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  ALTER TABLE "users" ADD COLUMN "name_prefix" "enum_users_name_prefix";
  ALTER TABLE "users" ADD COLUMN "name_first_name" varchar;
  ALTER TABLE "users" ADD COLUMN "name_last_name" varchar;
  ALTER TABLE "users" ADD COLUMN "name_suffix" "enum_users_name_suffix";
  ALTER TABLE "users" ADD COLUMN "phone" varchar;
  ALTER TABLE "users" ADD COLUMN "address_street" varchar;
  ALTER TABLE "users" ADD COLUMN "address_city" varchar;
  ALTER TABLE "users" ADD COLUMN "address_state" "enum_users_address_state";
  ALTER TABLE "users" ADD COLUMN "address_zip" numeric;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "belts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "classes_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "programs_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "belts_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "classes_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "programs_id" integer;
  ALTER TABLE "users_programs" ADD CONSTRAINT "users_programs_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_programs" ADD CONSTRAINT "users_programs_belt_id_belts_id_fk" FOREIGN KEY ("belt_id") REFERENCES "public"."belts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_programs" ADD CONSTRAINT "users_programs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "belts_sessions" ADD CONSTRAINT "belts_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."belts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "classes_sessions" ADD CONSTRAINT "classes_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "classes" ADD CONSTRAINT "classes_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_sessions" ADD CONSTRAINT "programs_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_programs_order_idx" ON "users_programs" USING btree ("_order");
  CREATE INDEX "users_programs_parent_id_idx" ON "users_programs" USING btree ("_parent_id");
  CREATE INDEX "users_programs_program_idx" ON "users_programs" USING btree ("program_id");
  CREATE INDEX "users_programs_belt_idx" ON "users_programs" USING btree ("belt_id");
  CREATE INDEX "belts_sessions_order_idx" ON "belts_sessions" USING btree ("_order");
  CREATE INDEX "belts_sessions_parent_id_idx" ON "belts_sessions" USING btree ("_parent_id");
  CREATE INDEX "belts_updated_at_idx" ON "belts" USING btree ("updated_at");
  CREATE INDEX "belts_created_at_idx" ON "belts" USING btree ("created_at");
  CREATE UNIQUE INDEX "belts_email_idx" ON "belts" USING btree ("email");
  CREATE INDEX "classes_sessions_order_idx" ON "classes_sessions" USING btree ("_order");
  CREATE INDEX "classes_sessions_parent_id_idx" ON "classes_sessions" USING btree ("_parent_id");
  CREATE INDEX "classes_program_idx" ON "classes" USING btree ("program_id");
  CREATE INDEX "classes_updated_at_idx" ON "classes" USING btree ("updated_at");
  CREATE INDEX "classes_created_at_idx" ON "classes" USING btree ("created_at");
  CREATE UNIQUE INDEX "classes_email_idx" ON "classes" USING btree ("email");
  CREATE INDEX "programs_sessions_order_idx" ON "programs_sessions" USING btree ("_order");
  CREATE INDEX "programs_sessions_parent_id_idx" ON "programs_sessions" USING btree ("_parent_id");
  CREATE INDEX "programs_updated_at_idx" ON "programs" USING btree ("updated_at");
  CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");
  CREATE UNIQUE INDEX "programs_email_idx" ON "programs" USING btree ("email");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_belts_fk" FOREIGN KEY ("belts_id") REFERENCES "public"."belts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_classes_fk" FOREIGN KEY ("classes_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_belts_fk" FOREIGN KEY ("belts_id") REFERENCES "public"."belts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_classes_fk" FOREIGN KEY ("classes_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_belts_id_idx" ON "payload_locked_documents_rels" USING btree ("belts_id");
  CREATE INDEX "payload_locked_documents_rels_classes_id_idx" ON "payload_locked_documents_rels" USING btree ("classes_id");
  CREATE INDEX "payload_locked_documents_rels_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("programs_id");
  CREATE INDEX "payload_preferences_rels_belts_id_idx" ON "payload_preferences_rels" USING btree ("belts_id");
  CREATE INDEX "payload_preferences_rels_classes_id_idx" ON "payload_preferences_rels" USING btree ("classes_id");
  CREATE INDEX "payload_preferences_rels_programs_id_idx" ON "payload_preferences_rels" USING btree ("programs_id");
  ALTER TABLE "users" DROP COLUMN "name";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_programs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "belts_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "belts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "classes_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "classes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_programs" CASCADE;
  DROP TABLE "belts_sessions" CASCADE;
  DROP TABLE "belts" CASCADE;
  DROP TABLE "classes_sessions" CASCADE;
  DROP TABLE "classes" CASCADE;
  DROP TABLE "programs_sessions" CASCADE;
  DROP TABLE "programs" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_belts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_classes_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_programs_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_belts_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_classes_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_programs_fk";
  
  DROP INDEX "payload_locked_documents_rels_belts_id_idx";
  DROP INDEX "payload_locked_documents_rels_classes_id_idx";
  DROP INDEX "payload_locked_documents_rels_programs_id_idx";
  DROP INDEX "payload_preferences_rels_belts_id_idx";
  DROP INDEX "payload_preferences_rels_classes_id_idx";
  DROP INDEX "payload_preferences_rels_programs_id_idx";
  ALTER TABLE "users" ADD COLUMN "name" varchar;
  ALTER TABLE "users" DROP COLUMN "name_prefix";
  ALTER TABLE "users" DROP COLUMN "name_first_name";
  ALTER TABLE "users" DROP COLUMN "name_last_name";
  ALTER TABLE "users" DROP COLUMN "name_suffix";
  ALTER TABLE "users" DROP COLUMN "phone";
  ALTER TABLE "users" DROP COLUMN "address_street";
  ALTER TABLE "users" DROP COLUMN "address_city";
  ALTER TABLE "users" DROP COLUMN "address_state";
  ALTER TABLE "users" DROP COLUMN "address_zip";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "belts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "classes_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "programs_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "belts_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "classes_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "programs_id";
  DROP TYPE "public"."enum_users_name_prefix";
  DROP TYPE "public"."enum_users_name_suffix";
  DROP TYPE "public"."enum_users_address_state";`)
}
