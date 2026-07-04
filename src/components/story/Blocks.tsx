import type { StoryBlock } from "@/app/story/story.config";
import { Reveal } from "./Reveal";
import { EmbedFrame } from "./EmbedFrame";
import { StatCounter } from "./StatCounter";
import { StickyScrolly } from "./StickyScrolly";

/**
 * BlockRenderer — übersetzt einen Baustein aus story.config.ts in das
 * passende Template. Neue Bausteintypen hier ergänzen.
 */
export function BlockRenderer({ block }: { block: StoryBlock }) {
  switch (block.type) {
    case "prose":
      return (
        <Reveal className="mx-auto max-w-2xl px-6 py-16 md:py-24">
          {block.kicker && (
            <p
              className="mb-3 text-xs uppercase tracking-[0.3em]"
              style={{ fontFamily: "var(--font-cabin)", color: "var(--accent)" }}
            >
              {block.kicker}
            </p>
          )}
          {block.heading && (
            <h2
              className="mb-6 text-3xl font-bold leading-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-cabin)", color: "var(--fg)" }}
            >
              {block.heading}
            </h2>
          )}
          <div className="space-y-5">
            {block.body.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      );

    case "pullquote":
      return (
        <Reveal className="mx-auto max-w-3xl px-6 py-16 text-center md:py-28">
          <blockquote
            className="text-2xl font-medium italic leading-snug sm:text-3xl md:text-4xl"
            style={{ color: "var(--fg)" }}
          >
            <span style={{ color: "var(--accent)" }}>“</span>
            {block.quote}
            <span style={{ color: "var(--accent)" }}>”</span>
          </blockquote>
          {block.cite && (
            <cite
              className="mt-6 block text-sm not-italic"
              style={{ color: "var(--fg-faint)" }}
            >
              — {block.cite}
            </cite>
          )}
        </Reveal>
      );

    case "fullBleed":
      return (
        <section className="relative flex min-h-[80vh] w-full items-end overflow-hidden py-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${block.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <Reveal className="relative z-10 mx-auto max-w-2xl px-6">
            {block.heading && (
              <h2
                className="text-3xl font-bold text-white sm:text-5xl"
                style={{ fontFamily: "var(--font-cabin)" }}
              >
                {block.heading}
              </h2>
            )}
            {block.body && (
              <p className="mt-4 text-lg text-white/80">{block.body}</p>
            )}
            {block.caption && (
              <p className="mt-4 text-xs text-white/40">{block.caption}</p>
            )}
          </Reveal>
        </section>
      );

    case "stats":
      return (
        <Reveal className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          {block.heading && (
            <h3
              className="mb-14 text-center text-sm uppercase tracking-[0.3em]"
              style={{ fontFamily: "var(--font-cabin)", color: "var(--fg-faint)" }}
            >
              {block.heading}
            </h3>
          )}
          <div className="grid gap-14 sm:grid-cols-3">
            {block.items.map((item, i) => (
              <StatCounter key={i} {...item} />
            ))}
          </div>
        </Reveal>
      );

    case "embed":
      return (
        <div className="py-16 md:py-24">
          <EmbedFrame
            tool={block.tool}
            src={block.src}
            title={block.title}
            heightVh={block.heightVh}
            note={block.note}
          />
        </div>
      );

    case "scrolly":
      return (
        <div className="py-16 md:py-24">
          <StickyScrolly heading={block.heading} steps={block.steps} />
        </div>
      );

    default:
      return null;
  }
}
