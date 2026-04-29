import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/auth/user";
import { db, schema } from "@/lib/db/client";

const Body = z.object({
  language: z.enum(["en", "de"]).optional(),
  avatar: z.enum(["liss", "kena", "anu", "wer"]).optional(),
  autoSpeak: z.boolean().optional(),
  voiceConsent: z.boolean().optional(),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());
  const { userId } = await getOrCreateUser();
  if (!db || !userId) return NextResponse.json({ ok: true });

  const update: Partial<typeof schema.users.$inferInsert> = {};
  if (body.language) update.languagePreference = body.language;
  if (body.avatar) update.avatarChoice = body.avatar;
  if (typeof body.autoSpeak === "boolean") update.autoSpeak = body.autoSpeak;
  if (body.voiceConsent === true) update.voiceConsentAt = new Date();
  if (body.voiceConsent === false) update.voiceConsentAt = null;
  if (Object.keys(update).length === 0) return NextResponse.json({ ok: true });

  await db.update(schema.users).set(update).where(eq(schema.users.id, userId));
  return NextResponse.json({ ok: true });
}

export async function GET() {
  if (!db) {
    return NextResponse.json({
      language: null,
      avatar: null,
      email: null,
      autoSpeak: false,
    });
  }
  const { userId } = await getOrCreateUser();
  if (!userId) {
    return NextResponse.json({
      language: null,
      avatar: null,
      email: null,
      autoSpeak: false,
    });
  }
  const rows = await db
    .select({
      language: schema.users.languagePreference,
      avatar: schema.users.avatarChoice,
      email: schema.users.email,
      autoSpeak: schema.users.autoSpeak,
      voiceConsentAt: schema.users.voiceConsentAt,
    })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);
  const row = rows[0];
  return NextResponse.json(
    row
      ? { ...row, voiceConsent: row.voiceConsentAt !== null }
      : {
          language: null,
          avatar: null,
          email: null,
          autoSpeak: false,
          voiceConsent: false,
        },
  );
}
