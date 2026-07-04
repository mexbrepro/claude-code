"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { story, type Chapter, type StoryBlock } from "../story.config";

// Echte Ausschnitte aus der Story, damit der Vergleich nicht mit
// Platzhaltertext, sondern mit eurem tatsächlichen Inhalt passiert.
const chapters = story.chapters as Chapter[];
const chronik = chapters.find((c) => c.id === "chronik")!;
const prose = chronik.blocks.find((b) => b.type === "prose") as Extract<
  StoryBlock,
  { type: "prose" }
>;
const stats = chronik.blocks.find((b) => b.type === "stats") as Extract<
  StoryBlock,
  { type: "stats" }
>;
const prolog = chapters.find((c) => c.id === "prolog")!;
const quote = prolog.blocks.find((b) => b.type === "pullquote") as Extract<
  StoryBlock,
  { type: "pullquote" }
>;

type Theme = "dramatic" | "editorial";

export default function StylePreviewPage() {
  const [theme, setTheme] = useState<Theme>("dramatic");

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Umschalter */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-2 border-b border-white/10 bg-neutral-900/95 px-4 py-4 backdrop-blur">
        <TabButton active={theme === "dramatic"} onClick={() => setTheme("dramatic")}>
          1 · Düster-dramatisch
        </TabButton>
        <TabButton active={theme === "editorial"} onClick={() => setTheme("editorial")}>
          2 · Clean &amp; editorial
        </TabButton>
      </div>

      {theme === "dramatic" ? <Dramatic /> : <Editorial />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm transition-colors",
        active
          ? "bg-white text-neutral-900"
          : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

// ─────────────────────── Variante 1: Düster-dramatisch ───────────────────
function Dramatic() {
  return (
    <div
      className="relative min-h-screen bg-black text-white"
      style={{ fontFamily: "var(--font-lora)" }}
    >
      {/* Vignette + Korn für Kino-Anmutung */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />

      <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 h-px w-16 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
        <h1
          className="text-6xl font-bold tracking-tight text-white sm:text-8xl"
          style={{ fontFamily: "var(--font-cabin)" }}
        >
          {story.meta.title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60">
          {story.meta.subtitle}
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-24">
        <p
          className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-400"
          style={{ fontFamily: "var(--font-cabin)" }}
        >
          {prose.kicker}
        </p>
        <h2
          className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl"
          style={{ fontFamily: "var(--font-cabin)" }}
        >
          {prose.heading}
        </h2>
        <div className="space-y-5">
          {prose.body.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed text-white/70">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <blockquote className="text-3xl font-medium italic leading-snug text-white sm:text-4xl">
          <span className="text-amber-400">“</span>
          {quote.quote}
          <span className="text-amber-400">”</span>
        </blockquote>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24">
        <h3
          className="mb-14 text-center text-sm uppercase tracking-[0.35em] text-white/40"
          style={{ fontFamily: "var(--font-cabin)" }}
        >
          {stats.heading}
        </h3>
        <div className="grid gap-14 sm:grid-cols-3">
          {stats.items.map((item, i) => (
            <div key={i} className="text-center">
              <div
                className="text-6xl font-bold tabular-nums text-white"
                style={{ fontFamily: "var(--font-cabin)" }}
              >
                {item.value.toLocaleString("de-DE")}
                <span className="text-amber-400">{item.suffix}</span>
              </div>
              <p className="mx-auto mt-3 max-w-[22ch] text-sm text-white/50">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─────────────────────── Variante 2: Clean & editorial ───────────────────
function Editorial() {
  return (
    <div
      className="min-h-screen bg-[#faf7f2] text-[#242019]"
      style={{ fontFamily: "var(--font-lora)" }}
    >
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#8a6a3f]">
          {story.meta.footerNote}
        </p>
        <h1
          className="text-6xl font-bold leading-[1.05] tracking-tight text-[#1a1712] sm:text-7xl"
          style={{ fontFamily: "var(--font-cabin)" }}
        >
          {story.meta.title}
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-[#5c5347]">
          {story.meta.subtitle}
        </p>
      </section>

      <div className="mx-auto h-px max-w-3xl bg-[#e4dcc9]" />

      <section className="mx-auto max-w-2xl px-6 py-24">
        <p
          className="mb-3 text-xs uppercase tracking-[0.3em] text-[#8a6a3f]"
          style={{ fontFamily: "var(--font-cabin)" }}
        >
          {prose.kicker}
        </p>
        <h2
          className="mb-6 text-3xl font-bold leading-tight text-[#1a1712] sm:text-4xl"
          style={{ fontFamily: "var(--font-cabin)" }}
        >
          {prose.heading}
        </h2>
        <div className="space-y-5">
          {prose.body.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed text-[#3a342c]">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <blockquote className="text-2xl font-medium italic leading-snug text-[#1a1712] sm:text-3xl">
          „{quote.quote}“
        </blockquote>
      </section>

      <div className="mx-auto h-px max-w-3xl bg-[#e4dcc9]" />

      <section className="mx-auto max-w-5xl px-6 py-24">
        <h3
          className="mb-14 text-center text-xs uppercase tracking-[0.3em] text-[#8a6a3f]"
          style={{ fontFamily: "var(--font-cabin)" }}
        >
          {stats.heading}
        </h3>
        <div className="grid gap-14 sm:grid-cols-3">
          {stats.items.map((item, i) => (
            <div key={i} className="text-center">
              <div
                className="text-5xl font-bold tabular-nums text-[#1a1712]"
                style={{ fontFamily: "var(--font-cabin)" }}
              >
                {item.value.toLocaleString("de-DE")}
                <span className="text-[#a8623a]">{item.suffix}</span>
              </div>
              <p className="mx-auto mt-3 max-w-[22ch] text-sm text-[#6b6357]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
