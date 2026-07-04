"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type NavItem = { id: string; nav: string };

/**
 * ChapterNav — dezente, sticky Kapitel-Navigation am rechten Rand (Desktop).
 * Markiert automatisch das Kapitel, das gerade sichtbar ist.
 */
export function ChapterNav({ chapters }: { chapters: NavItem[] }) {
  const [active, setActive] = useState(chapters[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const c of chapters) {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav
      aria-label="Kapitel"
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 rounded-full border border-white/10 bg-neutral-950/85 px-3 py-4 shadow-lg shadow-black/30 backdrop-blur-md lg:flex"
    >
      {chapters.map((c) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          className="pointer-events-auto group flex items-center justify-end gap-3"
        >
          <span
            className={cn(
              "whitespace-nowrap text-xs uppercase tracking-widest transition-all duration-300",
              active === c.id
                ? "text-white opacity-100"
                : "text-white/40 opacity-0 group-hover:opacity-100",
            )}
            style={{ fontFamily: "var(--font-cabin)" }}
          >
            {c.nav}
          </span>
          <span
            className={cn(
              "h-2 w-2 rounded-full border transition-all duration-300",
              active === c.id
                ? "scale-125 border-amber-400 bg-amber-400"
                : "border-white/40 bg-transparent group-hover:border-white",
            )}
          />
        </a>
      ))}
    </nav>
  );
}
