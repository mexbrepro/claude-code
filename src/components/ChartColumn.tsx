"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type ChartType = "solution" | "concern" | "data" | "problem_statement";

export type ChartEntryView = {
  id: string;
  contentCondensed: string;
  edgeMarker: boolean;
  // For Problem-Statement migrations: an old version that should render grayed.
  parentEntryId?: string | null;
  isMigratedFrom?: boolean;
  bookmarked?: boolean;
};

const NEXT_CHART: Record<ChartType, ChartType> = {
  solution: "concern",
  concern: "data",
  data: "problem_statement",
  problem_statement: "solution",
};

export function ChartColumn({
  type,
  label,
  entries,
  onMove,
  onBookmark,
}: {
  type: ChartType;
  label: string;
  entries: ChartEntryView[];
  onMove?: (entryId: string, to: ChartType) => void;
  onBookmark?: (entryId: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <section
      aria-label={label}
      className={cn(
        "flex min-h-[12rem] flex-col gap-3 rounded transition-colors",
        dragOver && "bg-ground-100/40",
      )}
      onDragOver={(ev) => {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(ev) => {
        setDragOver(false);
        const id = ev.dataTransfer.getData("text/dc-entry");
        if (id && onMove) onMove(id, type);
      }}
    >
      <header className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {label}
      </header>
      <ul className="flex flex-col gap-3">
        {entries.map((e) => (
          <li
            key={e.id}
            draggable={!e.isMigratedFrom}
            tabIndex={e.isMigratedFrom ? -1 : 0}
            role="listitem"
            aria-label={`${label}: ${e.contentCondensed}${e.bookmarked ? " — bookmarked" : ""}${e.edgeMarker ? " — edge" : ""}`}
            onDragStart={(ev) => {
              ev.dataTransfer.setData("text/dc-entry", e.id);
              ev.dataTransfer.effectAllowed = "move";
            }}
            onKeyDown={(ev) => {
              // Cycle reclassification with arrow keys.
              if (e.isMigratedFrom || !onMove) return;
              if (ev.key === "ArrowRight" || ev.key === "ArrowDown") {
                ev.preventDefault();
                onMove(e.id, NEXT_CHART[type]);
              } else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") {
                ev.preventDefault();
                // Walk the cycle backwards.
                const charts: ChartType[] = [
                  "solution",
                  "concern",
                  "data",
                  "problem_statement",
                ];
                const i = charts.indexOf(type);
                onMove(e.id, charts[(i - 1 + charts.length) % charts.length]);
              } else if (ev.key === "b" && onBookmark) {
                ev.preventDefault();
                onBookmark(e.id);
              }
            }}
            className={cn(
              "chart-entry group relative flex items-start gap-2 outline-none",
              "focus-visible:ring-1 focus-visible:ring-ground-400 focus-visible:rounded",
              e.edgeMarker && "edge-marker",
              e.isMigratedFrom && "chart-entry-grayed",
              e.bookmarked && "border-l-2 border-ground-400 pl-3",
            )}
          >
            <span className="flex-1">{e.contentCondensed}</span>
            {!e.isMigratedFrom && onBookmark && (
              <button
                type="button"
                aria-label={e.bookmarked ? "remove bookmark" : "bookmark"}
                aria-pressed={e.bookmarked}
                onClick={() => onBookmark(e.id)}
                className={cn(
                  "shrink-0 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
                  e.bookmarked && "opacity-100 text-ink",
                )}
              >
                {e.bookmarked ? "•" : "·"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
