import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq, gt, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db, schema } from "@/lib/db/client";
import { hashToken } from "@/lib/auth/magic-link";
import { routing } from "@/i18n/routing";
import { track } from "@/lib/telemetry";

const ANON_COOKIE = "dc_anon_id";

// GET /api/auth/verify?token=...&locale=en
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const localeParam = url.searchParams.get("locale") ?? "en";
  const locale = (routing.locales as readonly string[]).includes(localeParam)
    ? (localeParam as "en" | "de")
    : "en";

  if (!db) {
    return NextResponse.redirect(new URL(`/${locale}/sign-in?status=unconfigured`, url));
  }
  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}/sign-in?status=invalid`, url));
  }

  const tokenHash = hashToken(token);
  const rows = await db
    .select()
    .from(schema.magicLinkTokens)
    .where(
      and(
        eq(schema.magicLinkTokens.tokenHash, tokenHash),
        gt(schema.magicLinkTokens.expiresAt, new Date()),
        isNull(schema.magicLinkTokens.usedAt),
      ),
    )
    .limit(1);
  if (!rows.length) {
    return NextResponse.redirect(new URL(`/${locale}/sign-in?status=invalid`, url));
  }
  const link = rows[0];

  // Single-use enforcement first.
  await db
    .update(schema.magicLinkTokens)
    .set({ usedAt: new Date() })
    .where(eq(schema.magicLinkTokens.id, link.id));

  // Resolve target user: existing email user wins; otherwise the anon
  // user from the requester's cookie at request time gets claimed;
  // otherwise create a new user.
  const existingByEmail = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, link.email))
    .limit(1);

  let targetUserId: string;
  let targetAnonymousId: string;

  if (existingByEmail.length) {
    targetUserId = existingByEmail[0].id;
    targetAnonymousId = existingByEmail[0].anonymousId ?? nanoid(24);
    if (!existingByEmail[0].anonymousId) {
      await db
        .update(schema.users)
        .set({ anonymousId: targetAnonymousId })
        .where(eq(schema.users.id, targetUserId));
    }
  } else if (link.claimedAnonymousId) {
    // Bind the anon user to this email.
    const claimed = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.anonymousId, link.claimedAnonymousId))
      .limit(1);
    if (claimed.length) {
      targetUserId = claimed[0].id;
      targetAnonymousId = claimed[0].anonymousId ?? link.claimedAnonymousId;
      await db
        .update(schema.users)
        .set({ email: link.email })
        .where(eq(schema.users.id, targetUserId));
    } else {
      // Anon row was deleted between request and verify — fall through.
      const anonymousId = link.claimedAnonymousId;
      const [created] = await db
        .insert(schema.users)
        .values({ email: link.email, anonymousId })
        .returning({ id: schema.users.id });
      targetUserId = created.id;
      targetAnonymousId = anonymousId;
    }
  } else {
    const anonymousId = nanoid(24);
    const [created] = await db
      .insert(schema.users)
      .values({ email: link.email, anonymousId })
      .returning({ id: schema.users.id });
    targetUserId = created.id;
    targetAnonymousId = anonymousId;
  }

  // Set the anon cookie to the user's anonymousId — that's what
  // getAvatarChoice / getOrCreateUser look up. Same cookie does dual
  // duty for anonymous and signed-in sessions.
  const jar = await cookies();
  jar.set(ANON_COOKIE, targetAnonymousId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365 * 5,
    path: "/",
  });

  track("auth.signed_in", { userRef: targetUserId, locale });
  return NextResponse.redirect(new URL(`/${locale}/practice?signed_in=1`, url));
}
