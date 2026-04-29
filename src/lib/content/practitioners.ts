// Practitioner directory (spec Phase 5: open-ended doors to IAPOP, the
// DF community, and adjacent practitioners). The point is to point
// outward — to a person — when the user is ready, not to host
// listings ourselves. Each entry is a curated link.
//
// Region is a soft locale grouping rather than a country list, because
// process-work and DF practitioners cluster around language, not borders.

import type { Locale } from "@/lib/claude/system-prompt";

export type PractitionerKind =
  | "process_work"
  | "dynamic_facilitation"
  | "wisdom_council"
  | "crisis_line";

export type PractitionerEntry = {
  id: string;
  kind: PractitionerKind;
  // Region is a soft language/cultural grouping. "intl" means
  // worldwide directories that work across regions.
  region: "intl" | "de_at_ch" | "us" | "uk_ie";
  title: Record<Locale, string>;
  body: Record<Locale, string>;
  url: string;
};

export const PRACTITIONERS: PractitionerEntry[] = [
  {
    id: "iapop",
    kind: "process_work",
    region: "intl",
    title: {
      en: "IAPOP — International Association for Process Oriented Psychology",
      de: "IAPOP — Internationale Vereinigung für Prozessorientierte Psychologie",
    },
    body: {
      en:
        "Practitioner directory for Mindell-trained process workers. Searchable by city and language. The right first stop when material asks for embodied work in person.",
      de:
        "Verzeichnis von in der Mindell-Tradition ausgebildeten Prozessarbeiterinnen. Suchbar nach Stadt und Sprache. Die erste Adresse, wenn etwas körperlich in Anwesenheit eines Menschen gehalten werden möchte.",
    },
    url: "https://www.iapop.com/find-a-pw/",
  },
  {
    id: "df-community",
    kind: "dynamic_facilitation",
    region: "intl",
    title: {
      en: "Dynamic Facilitation Community",
      de: "Dynamic-Facilitation-Community",
    },
    body: {
      en:
        "Jim Rough's Dynamic Facilitation network. Trainers and facilitators around the world. Useful when stuckness wants a group, not just a person.",
      de:
        "Jim Roughs Dynamic-Facilitation-Netzwerk. Trainerinnen und Facilitatoren weltweit. Hilfreich, wenn Feststecken eine Gruppe braucht, nicht nur einen Menschen.",
    },
    url: "https://www.tobe.net/df/",
  },
  {
    id: "wisdom-council-network",
    kind: "wisdom_council",
    region: "intl",
    title: {
      en: "Wisdom Council Network",
      de: "Wisdom-Council-Netzwerk",
    },
    body: {
      en:
        "Practitioners who run Wisdom Council Processes for communities and organizations.",
      de:
        "Begleitungen, die Wisdom-Council-Prozesse für Gemeinschaften und Organisationen durchführen.",
    },
    url: "https://www.wisedemocracy.org/",
  },
  {
    id: "iposat",
    kind: "process_work",
    region: "de_at_ch",
    title: {
      en: "Institut für Prozessarbeit (Zürich)",
      de: "Institut für Prozessarbeit (Zürich)",
    },
    body: {
      en:
        "Process Work Institute Zurich — German-speaking process workers and training. Often the closest path for users in DACH.",
      de:
        "Institut für Prozessarbeit Zürich — deutschsprachige Prozessarbeiterinnen und Ausbildung. Oft der nächste Weg für Menschen im DACH-Raum.",
    },
    url: "https://www.institut-prozessarbeit.ch/",
  },
  {
    id: "telefonseelsorge-de",
    kind: "crisis_line",
    region: "de_at_ch",
    title: {
      en: "Telefonseelsorge (Germany — 0800 111 0 111 / 0800 111 0 222)",
      de: "Telefonseelsorge (Deutschland — 0800 111 0 111 / 0800 111 0 222)",
    },
    body: {
      en:
        "Free, anonymous, 24/7 support in German. The right number when something feels acute and a process worker is hours away.",
      de:
        "Kostenlos, anonym, 24/7 auf Deutsch. Die richtige Nummer, wenn etwas akut ist und eine Prozessarbeiterin Stunden entfernt ist.",
    },
    url: "https://www.telefonseelsorge.de/",
  },
  {
    id: "telefonseelsorge-at",
    kind: "crisis_line",
    region: "de_at_ch",
    title: {
      en: "Telefonseelsorge Österreich (142)",
      de: "Telefonseelsorge Österreich (142)",
    },
    body: {
      en: "Free, anonymous, 24/7 support in Austria. Dial 142.",
      de: "Kostenlos, anonym, 24/7 in Österreich. 142.",
    },
    url: "https://www.telefonseelsorge.at/",
  },
  {
    id: "dargebotene-hand-ch",
    kind: "crisis_line",
    region: "de_at_ch",
    title: {
      en: "Die Dargebotene Hand (Switzerland — 143)",
      de: "Die Dargebotene Hand (Schweiz — 143)",
    },
    body: {
      en: "Free, anonymous, 24/7 support in Switzerland. Dial 143.",
      de: "Kostenlos, anonym, 24/7 in der Schweiz. 143.",
    },
    url: "https://www.143.ch/",
  },
  {
    id: "988-us",
    kind: "crisis_line",
    region: "us",
    title: {
      en: "988 Suicide & Crisis Lifeline (US)",
      de: "988 Suicide & Crisis Lifeline (USA)",
    },
    body: {
      en: "Free, confidential support in the US — call or text 988.",
      de: "Kostenlose, vertrauliche Unterstützung in den USA — 988 anrufen oder SMS.",
    },
    url: "https://988lifeline.org/",
  },
  {
    id: "samaritans-uk",
    kind: "crisis_line",
    region: "uk_ie",
    title: {
      en: "Samaritans (UK & Ireland — 116 123)",
      de: "Samaritans (UK & Irland — 116 123)",
    },
    body: {
      en: "Free, 24/7, confidential. 116 123.",
      de: "Kostenlos, 24/7, vertraulich. 116 123.",
    },
    url: "https://www.samaritans.org/",
  },
  {
    id: "findahelpline",
    kind: "crisis_line",
    region: "intl",
    title: {
      en: "findahelpline.com — worldwide directory",
      de: "findahelpline.com — weltweites Verzeichnis",
    },
    body: {
      en:
        "Filter by country, what you're going through, and how you'd like to reach out. Useful when none of the regional numbers fit.",
      de:
        "Nach Land, Anlass und Kontaktart filterbar. Sinnvoll, wenn keine der regionalen Nummern passt.",
    },
    url: "https://findahelpline.com/",
  },
];
