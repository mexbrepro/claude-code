import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/auth/user";
import { db, schema } from "@/lib/db/client";

// Mark an open thread as resolved (spec §9: status open → resolved).
// The user's gesture — they're saying "this isn't open anymore."
// We never auto-resolve; the user holds the authority on their own threads.

const Body = z.object({
  threadId: z.string().uuid().optional(),
  bookmarkId: z.string().uuid().optional(),
  inSessionId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());
  if (!body.threadId && !body.bookmarkId) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }
  if (!db) return NextResponse.json({ ok: true });
  const { userId } = await getOrCreateUser();
  if (!userId) return NextResponse.json({ ok: true });

  const now = new Date();

  if (body.threadId) {
    // Confirm ownership via the parent session.
    const owns = await db
      .select({ sessionUser: schema.weFlectionSessions.userId })
      .from(schema.openThreads)
      .innerJoin(
        schema.weFlectionSessions,
        eq(schema.openThreads.sessionId, schema.weFlectionSessions.id),
      )
      .where(eq(schema.openThreads.id, body.threadId))
      .limit(1);
    if (!owns.length || owns[0].sessionUser !== userId) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
    await db
      .update(schema.openThreads)
      .set({
        status: "resolved",
        resolvedAt: now,
        resolvedInSessionId: body.inSessionId ?? null,
      })
      .where(eq(schema.openThreads.id, body.threadId));
  }

  if (body.bookmarkId) {
    const owns = await db
      .select({ sessionUser: schema.weFlectionSessions.userId })
      .from(schema.bookmarks)
      .innerJoin(
        schema.weFlectionSessions,
        eq(schema.bookmarks.sessionId, schema.weFlectionSessions.id),
      )
      .where(eq(schema.bookmarks.id, body.bookmarkId))
      .limit(1);
    if (!owns.length || owns[0].sessionUser !== userId) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
    await db
      .update(schema.bookmarks)
      .set({ status: "woven_in", resolvedAt: now })
      .where(eq(schema.bookmarks.id, body.bookmarkId));
  }

  return NextResponse.json({ ok: true });
}
