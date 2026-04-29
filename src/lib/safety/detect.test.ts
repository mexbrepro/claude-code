import { describe, expect, it } from "vitest";
import { detectStage3, safetyResources } from "./detect";

describe("Stage-3 detection", () => {
  it("flags suicidal ideation in English", () => {
    const hits = detectStage3("I want to kill myself");
    expect(hits.map((h) => h.trigger)).toContain("suicidal_ideation");
  });

  it("flags suicidal ideation in German", () => {
    const hits = detectStage3("Ich will mich umbringen");
    expect(hits.map((h) => h.trigger)).toContain("suicidal_ideation");
  });

  it("flags self-harm", () => {
    expect(detectStage3("I have been cutting myself").length).toBeGreaterThan(0);
    expect(detectStage3("Ich ritze mich seit Wochen").length).toBeGreaterThan(0);
  });

  it("flags trauma reactivation", () => {
    const hits = detectStage3("I'm having a flashback right now");
    expect(hits.map((h) => h.trigger)).toContain("trauma_reactivation");
  });

  it("flags dissociation", () => {
    expect(detectStage3("I'm not really here anymore").length).toBeGreaterThan(0);
    expect(detectStage3("Alles fühlt sich unwirklich an").length).toBeGreaterThan(0);
  });

  it("flags identity destabilization", () => {
    expect(detectStage3("I don't know who I am").length).toBeGreaterThan(0);
  });

  it("flags acute somatic distress", () => {
    expect(detectStage3("Severe chest pain").length).toBeGreaterThan(0);
  });

  it("does not flag normal Stage-2 material", () => {
    // Edge language is allowed; it must NOT trip Stage-3.
    expect(detectStage3("am liebsten würde ich mich zurückziehen")).toEqual([]);
    expect(detectStage3("I am so fed up with this conversation")).toEqual([]);
    expect(detectStage3("The pulling in my chest")).toEqual([]);
    expect(detectStage3("Ein Vogel ist mir aufgefallen")).toEqual([]);
  });

  it("returns evidence pointing at the matched substring", () => {
    const [hit] = detectStage3("I want to end my life");
    expect(hit).toBeDefined();
    expect(hit.evidence.toLowerCase()).toContain("end my life");
  });
});

describe("safetyResources", () => {
  it("returns localized bridge messages", () => {
    expect(safetyResources("en").bridgeMessage).toMatch(/process worker|practitioner/i);
    expect(safetyResources("de").bridgeMessage).toMatch(/Mensch|Prozess/i);
  });

  it("includes practitioner directory + crisis links", () => {
    const en = safetyResources("en");
    const labels = en.links.map((l) => l.label.toLowerCase());
    expect(labels.some((l) => l.includes("iapop"))).toBe(true);
    expect(labels.some((l) => l.includes("dynamic facilitation"))).toBe(true);
  });
});
