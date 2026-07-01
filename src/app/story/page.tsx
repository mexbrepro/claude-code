import { story } from "./story.config";
import { Hero } from "@/components/story/Hero";
import { ReadingProgress } from "@/components/story/ReadingProgress";
import { ChapterNav } from "@/components/story/ChapterNav";
import { BlockRenderer } from "@/components/story/Blocks";

const ACCENT_LINE: Record<string, string> = {
  amber: "from-amber-400/60",
  red: "from-red-500/60",
  sky: "from-sky-400/60",
  emerald: "from-emerald-400/60",
};

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
          className="relative scroll-mt-0 border-t border-white/5"
        >
          {/* Kapitel-Titelzeile */}
          <div className="mx-auto max-w-2xl px-6 pt-20 md:pt-28">
            <div
              className={`h-px w-16 bg-gradient-to-r to-transparent ${
                ACCENT_LINE[chapter.accent ?? "amber"]
              }`}
            />
            <h2 className="mt-6 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
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
        <p className="font-serif text-2xl text-white/80">{meta.title}</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/40">
          {meta.footerNote}
        </p>
        <p className="mt-6 text-xs text-white/30">{meta.authors}</p>
      </footer>
    </main>
  );
}
