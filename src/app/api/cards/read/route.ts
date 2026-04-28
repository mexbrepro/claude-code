import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateUser } from "@/lib/auth/user";
import { db, schema } from "@/lib/db/client";

// Records that the user opened a card. The recommender uses this list
// to avoid re-suggesting cards the user has already read.
const Body = z.object({
  cardId: z.string().min(1).max(120),
  context: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());
  if (!db) return NextResponse.json({ ok: true });
  const { userId } = await getOrCreateUser();
  if (!userId) return NextResponse.json({ ok: true });
  await db.insert(schema.learningCardReads).values({
    userId,
    cardId: body.cardId,
    context: body.context ?? null,
  });
  return NextResponse.json({ ok: true });
}
