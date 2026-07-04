import { story } from "./story.config";
import { paletteVars } from "./palettes";
import { Hero } from "@/components/story/Hero";
import { ReadingProgress } from "@/components/story/ReadingProgress";
import { ChapterNav } from "@/components/story/ChapterNav";
import { BlockRenderer } from "@/components/story/Blocks";

/**
 * Die zusammengesetzte Story. Diese Datei muss beim Schreiben der Inhalte
 * normalerweise NICHT angefasst werden — Kapitel und Bausteine kommen aus
 * story.config.ts. Hier wird nur die Reihenfolge/Gestaltung orchestriert.
 */
export default function StoryPage() {
  const { meta, chapters } = story;

  return (
    <main className="relative">
      <ReadingProgress />
      <ChapterNav chapters={chapters.map((c) => ({ id: c.id, nav: c.nav }))} />

      <Hero
        title={meta.title}
        subtitle={meta.subtitle}
        image={meta.heroImage}
        footerNote={meta.footerNote}
      />

      {chapters.map((chapter) => (
        <section
          key={chapter.id}
          id={chapter.id}
          className="relative scroll-mt-0 border-t"
          style={{ ...paletteVars(chapter.palette), borderColor: "var(--border)" }}
        >
          {/* Kapitel-Titelzeile */}
          <div className="mx-auto max-w-2xl px-6 pt-20 md:pt-28">
            <div
              className="h-px w-16"
              style={{
                background: `linear-gradient(to right, var(--accent), transparent)`,
              }}
            />
            <h2
              className="mt-6 text-4xl font-bold leading-tight sm:text-5xl"
              style={{ fontFamily: "var(--font-cabin)", color: "var(--fg)" }}
            >
              {chapter.title}
            </h2>
          </div>

          {chapter.blocks.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </section>
      ))}

      {/* Abspann */}
      <footer className="border-t border-white/10 px-6 py-24 text-center">
        <p
          className="text-2xl font-semibold text-white/80"
          style={{ fontFamily: "var(--font-cabin)" }}
        >
          {meta.title}
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/40">
          {meta.footerNote}
        </p>
        <p className="mt-6 text-xs text-white/30">{meta.authors}</p>
      </footer>
    </main>
  );
}
