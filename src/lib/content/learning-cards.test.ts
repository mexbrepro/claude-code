import { describe, expect, it } from "vitest";
import { LEARNING_CARDS, getCardBySlug } from "./learning-cards";

describe("LEARNING_CARDS catalog", () => {
  it("has unique ids and slugs", () => {
    const ids = LEARNING_CARDS.map((c) => c.id);
    const slugs = LEARNING_CARDS.map((c) => c.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has both locales for every card", () => {
    for (const card of LEARNING_CARDS) {
      expect(card.title.en.length).toBeGreaterThan(2);
      expect(card.title.de.length).toBeGreaterThan(2);
      expect(card.body.en.length).toBeGreaterThan(80);
      expect(card.body.de.length).toBeGreaterThan(80);
    }
  });

  it("related references resolve to existing cards", () => {
    const ids = new Set(LEARNING_CARDS.map((c) => c.id));
    const slugs = new Set(LEARNING_CARDS.map((c) => c.slug));
    for (const card of LEARNING_CARDS) {
      for (const ref of card.related) {
        expect(ids.has(ref) || slugs.has(ref)).toBe(true);
      }
    }
  });

  it("getCardBySlug round-trips", () => {
    for (const card of LEARNING_CARDS) {
      expect(getCardBySlug(card.slug)?.id).toBe(card.id);
    }
    expect(getCardBySlug("nope")).toBeUndefined();
  });

  it("covers the spec's named territories", () => {
    const tags = new Set(LEARNING_CARDS.flatMap((c) => c.tags));
    for (const required of ["mindell", "levy", "df", "plurality", "edge", "dreambody"]) {
      expect(tags.has(required as never)).toBe(true);
    }
  });
});
