-- Initial migration. Hand-authored to mirror src/lib/db/schema.ts.
-- Re-run drizzle-kit generate once npm install is available; this file
-- exists so the schema can be applied to a fresh Postgres without the
-- toolchain present.

-- Enums --------------------------------------------------------------
DO $$ BEGIN CREATE TYPE "public"."language" AS ENUM ('en', 'de'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."avatar" AS ENUM ('liss', 'kena', 'anu', 'wer'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."practice_question_type" AS ENUM ('body', 'dream', 'edge', 'flirt'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."chart_type" AS ENUM ('solution', 'concern', 'data', 'problem_statement'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."session_status" AS ENUM ('active', 'ended'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."open_thread_source" AS ENUM ('end_of_session', 'bookmark'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."open_thread_status" AS ENUM ('open', 'resolved'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."bookmark_status" AS ENUM ('open', 'woven_in'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "public"."safety_trigger" AS ENUM (
  'suicidal_ideation', 'self_harm', 'trauma_reactivation',
  'dissociation', 'identity_destabilization', 'acute_somatic'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Users --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text UNIQUE,
  "anonymous_id" text UNIQUE,
  "display_name" text,
  "language_preference" "language" NOT NULL DEFAULT 'en',
  "avatar_choice" "avatar",
  "auto_speak" boolean NOT NULL DEFAULT false,
  "voice_consent_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

-- Magic link tokens --------------------------------------------------
CREATE TABLE IF NOT EXISTS "magic_link_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "token_hash" text NOT NULL UNIQUE,
  "email" text NOT NULL,
  "claimed_anonymous_id" text,
  "expires_at" timestamptz NOT NULL,
  "used_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

-- Practice entries ---------------------------------------------------
CREATE TABLE IF NOT EXISTS "practice_entries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "question_type" "practice_question_type" NOT NULL,
  "content_text" text NOT NULL,
  "content_audio_url" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "practice_entries_user_idx" ON "practice_entries" ("user_id", "created_at");

-- We-Flection sessions ----------------------------------------------
CREATE TABLE IF NOT EXISTS "we_flection_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "opening_question" text NOT NULL,
  "status" "session_status" NOT NULL DEFAULT 'active',
  "continued_from_session_id" uuid,
  "started_at" timestamptz NOT NULL DEFAULT now(),
  "ended_at" timestamptz
);
CREATE INDEX IF NOT EXISTS "weflection_sessions_user_idx" ON "we_flection_sessions" ("user_id", "started_at" DESC);

-- Chart entries ------------------------------------------------------
CREATE TABLE IF NOT EXISTS "chart_entries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id" uuid NOT NULL REFERENCES "we_flection_sessions"("id") ON DELETE CASCADE,
  "chart_type" "chart_type" NOT NULL,
  "content_user_words" text NOT NULL,
  "content_condensed" text NOT NULL,
  "classification_rationale_internal" text,
  "secondary_aspects" jsonb DEFAULT '[]'::jsonb,
  "edge_marker" boolean NOT NULL DEFAULT false,
  "user_overrode" boolean NOT NULL DEFAULT false,
  "sequence_in_session" integer NOT NULL,
  "parent_entry_id" uuid,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "chart_entries_session_idx" ON "chart_entries" ("session_id", "sequence_in_session");

-- Of Course entries --------------------------------------------------
CREATE TABLE IF NOT EXISTS "of_course_entries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id" uuid NOT NULL REFERENCES "we_flection_sessions"("id") ON DELETE CASCADE,
  "content_user_words" text NOT NULL,
  "sequence" integer NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "of_course_session_idx" ON "of_course_entries" ("session_id", "sequence");

-- Open threads -------------------------------------------------------
CREATE TABLE IF NOT EXISTS "open_threads" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id" uuid NOT NULL REFERENCES "we_flection_sessions"("id") ON DELETE CASCADE,
  "content_user_words" text NOT NULL,
  "source" "open_thread_source" NOT NULL,
  "status" "open_thread_status" NOT NULL DEFAULT 'open',
  "resolved_in_session_id" uuid,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "resolved_at" timestamptz
);
CREATE INDEX IF NOT EXISTS "open_threads_session_idx" ON "open_threads" ("session_id", "status");

-- Bookmarks ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS "bookmarks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id" uuid NOT NULL REFERENCES "we_flection_sessions"("id") ON DELETE CASCADE,
  "chart_entry_id" uuid NOT NULL REFERENCES "chart_entries"("id") ON DELETE CASCADE,
  "user_note" text,
  "status" "bookmark_status" NOT NULL DEFAULT 'open',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "resolved_at" timestamptz
);
CREATE INDEX IF NOT EXISTS "bookmarks_session_idx" ON "bookmarks" ("session_id", "status");

-- Learning card reads -----------------------------------------------
CREATE TABLE IF NOT EXISTS "learning_card_reads" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "card_id" text NOT NULL,
  "context" text,
  "read_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "card_reads_user_idx" ON "learning_card_reads" ("user_id", "read_at");

-- Pattern observations ----------------------------------------------
CREATE TABLE IF NOT EXISTS "pattern_observations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "pattern_type" text NOT NULL,
  "recurrence_count" integer NOT NULL DEFAULT 1,
  "first_seen" timestamptz NOT NULL DEFAULT now(),
  "last_seen" timestamptz NOT NULL DEFAULT now(),
  "surfaced_to_user" boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS "pattern_user_idx" ON "pattern_observations" ("user_id", "pattern_type");

-- Safety events ------------------------------------------------------
CREATE TABLE IF NOT EXISTS "safety_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "trigger_type" "safety_trigger" NOT NULL,
  "action_taken" text NOT NULL,
  "resources_offered" jsonb DEFAULT '[]'::jsonb,
  "timestamp" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "safety_events_user_idx" ON "safety_events" ("user_id", "timestamp");
