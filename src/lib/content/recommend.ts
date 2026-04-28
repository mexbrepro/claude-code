import { LEARNING_CARDS, type CardTag } from "./learning-cards";

// Card recommendation (spec §3.2): cards are pulled, never pushed.
// This helper produces a single quiet offer. The UI calls it after
// something concrete surfaces — never on a timer, never as a nudge.
//
// Heuristic, deterministic, cheap. A model-assisted recommender could
// replace this later, but the simple keyword path is good enough for
// 10–40 cards and keeps card surfacing predictable.

const TAG_KEYWORDS: Record<CardTag, RegExp[]> = {
  edge: [
    /\bedge\b/i,
    /\bthreshold\b/i,
    /\bkante\b/i,
    /\bschwelle\b/i,
    /\bwould never\b/i,
    /\bich kann nicht\b/i,
    /\bich brauche nicht\b/i,
    /\bI don'?t need\b/i,
  ],
  dreambody: [
    /\bbody\b/i,
    /\bsensation\b/i,
    /\bchest\b/i,
    /\bbreath\b/i,
    /\bk[öo]rper\b/i,
    /\bbrust\b/i,
    /\batmen\b/i,
  ],
  essence: [/\bessence\b/i, /\bessenz\b/i, /\bunderneath\b/i, /\bdarunter\b/i],
  mindell: [
    /\bdream\b/i,
    /\btraum\b/i,
    /\bflirt(?:ed|s)?\b/i,
    /\bflirt(?:e|en)?\b/i,
    /\bdouble signal\b/i,
    /\bdoppelbotschaft\b/i,
  ],
  levy: [/\bobserver\b/i, /\bobserv(?:ation|ing)\b/i, /\bquantum\b/i, /\bbeobachter\b/i],
  df: [
    /\bstuck\b/i,
    /\bcircling\b/i,
    /\bloop\b/i,
    /\bfeststeck\b/i,
    /\bproblem(?:stellung|-?statement)\b/i,
  ],
  plurality: [/\bwe\b/i, /\bcommunity\b/i, /\bgroup\b/i, /\bgemeinschaft\b/i, /\bwir\b/i],
};

export type CardRecommendation = {
  slug: string;
  // The question that prompted the offer, e.g. "edge".
  triggerTag: CardTag;
};

/**
 * Recommend at most one card. Returns null when nothing matches —
 * silence is always valid (spec §6).
 */
export function recommendCard(
  text: string,
  excludeSlugs: string[] = [],
): CardRecommendation | null {
  if (!text.trim()) return null;
  const tagScores = new Map<CardTag, number>();
  for (const [tag, patterns] of Object.entries(TAG_KEYWORDS) as [CardTag, RegExp[]][]) {
    let hits = 0;
    for (const re of patterns) if (re.test(text)) hits++;
    if (hits) tagScores.set(tag, hits);
  }
  if (!tagScores.size) return null;

  // Pick the highest-scoring tag, then the first un-read card carrying that tag.
  const ranked = [...tagScores.entries()].sort((a, b) => b[1] - a[1]);
  for (const [tag] of ranked) {
    const card = LEARNING_CARDS.find(
      (c) => c.tags.includes(tag) && !excludeSlugs.includes(c.slug),
    );
    if (card) return { slug: card.slug, triggerTag: tag };
  }
  return null;
}
