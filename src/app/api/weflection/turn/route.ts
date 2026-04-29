import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import {
  classifyContribution,
  type PriorTurn,
} from "@/lib/claude/orchestrator";
import { detectStage3, safetyResources } from "@/lib/safety/detect";
import { pickOpener } from "@/lib/claude/system-prompt";
import { getOrCreateUser } from "@/lib/auth/user";
import { db, schema } from "@/lib/db/client";
import { track } from "@/lib/telemetry";

const PriorEntry = z.object({
  raw: z.string(),
  entryId: z.string(),
  classified: z.object({
    chart: z.enum(["solution", "concern", "data", "problem_statement"]),
    rationale_internal: z.string(),
    user_words_condensed: z.string(),
    edge_marker: z.boolean(),
    verbal_response: z.string(),
    is_problem_statement_migration: z.boolean(),
    parent_entry_id: z.string().nullable(),
  }),
});

const Body = z.object({
  locale: z.enum(["en", "de"]),
  contribution: z.string().min(1).max(8000),
  prior: z.array(PriorEntry).max(200),
  sessionId: z.string().uuid().nullable().optional(),
  continuedFromSessionId: z.string().uuid().nullable().optional(),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());
  const { userId } = await getOrCreateUser();

  const stage3 = detectStage3(body.contribution);
  if (stage3.length) {
    if (db && userId) {
      await db.insert(schema.safetyEvents).values({
        userId,
        triggerType: stage3[0].trigger,
        actionTaken: "presence_mode_with_resources_during_weflection",
        resourcesOffered: stage3.map((h) => h.trigger),
      });
    }
    track(
      "safety.stage3",
      { userRef: userId ?? undefined, locale: body.locale },
      {
        trigger: stage3[0].trigger,
        triggerCount: stage3.length,
        surface: "weflection",
      },
    );
    return NextResponse.json({
      safety: {
        triggers: stage3,
        resources: safetyResources(body.locale),
      },
    });
  }

  // Resolve or create the WeFlectionSession.
  let sessionId = body.sessionId ?? null;
  if (db && userId && !sessionId) {
    const opener = pickOpener(body.locale, []);
    const [created] = await db
      .insert(schema.weFlectionSessions)
      .values({
        userId,
        openingQuestion: opener,
        status: "active",
        continuedFromSessionId: body.continuedFromSessionId ?? null,
      })
      .returning({ id: schema.weFlectionSessions.id });
    sessionId = created.id;
    track(
      "weflection.opener_picked",
      { userRef: userId, locale: body.locale },
      { opener },
    );
  }

  // Build prior turns as alternating user/assistant pairs so the model
  // sees its own classifications alongside the user's words.
  const priorTurns: PriorTurn[] = [];
  for (const p of body.prior) {
    priorTurns.push({ role: "user", content: p.raw });
    priorTurns.push({ role: "assistant", content: JSON.stringify(p.classified) });
  }

  const classified = await classifyContribution(body.contribution, {
    locale: body.locale,
    prior: priorTurns,
    priorChartEntries: body.prior.map((p) => ({
      id: p.entryId,
      chart: p.classified.chart,
      contentCondensed: p.classified.user_words_condensed,
    })),
  });

  // Persist the chart entry.
  let entryId: string | null = null;
  if (db && sessionId) {
    const [row] = await db
      .insert(schema.chartEntries)
      .values({
        sessionId,
        chartType: classified.chart,
        contentUserWords: body.contribution,
        contentCondensed: classified.user_words_condensed,
        classificationRationaleInternal: classified.rationale_internal,
        secondaryAspects: classified.secondary_aspects,
        edgeMarker: classified.edge_marker,
        userOverrode: false,
        sequenceInSession: body.prior.length + 1,
        parentEntryId:
          classified.is_problem_statement_migration && classified.parent_entry_id
            ? classified.parent_entry_id
            : null,
      })
      .returning({ id: schema.chartEntries.id });
    entryId = row.id;
  }

  return NextResponse.json({ classified, sessionId, entryId });
}

const MoveBody = z.object({
  entryId: z.string().uuid(),
  to: z.enum(["solution", "concern", "data", "problem_statement"]),
});

// PATCH: silent user-driven reclassification (spec §6.13).
// The avatar never comments on overrides; we just record them.
export async function PATCH(req: Request) {
  const body = MoveBody.parse(await req.json());
  if (!db) return NextResponse.json({ ok: true });
  const { userId } = await getOrCreateUser();
  if (!userId) return NextResponse.json({ ok: true });

  // Confirm the entry belongs to a session owned by this user before mutating.
  const rows = await db
    .select({
      entryId: schema.chartEntries.id,
      sessionUser: schema.weFlectionSessions.userId,
    })
    .from(schema.chartEntries)
    .innerJoin(
      schema.weFlectionSessions,
      eq(schema.chartEntries.sessionId, schema.weFlectionSessions.id),
    )
    .where(eq(schema.chartEntries.id, body.entryId))
    .limit(1);

  if (!rows.length || rows[0].sessionUser !== userId) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  await db
    .update(schema.chartEntries)
    .set({ chartType: body.to, userOverrode: true })
    .where(eq(schema.chartEntries.id, body.entryId));

  return NextResponse.json({ ok: true });
}
