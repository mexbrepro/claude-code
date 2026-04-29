import { describe, expect, it } from "vitest";
import {
  FEW_SHOT_WE_FLECTION,
  HARVEST_QUESTIONS,
  OPENERS,
  PRACTICE_QUESTIONS,
  SYSTEM_PROMPT,
  pickOpener,
} from "./system-prompt";

describe("OPENERS", () => {
  it("provides exactly seven openers per locale (spec §6.3)", () => {
    expect(OPENERS.en).toHaveLength(7);
    expect(OPENERS.de).toHaveLength(7);
  });

  it("openers are unique within a locale", () => {
    expect(new Set(OPENERS.en).size).toBe(OPENERS.en.length);
    expect(new Set(OPENERS.de).size).toBe(OPENERS.de.length);
  });
});

describe("pickOpener", () => {
  it("returns an opener from the requested locale", () => {
    expect(OPENERS.en).toContain(pickOpener("en"));
    expect(OPENERS.de).toContain(pickOpener("de"));
  });

  it("avoids recently-used openers when alternatives exist", () => {
    const recent = OPENERS.en.slice(0, 6); // six recent → only one fresh
    expect(pickOpener("en", recent)).toBe(OPENERS.en[6]);
  });

  it("falls back to the full repertoire when every opener is recent", () => {
    expect(OPENERS.en).toContain(pickOpener("en", [...OPENERS.en]));
  });
});

describe("PRACTICE_QUESTIONS", () => {
  it("covers all four question types in both locales", () => {
    for (const locale of ["en", "de"] as const) {
      const q = PRACTICE_QUESTIONS[locale];
      expect(Object.keys(q).sort()).toEqual(["body", "dream", "edge", "flirt"]);
      for (const v of Object.values(q)) {
        expect(v.length).toBeGreaterThan(10);
      }
    }
  });
});

describe("HARVEST_QUESTIONS", () => {
  it("uses the verbatim spec phrasing", () => {
    expect(HARVEST_QUESTIONS.de.ofCourses).toBe("Was ist dir selbstverständlich geworden?");
    expect(HARVEST_QUESTIONS.de.openThreads).toBe("Gibt es etwas, das offen geblieben ist?");
    expect(HARVEST_QUESTIONS.en.ofCourses).toBe("What has become self-evident for you?");
    expect(HARVEST_QUESTIONS.en.openThreads).toBe("Is there something that stayed open?");
  });
});

describe("FEW_SHOT_WE_FLECTION", () => {
  it("is non-empty so the model has concrete pattern anchors", () => {
    expect(FEW_SHOT_WE_FLECTION.length).toBeGreaterThanOrEqual(6);
  });

  it("each example's assistant turn parses as the chart-classification JSON", () => {
    for (const ex of FEW_SHOT_WE_FLECTION) {
      const obj = JSON.parse(ex.assistant);
      expect(obj).toHaveProperty("chart");
      expect(obj).toHaveProperty("user_words_condensed");
      expect(obj).toHaveProperty("verbal_response");
      expect(typeof obj.edge_marker).toBe("boolean");
      expect(typeof obj.is_problem_statement_migration).toBe("boolean");
      expect(["solution", "concern", "data", "problem_statement"]).toContain(obj.chart);
    }
  });

  it("condensed user_words remain a substring or near-substring of the source", () => {
    // Spec §6.13: condensation by removal, not paraphrase. The model must
    // keep the user's own words. This is a coarse proxy: every word in
    // the condensed form should appear in the source.
    for (const ex of FEW_SHOT_WE_FLECTION) {
      const obj = JSON.parse(ex.assistant);
      const src = ex.user.toLowerCase();
      const condensed: string = obj.user_words_condensed.toLowerCase();
      for (const word of condensed.split(/[\s.,!?]+/).filter(Boolean)) {
        expect(src).toContain(word);
      }
    }
  });
});

describe("SYSTEM_PROMPT", () => {
  it("encodes the four hard rules and the forbidden list", () => {
    expect(SYSTEM_PROMPT).toMatch(/Default response is silent classification/i);
    expect(SYSTEM_PROMPT).toMatch(/Never ask about classification/i);
    expect(SYSTEM_PROMPT).toMatch(/Silence is always valid/i);
    expect(SYSTEM_PROMPT).toMatch(/Condensation is by removal/i);
    expect(SYSTEM_PROMPT).toMatch(/No advice/i);
    expect(SYSTEM_PROMPT).toMatch(/No emotional labeling/i);
    expect(SYSTEM_PROMPT).toMatch(/No paraphrasing/i);
  });

  it("instructs the harvest order", () => {
    expect(SYSTEM_PROMPT).toMatch(/self-evident/i);
    expect(SYSTEM_PROMPT).toMatch(/stayed open/i);
  });

  it("names the PRESENCE escape mode for Stage-3 material", () => {
    expect(SYSTEM_PROMPT).toMatch(/PRESENCE/);
    expect(SYSTEM_PROMPT).toMatch(/dissociation/i);
  });
});
