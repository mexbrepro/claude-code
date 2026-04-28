import { NextResponse } from "next/server";
import { z } from "zod";
import { and, desc, eq, gte } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/auth/user";
import { db, schema } from "@/lib/db/client";
import { composeSurfacingMessage, detectPatterns } from "@/lib/patterns/detect";

const Query = z.object({
  locale: z.enum(["en", "de"]).default("en"),
});

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
const MIN_ENTRIES = 5;

// Returns recurring patterns the user has not seen surfaced yet.
// The act of fetching marks them as surfaced — the spec is emphatic
// about the once-only contract (§5: "Once. Not repeated.").
export async function GET(req: Request) {
  const url = new URL(req.url);
  const { locale } = Query.parse({ locale: url.searchParams.get("locale") ?? "en" });

  if (!db) return NextResponse.json({ message: "", patterns: [] });

  const { userId } = await getOrCreateUser();
  if (!userId) return NextResponse.json({ message: "", patterns: [] });

  // Read recent entries.
  const recent = await db
    .select()
    .from(schema.practiceEntries)
    .where(eq(schema.practiceEntries.userId, userId))
    .orderBy(desc(schema.practiceEntries.createdAt))
    .limit(120);

  if (recent.length < MIN_ENTRIES) {
    return NextResponse.json({ message: "", patterns: [] });
  }

  // Spec §5 gates surfacing on "after two weeks of practice."
  const oldest = recent[recent.length - 1].createdAt;
  if (Date.now() - oldest.getTime() < TWO_WEEKS_MS) {
    return NextResponse.json({ message: "", patterns: [] });
  }

  // Read already-surfaced pattern keys so we never repeat.
  const alreadySurfaced = await db
    .select({ key: schema.patternObservations.patternType })
    .from(schema.patternObservations)
    .where(
      and(
        eq(schema.patternObservations.userId, userId),
        eq(schema.patternObservations.surfacedToUser, true),
      ),
    );
  const seenKeys = new Set(alreadySurfaced.map((r) => r.key));

  const detected = await detectPatterns(
    recent.map((r) => ({
      questionType: r.questionType,
      contentText: r.contentText,
      createdAt: r.createdAt,
    })),
    locale,
  );

  const fresh = detected.filter((p) => !seenKeys.has(p.key));
  if (!fresh.length) {
    return NextResponse.json({ message: "", patterns: [] });
  }

  // Mark surfaced before responding. If the user closes the tab before
  // seeing it, we still don't surface again — this matches the spec's
  // emphasis on "Once. Not repeated." over "guaranteed delivery."
  const safeDate = (s: string) => {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  };
  await db.insert(schema.patternObservations).values(
    fresh.map((p) => ({
      userId,
      patternType: p.key,
      recurrenceCount: p.recurrence,
      firstSeen: safeDate(p.firstSeen),
      lastSeen: safeDate(p.lastSeen),
      surfacedToUser: true,
    })),
  );

  return NextResponse.json({
    message: composeSurfacingMessage(fresh, locale),
    patterns: fresh,
  });
}

// POST is a no-op kept for symmetry; the GET already commits the
// surfacing. Provided so the client can record the user's response
// later if a "would you like to look at this together?" interaction
// is added (e.g. opens a We-Flection seeded with the patterns).
const Ack = z.object({ patternKeys: z.array(z.string()), accepted: z.boolean() });
export async function POST(req: Request) {
  const body = Ack.parse(await req.json());
  // Reserved for future telemetry — no body actions yet.
  return NextResponse.json({ ok: true, ...body });
}
