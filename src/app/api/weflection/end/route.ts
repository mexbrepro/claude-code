import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/auth/user";
import { db, schema } from "@/lib/db/client";

// Harvest payloads are captured verbatim from the user (spec §6.15).
// The avatar never harvests for the user — this endpoint just stores
// what the user said.
const Body = z.object({
  sessionId: z.string().uuid(),
  ofCourses: z.array(z.string().min(1).max(2000)).max(50),
  openThreads: z.array(z.string().min(1).max(2000)).max(50),
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

  if (body.ofCourses.length) {
    await db.insert(schema.ofCourseEntries).values(
      body.ofCourses.map((content, i) => ({
        sessionId: body.sessionId,
        contentUserWords: content,
        sequence: i,
      })),
    );
  }
  if (body.openThreads.length) {
    await db.insert(schema.openThreads).values(
      body.openThreads.map((content) => ({
        sessionId: body.sessionId,
        contentUserWords: content,
        source: "end_of_session" as const,
      })),
    );
  }

  await db
    .update(schema.weFlectionSessions)
    .set({ status: "ended", endedAt: new Date() })
    .where(eq(schema.weFlectionSessions.id, body.sessionId));

  return NextResponse.json({ ok: true });
}
