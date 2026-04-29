import { describe, expect, it } from "vitest";
import { recommendCard } from "./recommend";
import { LEARNING_CARDS } from "./learning-cards";

describe("recommendCard", () => {
  it("returns null for empty / unrelated text", () => {
    expect(recommendCard("")).toBeNull();
    expect(recommendCard("the weather is fine today")).toBeNull();
  });

  it("recommends an edge card for edge language", () => {
    const rec = recommendCard("I would never say this out loud, it's at the threshold for me");
    expect(rec).not.toBeNull();
    expect(rec?.triggerTag).toBe("edge");
  });

  it("recommends a dreambody card for body language", () => {
    const rec = recommendCard("I felt a pulling in my chest while breathing");
    expect(rec).not.toBeNull();
    expect(rec?.triggerTag).toBe("dreambody");
  });

  it("recommends a stuckness card for circling/loop language", () => {
    const rec = recommendCard("I keep circling, I am stuck in a loop");
    expect(rec).not.toBeNull();
    expect(rec?.triggerTag).toBe("df");
  });

  it("excludes already-read cards", () => {
    const text = "the threshold I cannot cross — what I would never say";
    const fresh = recommendCard(text);
    expect(fresh).not.toBeNull();
    const excluded = recommendCard(text, [fresh!.slug]);
    if (excluded) {
      expect(excluded.slug).not.toBe(fresh!.slug);
    } else {
      // Fine: there may not be a second matching card for that single tag.
      expect(excluded).toBeNull();
    }
  });

  it("only ever returns slugs that exist in the catalog", () => {
    const rec = recommendCard("dream came in the night with a flirt at the window");
    if (rec) {
      expect(LEARNING_CARDS.find((c) => c.slug === rec.slug)).toBeDefined();
    }
  });
});
