// Stage-3 detection (spec §6.16). The avatar holds at Stage 2; when material
// crosses into Stage 3 territory, we route to a human practitioner.
//
// This is a deliberately conservative first-line filter that runs before
// every avatar turn. False positives are acceptable — a missed Stage 3
// cue is not. The model also classifies safety risk in its own pass; the
// orchestrator unions both signals.

import type { Locale } from "@/lib/claude/system-prompt";

export type SafetyTrigger =
  | "suicidal_ideation"
  | "self_harm"
  | "trauma_reactivation"
  | "dissociation"
  | "identity_destabilization"
  | "acute_somatic";

export type SafetyHit = {
  trigger: SafetyTrigger;
  evidence: string;
};

const PATTERNS: Array<{ trigger: SafetyTrigger; patterns: RegExp[] }> = [
  {
    trigger: "suicidal_ideation",
    patterns: [
      /\b(?:kill myself|end my life|suicide|don'?t want to live|wish i (?:was|were) dead)\b/i,
      /\b(?:nicht mehr leben|umbringen|selbstmord|aus dem leben)\b/i,
    ],
  },
  {
    trigger: "self_harm",
    patterns: [
      /\b(?:cutting myself|self[- ]harm|hurting myself|burn(?:ed|ing) myself)\b/i,
      /\b(?:selbstverletzung|ritze|mich verletzen)\b/i,
    ],
  },
  {
    trigger: "trauma_reactivation",
    patterns: [
      /\b(?:flashback|reliving|cannot stop seeing|frozen|can'?t breathe|panic attack)\b/i,
      /\b(?:flashback|wieder erleben|nicht atmen|panik)\b/i,
    ],
  },
  {
    trigger: "dissociation",
    patterns: [
      /\b(?:not really here|watching myself|outside my body|everything (?:feels|seems) far away|unreal)\b/i,
      /\b(?:nicht wirklich (?:hier|da)|unwirklich|wie hinter glas|außerhalb meines körpers)\b/i,
    ],
  },
  {
    trigger: "identity_destabilization",
    patterns: [
      /\b(?:i don'?t know who i am|losing myself entirely|nothing is real anymore)\b/i,
      /\b(?:weiß nicht mehr wer ich bin|verliere mich völlig|nichts ist mehr echt)\b/i,
    ],
  },
  {
    trigger: "acute_somatic",
    patterns: [
      /\b(?:chest pain|can'?t feel my (?:legs|arms)|severe pain|cannot move)\b/i,
      /\b(?:starke schmerzen|brustschmerzen|spüre meine .* nicht)\b/i,
    ],
  },
];

export function detectStage3(text: string): SafetyHit[] {
  const hits: SafetyHit[] = [];
  for (const { trigger, patterns } of PATTERNS) {
    for (const re of patterns) {
      const match = text.match(re);
      if (match) {
        hits.push({ trigger, evidence: match[0] });
        break;
      }
    }
  }
  return hits;
}

// Locale-specific resources surfaced when a Stage-3 hit fires.
// Curated list per spec §6: process workers (IAPOP), DF community, local crisis lines.
export function safetyResources(locale: Locale) {
  if (locale === "de") {
    return {
      bridgeMessage:
        "Etwas Tiefes meldet sich hier. Diese Art von Arbeit braucht einen Menschen mit dir im Raum. Ich kann dir helfen, eine Prozessarbeiterin oder einen Dynamic Facilitator in deiner Nähe zu finden — oder wir bleiben einfach bei dem, was gerade da ist, ohne weiterzugehen. Was würde dir dienen?",
      links: [
        { label: "IAPOP — International Association of Process Oriented Psychology", url: "https://www.iapop.com/" },
        { label: "Dynamic Facilitation Community", url: "https://www.tobe.net/df/" },
        { label: "Telefonseelsorge (DE)", url: "https://www.telefonseelsorge.de/" },
        { label: "Telefonseelsorge (AT)", url: "https://www.telefonseelsorge.at/" },
        { label: "Die Dargebotene Hand (CH)", url: "https://www.143.ch/" },
      ],
    };
  }
  return {
    bridgeMessage:
      "Something deep is asking for attention here. This is the kind of work that needs a person in the room with you. I can help you find a process worker or a Dynamic Facilitator near you, or we can sit with what is here without going further. What would serve you?",
    links: [
      { label: "IAPOP — International Association of Process Oriented Psychology", url: "https://www.iapop.com/" },
      { label: "Dynamic Facilitation Community", url: "https://www.tobe.net/df/" },
      { label: "Crisis hotlines worldwide (findahelpline.com)", url: "https://findahelpline.com/" },
      { label: "988 Suicide & Crisis Lifeline (US)", url: "https://988lifeline.org/" },
    ],
  };
}
