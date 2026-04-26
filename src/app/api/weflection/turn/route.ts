import { NextResponse } from "next/server";
import { z } from "zod";
import { classifyContribution, type PriorTurn } from "@/lib/claude/orchestrator";
import { detectStage3, safetyResources } from "@/lib/safety/detect";

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
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());

  const stage3 = detectStage3(body.contribution);
  if (stage3.length) {
    return NextResponse.json({
      safety: {
        triggers: stage3,
        resources: safetyResources(body.locale),
      },
    });
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

  return NextResponse.json({ classified });
}
