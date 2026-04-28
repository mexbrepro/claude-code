import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/auth/user";
import { db, schema } from "@/lib/db/client";

// Surface open threads and bookmarks from prior sessions
// (spec §6.2: carry-over panel before a new session opens).
export async function GET() {
  if (!db) return NextResponse.json({ openThreads: [], bookmarks: [], priorSessionId: null });
  const { userId } = await getOrCreateUser();
  if (!userId) return NextResponse.json({ openThreads: [], bookmarks: [], priorSessionId: null });

  // Find the most recent ended session for this user.
  const recentSessions = await db
    .select()
    .from(schema.weFlectionSessions)
    .where(
      and(
        eq(schema.weFlectionSessions.userId, userId),
        eq(schema.weFlectionSessions.status, "ended"),
      ),
    )
    .orderBy(desc(schema.weFlectionSessions.endedAt))
    .limit(1);

  if (!recentSessions.length) {
    return NextResponse.json({ openThreads: [], bookmarks: [], priorSessionId: null });
  }
  const prior = recentSessions[0];

  const openThreadRows = await db
    .select()
    .from(schema.openThreads)
    .where(
      and(
        eq(schema.openThreads.sessionId, prior.id),
        eq(schema.openThreads.status, "open"),
      ),
    );

  const bookmarkRows = await db
    .select({
      id: schema.bookmarks.id,
      note: schema.bookmarks.userNote,
      contentCondensed: schema.chartEntries.contentCondensed,
      chart: schema.chartEntries.chartType,
    })
    .from(schema.bookmarks)
    .innerJoin(
      schema.chartEntries,
      eq(schema.bookmarks.chartEntryId, schema.chartEntries.id),
    )
    .where(
      and(
        eq(schema.bookmarks.sessionId, prior.id),
        eq(schema.bookmarks.status, "open"),
      ),
    );

  return NextResponse.json({
    priorSessionId: prior.id,
    openThreads: openThreadRows.map((r) => ({
      id: r.id,
      content: r.contentUserWords,
    })),
    bookmarks: bookmarkRows.map((r) => ({
      id: r.id,
      note: r.note,
      content: r.contentCondensed,
      chart: r.chart,
    })),
  });
}
