import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/auth/user";
import { db, schema } from "@/lib/db/client";

// Bookmark a chart entry (spec §6.14). The avatar NEVER comments on bookmarks.
const Body = z.object({
  sessionId: z.string().uuid(),
  chartEntryId: z.string().uuid(),
  note: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());
  if (!db) return NextResponse.json({ ok: true });
  const { userId } = await getOrCreateUser();
  if (!userId) return NextResponse.json({ ok: true });

  // Confirm session ownership.
  const sessions = await db
    .select()
    .from(schema.weFlectionSessions)
    .where(eq(schema.weFlectionSessions.id, body.sessionId))
    .limit(1);
  if (!sessions.length || sessions[0].userId !== userId) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const [row] = await db
    .insert(schema.bookmarks)
    .values({
      sessionId: body.sessionId,
      chartEntryId: body.chartEntryId,
      userNote: body.note ?? null,
    })
    .returning({ id: schema.bookmarks.id });
  return NextResponse.json({ id: row.id });
}
