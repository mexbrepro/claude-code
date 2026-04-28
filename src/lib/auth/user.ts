import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";

const ANON_COOKIE = "dc_anon_id";
const AVATAR_COOKIE = "dc_avatar";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 5; // 5 years

/**
 * Resolve the current user. Reads (or sets) an opaque anonymous-id cookie.
 * If the database is not configured, returns just the anonymous id and a
 * null userRow — call sites should treat persistence as best-effort.
 *
 * Spec §9: User has an anonymous_id field; passwordless magic-link auth
 * comes later. For now, anonymous-by-default keeps the entry barrier low.
 */
export async function getOrCreateUser() {
  const jar = await cookies();
  let anonymousId = jar.get(ANON_COOKIE)?.value;
  if (!anonymousId) {
    anonymousId = nanoid(24);
    jar.set(ANON_COOKIE, anonymousId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }

  if (!db) return { anonymousId, userId: null as string | null };

  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.anonymousId, anonymousId))
    .limit(1);

  if (existing.length) return { anonymousId, userId: existing[0].id };

  const [created] = await db
    .insert(schema.users)
    .values({ anonymousId })
    .returning({ id: schema.users.id });
  return { anonymousId, userId: created.id };
}

/**
 * Resolve the user's chosen avatar. **Read-only** — safe to call from
 * page renders. Looks up the existing user row when an anonymous-id
 * cookie is present; never inserts. Falls back to the non-httpOnly
 * dc_avatar cookie set by the AvatarPicker on client-side commit.
 *
 * Next.js 15 forbids cookies().set() during page render, so this path
 * cannot create the user — that happens lazily when an API route is hit.
 */
export async function getAvatarChoice(): Promise<
  "liss" | "kena" | "anu" | "wer" | null
> {
  const jar = await cookies();
  const cookieValue = jar.get(AVATAR_COOKIE)?.value;
  const anonymousId = jar.get(ANON_COOKIE)?.value;

  if (db && anonymousId) {
    const rows = await db
      .select({ avatar: schema.users.avatarChoice })
      .from(schema.users)
      .where(eq(schema.users.anonymousId, anonymousId))
      .limit(1);
    if (rows[0]?.avatar) return rows[0].avatar;
  }

  if (
    cookieValue === "liss" ||
    cookieValue === "kena" ||
    cookieValue === "anu" ||
    cookieValue === "wer"
  ) {
    return cookieValue;
  }
  return null;
}
