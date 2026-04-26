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

export function ChartColumn({
  type,
  label,
  entries,
  onMove,
}: {
  type: ChartType;
  label: string;
  entries: ChartEntryView[];
  onMove?: (entryId: string, to: ChartType) => void;
}) {
  return (
    <section className="flex min-h-[12rem] flex-col gap-3">
      <header className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {label}
      </header>
      <ul className="flex flex-col gap-3">
        {entries.map((e) => (
          <li
            key={e.id}
            draggable
            onDragStart={(ev) => {
              ev.dataTransfer.setData("text/dc-entry", e.id);
              ev.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(ev) => {
              ev.preventDefault();
              ev.dataTransfer.dropEffect = "move";
            }}
            className={cn(
              "chart-entry",
              e.edgeMarker && "edge-marker",
              e.isMigratedFrom && "chart-entry-grayed",
              e.bookmarked && "border-l-2 border-ground-400 pl-3",
            )}
          >
            {e.contentCondensed}
          </li>
        ))}
      </ul>
      {/* Drop zone covers the column. The ChartBoard owner wires onMove. */}
      <div
        className="flex-1"
        onDragOver={(ev) => {
          ev.preventDefault();
          ev.dataTransfer.dropEffect = "move";
        }}
        onDrop={(ev) => {
          const id = ev.dataTransfer.getData("text/dc-entry");
          if (id && onMove) onMove(id, type);
        }}
      />
    </section>
  );
}
