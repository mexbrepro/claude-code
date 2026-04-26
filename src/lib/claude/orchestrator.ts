import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { anthropic, ANTHROPIC_MODEL } from "./client";
import {
  FEW_SHOT_WE_FLECTION,
  HARVEST_QUESTIONS,
  SYSTEM_PROMPT,
  type Locale,
} from "./system-prompt";

// Zod schema for chart classification output (spec §12).
export const ChartClassificationSchema = z.object({
  chart: z.enum(["solution", "concern", "data", "problem_statement"]),
  rationale_internal: z.string(),
  user_words_condensed: z.string(),
  secondary_aspects: z.array(z.string()),
  edge_marker: z.boolean(),
  verbal_response: z.string(),
  is_problem_statement_migration: z.boolean(),
  parent_entry_id: z.string().nullable(),
});
export type ChartClassification = z.infer<typeof ChartClassificationSchema>;

const CLASSIFY_TOOL_INPUT_SCHEMA = {
  type: "object" as const,
  additionalProperties: false,
  properties: {
    chart: { type: "string", enum: ["solution", "concern", "data", "problem_statement"] },
    rationale_internal: { type: "string" },
    user_words_condensed: { type: "string" },
    secondary_aspects: { type: "array", items: { type: "string" } },
    edge_marker: { type: "boolean" },
    verbal_response: { type: "string" },
    is_problem_statement_migration: { type: "boolean" },
    parent_entry_id: { type: ["string", "null"] },
  },
  required: [
    "chart",
    "rationale_internal",
    "user_words_condensed",
    "secondary_aspects",
    "edge_marker",
    "verbal_response",
    "is_problem_statement_migration",
    "parent_entry_id",
  ],
};

const CLASSIFY_TOOL: Anthropic.Tool = {
  name: "record_chart_entry",
  description:
    "Record the user's contribution as a chart entry. This is the avatar's silent classification work; it must be called exactly once per contribution.",
  // Cast: Anthropic.Tool input_schema is permissive at runtime; we keep the
  // narrowed shape for our own clarity.
  input_schema: CLASSIFY_TOOL_INPUT_SCHEMA as unknown as Anthropic.Tool["input_schema"],
};

const MIRROR_TOOL_INPUT_SCHEMA = {
  type: "object" as const,
  additionalProperties: false,
  properties: {
    mirror: { type: "string" },
    followup: { type: ["string", "null"] },
  },
  required: ["mirror", "followup"],
};

const MIRROR_TOOL: Anthropic.Tool = {
  name: "record_mirror",
  description:
    "Record the avatar's daily-practice acknowledgment. mirror may be empty; followup is null unless something striking surfaced.",
  input_schema: MIRROR_TOOL_INPUT_SCHEMA as unknown as Anthropic.Tool["input_schema"],
};

export type PriorTurn = {
  role: "user" | "assistant";
  content: string;
};

export type SessionContext = {
  locale: Locale;
  prior: PriorTurn[];
  priorChartEntries: Array<{
    id: string;
    chart: ChartClassification["chart"];
    contentCondensed: string;
  }>;
};

const cacheBreakpoint = { type: "ephemeral" as const };

function buildFewShotMessages(): Anthropic.MessageParam[] {
  // Few-shot examples ride at the head of the messages array, with
  // cache_control on the final assistant turn so the entire stable prefix
  // (system + tools + few-shot) is cached across requests.
  const messages: Anthropic.MessageParam[] = [];
  FEW_SHOT_WE_FLECTION.forEach((ex, idx) => {
    const isLast = idx === FEW_SHOT_WE_FLECTION.length - 1;
    messages.push({ role: "user", content: ex.user });
    messages.push({
      role: "assistant",
      content: isLast
        ? [{ type: "text", text: ex.assistant, cache_control: cacheBreakpoint }]
        : ex.assistant,
    });
  });
  return messages;
}

function extractToolUse(
  message: Anthropic.Message,
  toolName: string,
): Record<string, unknown> | null {
  for (const block of message.content) {
    if (block.type === "tool_use" && block.name === toolName) {
      return block.input as Record<string, unknown>;
    }
  }
  return null;
}

/**
 * Classify a single user contribution in WE_FLECTION mode.
 * Forces the model to call the `record_chart_entry` tool — gives us
 * a structured, schema-validated payload on every turn.
 */
export async function classifyContribution(
  userContribution: string,
  ctx: SessionContext,
): Promise<ChartClassification> {
  const recentSummary = ctx.priorChartEntries.length
    ? `[Internal: prior chart entries this session (id, chart, condensed)]\n${ctx.priorChartEntries
        .slice(-12)
        .map((e) => `- ${e.id} ${e.chart}: ${e.contentCondensed}`)
        .join("\n")}\n\n[Current user contribution]\n${userContribution}`
    : userContribution;

  const liveTurns: Anthropic.MessageParam[] = [
    ...ctx.prior.map<Anthropic.MessageParam>((t) => ({ role: t.role, content: t.content })),
    { role: "user", content: recentSummary },
  ];

  const response = await anthropic.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: cacheBreakpoint,
      },
    ],
    tools: [CLASSIFY_TOOL],
    tool_choice: { type: "tool", name: CLASSIFY_TOOL.name },
    messages: [...buildFewShotMessages(), ...liveTurns],
  });

  const raw = extractToolUse(response, CLASSIFY_TOOL.name);
  if (!raw) {
    throw new Error("Classification call returned no tool_use block");
  }
  return ChartClassificationSchema.parse(raw);
}

/**
 * Daily Practice mirroring (spec §5).
 */
export async function dailyPracticeMirror(args: {
  questionType: "body" | "dream" | "edge" | "flirt";
  questionText: string;
  userAnswer: string;
  locale: Locale;
}): Promise<{ mirror: string; followup: string | null }> {
  const lang = args.locale === "de" ? "Deutsch" : "English";
  const userTurn = `[Mode: DAILY_PRACTICE]
[Question type: ${args.questionType}]
[Question shown to user]
${args.questionText}
[User's answer]
${args.userAnswer}

Respond in ${lang}. Call record_mirror exactly once.
A non-empty mirror is allowed only as a brief acknowledgment in the user's
own words. A non-null followup is allowed only if something genuinely
striking surfaced — strong emotion, recurring pattern, body resonance.`;

  const response = await anthropic.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 256,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: cacheBreakpoint,
      },
    ],
    tools: [MIRROR_TOOL],
    tool_choice: { type: "tool", name: MIRROR_TOOL.name },
    messages: [{ role: "user", content: userTurn }],
  });

  const raw = extractToolUse(response, MIRROR_TOOL.name);
  if (!raw) return { mirror: "", followup: null };
  return z
    .object({ mirror: z.string(), followup: z.string().nullable() })
    .parse(raw);
}

export function harvestPrompts(locale: Locale) {
  return HARVEST_QUESTIONS[locale];
}
