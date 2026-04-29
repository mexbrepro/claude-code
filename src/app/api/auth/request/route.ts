import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { db, schema } from "@/lib/db/client";
import { sendMagicLink } from "@/lib/auth/email";
import { buildVerifyUrl, newToken } from "@/lib/auth/magic-link";
import { track } from "@/lib/telemetry";

const Body = z.object({
  email: z.string().email().max(254),
  locale: z.enum(["en", "de"]).default("en"),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());

  if (!db) {
    // No DB: still respond OK so local dev without Postgres can demo
    // the form, but log the limitation.
    console.warn("[auth] DATABASE_URL unset — magic-link request ignored");
    return NextResponse.json({ ok: true });
  }

  // If the requester is currently anonymous, capture their cookie so
  // verification can claim/merge their existing data into the email user.
  const jar = await cookies();
  const anonymousId = jar.get("dc_anon_id")?.value ?? null;

  const { token, tokenHash, expiresAt } = newToken();
  await db.insert(schema.magicLinkTokens).values({
    tokenHash,
    email: body.email,
    claimedAnonymousId: anonymousId,
    expiresAt,
  });

  try {
    await sendMagicLink({
      to: body.email,
      locale: body.locale,
      verifyUrl: buildVerifyUrl(token, body.locale),
    });
  } catch (err) {
    // Email send failed — surface a 502 so the client can show a retry
    // affordance, but never reveal whether the email exists.
    console.error("[auth] magic-link send failed", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  track("auth.magic_link_requested", { locale: body.locale });
  // Always return ok to avoid leaking which addresses are registered.
  return NextResponse.json({ ok: true });
}
