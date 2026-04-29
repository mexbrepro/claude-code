import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateUser } from "@/lib/auth/user";
import { db, schema } from "@/lib/db/client";

// Persists the user's "what landed" reflection. Stored in
// learningCardReads.context as a free-form note next to the read event.
const Body = z.object({
  cardId: z.string().min(1).max(120),
  reflection: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());
  if (!db) return NextResponse.json({ ok: true });
  const { userId } = await getOrCreateUser();
  if (!userId) return NextResponse.json({ ok: true });
  await db.insert(schema.learningCardReads).values({
    userId,
    cardId: body.cardId,
    context: body.reflection.slice(0, 2000),
  });
  return NextResponse.json({ ok: true });
}
