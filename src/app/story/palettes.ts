import type { CSSProperties } from "react";

/**
 * Kapitel-Paletten — jedes Kapitel bekommt eine eigene Stimmung statt eines
 * einzigen globalen Dark-Themes: mal dunkel und satt, mal hell und
 * zurückhaltend. Das gibt der Erzählung einen emotionalen Rhythmus.
 *
 * Jede Palette liefert alle Farben, die die Templates brauchen — Hintergrund,
 * Text in drei Abstufungen, Akzent, Rahmen, Kartenfläche. Komponenten lesen
 * diese Werte über CSS-Variablen (var(--fg) etc.), die page.tsx pro Kapitel
 * setzt — kein Baustein muss wissen, welche Palette gerade aktiv ist.
 */

export type ChapterPalette = {
  mode: "dark" | "light";
  bg: string;
  fg: string;
  fgMuted: string;
  fgFaint: string;
  accent: string;
  accentSoft: string;
  border: string;
  surface: string;
};

export const palettes = {
  // Dunkel & satt — für Einstieg, Gefahr, Intensität.
  duskAmber: {
    mode: "dark",
    bg: "#000000",
    fg: "#ffffff",
    fgMuted: "rgba(255,255,255,0.72)",
    fgFaint: "rgba(255,255,255,0.42)",
    accent: "#fbbf24",
    accentSoft: "rgba(251,191,36,0.45)",
    border: "rgba(255,255,255,0.1)",
    surface: "rgba(255,255,255,0.03)",
  },
  midnightTeal: {
    mode: "dark",
    bg: "linear-gradient(180deg,#03181a 0%,#000000 65%)",
    fg: "#f2fbfa",
    fgMuted: "rgba(224,250,247,0.72)",
    fgFaint: "rgba(224,250,247,0.42)",
    accent: "#2dd4bf",
    accentSoft: "rgba(45,212,191,0.45)",
    border: "rgba(45,212,191,0.16)",
    surface: "rgba(45,212,191,0.05)",
  },
  crimsonDark: {
    mode: "dark",
    bg: "linear-gradient(180deg,#210505 0%,#000000 65%)",
    fg: "#fff6f6",
    fgMuted: "rgba(255,235,235,0.72)",
    fgFaint: "rgba(255,235,235,0.42)",
    accent: "#f87171",
    accentSoft: "rgba(248,113,113,0.45)",
    border: "rgba(248,113,113,0.16)",
    surface: "rgba(248,113,113,0.05)",
  },
  violetNight: {
    mode: "dark",
    bg: "linear-gradient(180deg,#150726 0%,#000000 65%)",
    fg: "#f6f1ff",
    fgMuted: "rgba(238,226,255,0.72)",
    fgFaint: "rgba(238,226,255,0.42)",
    accent: "#c084fc",
    accentSoft: "rgba(192,132,252,0.45)",
    border: "rgba(192,132,252,0.16)",
    surface: "rgba(192,132,252,0.05)",
  },
  // Hell & pastellig — für Reflexion, Ehrlichkeit, Hoffnung.
  pastelMint: {
    mode: "light",
    bg: "#eef7f0",
    fg: "#1c2b21",
    fgMuted: "rgba(28,43,33,0.68)",
    fgFaint: "rgba(28,43,33,0.45)",
    accent: "#3f9463",
    accentSoft: "rgba(63,148,99,0.3)",
    border: "rgba(28,43,33,0.12)",
    surface: "rgba(255,255,255,0.6)",
  },
  pastelDawn: {
    mode: "light",
    bg: "#fbf1ea",
    fg: "#2c2018",
    fgMuted: "rgba(44,32,24,0.68)",
    fgFaint: "rgba(44,32,24,0.45)",
    accent: "#c2703d",
    accentSoft: "rgba(194,112,61,0.3)",
    border: "rgba(44,32,24,0.12)",
    surface: "rgba(255,255,255,0.6)",
  },
} satisfies Record<string, ChapterPalette>;

export type PaletteKey = keyof typeof palettes;

/** CSS custom properties for a palette, to spread onto a section's style prop. */
export function paletteVars(key: PaletteKey): CSSProperties {
  const p = palettes[key];
  return {
    background: p.bg,
    color: p.fg,
    "--fg": p.fg,
    "--fg-muted": p.fgMuted,
    "--fg-faint": p.fgFaint,
    "--accent": p.accent,
    "--accent-soft": p.accentSoft,
    "--border": p.border,
    "--surface": p.surface,
  } as CSSProperties;
}
