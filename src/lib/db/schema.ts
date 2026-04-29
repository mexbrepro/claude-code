import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Enums map directly to the spec's controlled vocabularies (§9).
export const languageEnum = pgEnum("language", ["en", "de"]);
export const avatarEnum = pgEnum("avatar", ["liss", "kena", "anu", "wer"]);
export const practiceQuestionEnum = pgEnum("practice_question_type", [
  "body",
  "dream",
  "edge",
  "flirt",
]);
export const chartTypeEnum = pgEnum("chart_type", [
  "solution",
  "concern",
  "data",
  "problem_statement",
]);
export const sessionStatusEnum = pgEnum("session_status", ["active", "ended"]);
export const openThreadSourceEnum = pgEnum("open_thread_source", [
  "end_of_session",
  "bookmark",
]);
export const openThreadStatusEnum = pgEnum("open_thread_status", [
  "open",
  "resolved",
]);
export const bookmarkStatusEnum = pgEnum("bookmark_status", [
  "open",
  "woven_in",
]);
export const safetyTriggerEnum = pgEnum("safety_trigger", [
  "suicidal_ideation",
  "self_harm",
  "trauma_reactivation",
  "dissociation",
  "identity_destabilization",
  "acute_somatic",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  anonymousId: text("anonymous_id").unique(),
  displayName: text("display_name"),
  languagePreference: languageEnum("language_preference").notNull().default("en"),
  avatarChoice: avatarEnum("avatar_choice"),
  // Spec §10: optional read-aloud per user. Stored on the User so it
  // travels with sign-in across devices.
  autoSpeak: boolean("auto_speak").notNull().default(false),
  // Spec §8: explicit voice consent before any audio capture. Stored
  // server-side as the source of truth; mirrored client-side for UX.
  voiceConsentAt: timestamp("voice_consent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Passwordless magic-link tokens (spec §8). Single-use, ~15 min TTL.
// Token is the cookie-bound secret; the row records who it's for so
// verification can claim or merge anonymous users into a known account.
export const magicLinkTokens = pgTable("magic_link_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  // The opaque token sent to the user's email. Stored hashed.
  tokenHash: text("token_hash").notNull().unique(),
  email: text("email").notNull(),
  // Optional: existing user id if the requester was already anonymously
  // signed in. On verify we merge that anon user into the email user.
  claimedAnonymousId: text("claimed_anonymous_id"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const practiceEntries = pgTable("practice_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionType: practiceQuestionEnum("question_type").notNull(),
  contentText: text("content_text").notNull(),
  contentAudioUrl: text("content_audio_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const weFlectionSessions = pgTable("we_flection_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  openingQuestion: text("opening_question").notNull(),
  status: sessionStatusEnum("status").notNull().default("active"),
  continuedFromSessionId: uuid("continued_from_session_id"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
});

export const chartEntries = pgTable("chart_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().references(() => weFlectionSessions.id, { onDelete: "cascade" }),
  chartType: chartTypeEnum("chart_type").notNull(),
  contentUserWords: text("content_user_words").notNull(),
  contentCondensed: text("content_condensed").notNull(),
  // Internal-only fields. Never serialized to the user.
  classificationRationaleInternal: text("classification_rationale_internal"),
  secondaryAspects: jsonb("secondary_aspects").$type<string[]>().default([]),
  edgeMarker: boolean("edge_marker").notNull().default(false),
  userOverrode: boolean("user_overrode").notNull().default(false),
  sequenceInSession: integer("sequence_in_session").notNull(),
  parentEntryId: uuid("parent_entry_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const ofCourseEntries = pgTable("of_course_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().references(() => weFlectionSessions.id, { onDelete: "cascade" }),
  contentUserWords: text("content_user_words").notNull(),
  sequence: integer("sequence").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const openThreads = pgTable("open_threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().references(() => weFlectionSessions.id, { onDelete: "cascade" }),
  contentUserWords: text("content_user_words").notNull(),
  source: openThreadSourceEnum("source").notNull(),
  status: openThreadStatusEnum("status").notNull().default("open"),
  resolvedInSessionId: uuid("resolved_in_session_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().references(() => weFlectionSessions.id, { onDelete: "cascade" }),
  chartEntryId: uuid("chart_entry_id").notNull().references(() => chartEntries.id, { onDelete: "cascade" }),
  userNote: text("user_note"),
  status: bookmarkStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

export const learningCardReads = pgTable("learning_card_reads", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  cardId: text("card_id").notNull(),
  context: text("context"),
  readAt: timestamp("read_at", { withTimezone: true }).notNull().defaultNow(),
});

export const patternObservations = pgTable("pattern_observations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  patternType: text("pattern_type").notNull(),
  recurrenceCount: integer("recurrence_count").notNull().default(1),
  firstSeen: timestamp("first_seen", { withTimezone: true }).notNull().defaultNow(),
  lastSeen: timestamp("last_seen", { withTimezone: true }).notNull().defaultNow(),
  // Spec §5: pattern surfacing happens once. Never repeated.
  surfacedToUser: boolean("surfaced_to_user").notNull().default(false),
});

export const safetyEvents = pgTable("safety_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  triggerType: safetyTriggerEnum("trigger_type").notNull(),
  actionTaken: text("action_taken").notNull(),
  resourcesOffered: jsonb("resources_offered").$type<string[]>().default([]),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});
