import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/auth/user";
import { db, schema } from "@/lib/db/client";
import { recommendCard } from "@/lib/content/recommend";
import { LEARNING_CARDS } from "@/lib/content/learning-cards";

const Body = z.object({
  text: z.string().min(1).max(8000),
  locale: z.enum(["en", "de"]).default("en"),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());
  let exclude: string[] = [];
  if (db) {
    const { userId } = await getOrCreateUser();
    if (userId) {
      const reads = await db
        .select({ cardId: schema.learningCardReads.cardId })
        .from(schema.learningCardReads)
        .where(eq(schema.learningCardReads.userId, userId));
      exclude = reads.map((r) => r.cardId);
    }
  }
  const rec = recommendCard(body.text, exclude);
  if (!rec) return NextResponse.json({ slug: null });

  const card = LEARNING_CARDS.find((c) => c.slug === rec.slug);
  if (!card) return NextResponse.json({ slug: null });

  return NextResponse.json({
    slug: card.slug,
    title: card.title[body.locale],
    triggerTag: rec.triggerTag,
  });
}
