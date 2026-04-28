import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { anthropic, ANTHROPIC_MODEL } from "@/lib/claude/client";
import { SYSTEM_PROMPT, type Locale } from "@/lib/claude/system-prompt";

// Pattern surfacing (spec §5).
//
// "After two weeks of practice, the avatar may say once: 'The pulling in
//  your chest has appeared seven times this month. The flirt that caught
//  your attention — the bird outside your window — has appeared three
//  times. Would you like to look at this together?' Once. Not repeated.
//  The user decides."
//
// The detection is intentionally observation-only: returning concrete
// counts and verbatim user phrases the model has noticed recur. No
// interpretation. The /api/practice/patterns route enforces the
// once-only contract by writing PatternObservation rows with
// surfaced_to_user=true after the avatar surfaces.

export const PatternObservationsSchema = z.object({
  patterns: z
    .array(
      z.object({
        // A short stable key for dedup. The model invents this; the API
        // route checks it against PatternObservation.patternType to
        // avoid surfacing the same pattern twice.
        key: z.string().min(1).max(120),
        // The verbatim phrase as the user said it (or close to it).
        phrase: z.string().min(1).max(200),
        // Which question it tends to come up under.
        questionType: z.enum(["body", "dream", "edge", "flirt"]),
        // Number of times observed.
        recurrence: z.number().int().min(2),
        firstSeen: z.string(),
        lastSeen: z.string(),
      }),
    )
    .max(8),
});
export type PatternObservations = z.infer<typeof PatternObservationsSchema>;

const PATTERN_TOOL: Anthropic.Tool = {
  name: "report_patterns",
  description:
    "Report observable, recurring phrases or themes across the user's recent practice entries. Pure observation — no interpretation. Only return patterns that recur at least twice with phrases that are clearly the same content.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      patterns: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            key: { type: "string", description: "Short stable dedup key, e.g. 'pulling-chest'." },
            phrase: { type: "string", description: "Verbatim user phrase." },
            questionType: { type: "string", enum: ["body", "dream", "edge", "flirt"] },
            recurrence: { type: "integer", minimum: 2 },
            firstSeen: { type: "string", description: "ISO-8601 date" },
            lastSeen: { type: "string", description: "ISO-8601 date" },
          },
          required: ["key", "phrase", "questionType", "recurrence", "firstSeen", "lastSeen"],
        },
      },
    },
    required: ["patterns"],
  } as unknown as Anthropic.Tool["input_schema"],
};

export type EntryForPattern = {
  questionType: "body" | "dream" | "edge" | "flirt";
  contentText: string;
  createdAt: Date;
};

/**
 * Ask the model to surface observable recurrences.
 * Returns at most 8 patterns. Empty array means nothing to surface.
 */
export async function detectPatterns(
  entries: EntryForPattern[],
  locale: Locale,
): Promise<PatternObservations["patterns"]> {
  if (entries.length < 5) return [];

  const lang = locale === "de" ? "Deutsch" : "English";
  const renderedEntries = entries
    .slice(-80)
    .map((e) => `- [${e.questionType}] ${e.createdAt.toISOString().slice(0, 10)} — ${e.contentText}`)
    .join("\n");

  const userTurn = `[Mode: pattern observation pass — internal, not shown to user verbatim]
Below are the user's recent practice entries. Identify phrases, body
sensations, dream images, edges, or flirts that genuinely recur across
multiple entries — same content, observable. Use the user's own words
in 'phrase'. Only count true recurrences (≥2 entries). Do not interpret.
Do not infer themes that aren't literally there. If nothing recurs,
return an empty array.

Respond by calling report_patterns. Use ${lang} for the phrase field
when the entries are in ${lang}.

Entries:
${renderedEntries}`;

  const response = await anthropic.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 2048,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [PATTERN_TOOL],
    tool_choice: { type: "tool", name: PATTERN_TOOL.name },
    messages: [{ role: "user", content: userTurn }],
  });

  for (const block of response.content) {
    if (block.type === "tool_use" && block.name === PATTERN_TOOL.name) {
      const parsed = PatternObservationsSchema.parse(block.input);
      return parsed.patterns;
    }
  }
  return [];
}

/**
 * Compose the once-only surfacing message in the user's locale (spec §5).
 * Plain observation tone — no interpretation, no question-loaded framing.
 */
export function composeSurfacingMessage(
  patterns: PatternObservations["patterns"],
  locale: Locale,
): string {
  if (!patterns.length) return "";
  if (locale === "de") {
    const lines = patterns.map(
      (p) =>
        `Das, was du «${p.phrase}» genannt hast, ist in den letzten Wochen ${p.recurrence}-mal aufgetaucht.`,
    );
    return `${lines.join(" ")} Möchtest du das gemeinsam ansehen?`;
  }
  const lines = patterns.map(
    (p) =>
      `What you called "${p.phrase}" has appeared ${p.recurrence} times in recent weeks.`,
  );
  return `${lines.join(" ")} Would you like to look at this together?`;
}
