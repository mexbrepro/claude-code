import { Reveal } from "./Reveal";

const TOOL_INFO: Record<
  string,
  { name: string; url: string; how: string }
> = {
  timeline: {
    name: "TimelineJS",
    url: "timeline.knightlab.com",
    how: "Zeitleiste aus einem Google Sheet bauen → „Share“ → iframe-URL aus src=\"…\" kopieren.",
  },
  juxtapose: {
    name: "Juxtapose",
    url: "juxtapose.knightlab.com",
    how: "Zwei Bilder (vorher/nachher) hochladen → Embed-URL kopieren.",
  },
  storymap: {
    name: "StoryMapJS",
    url: "storymap.knightlab.com",
    how: "Karte oder Gigapixel-Bild bauen → „Share“ → iframe-URL kopieren.",
  },
  other: {
    name: "Einbettung",
    url: "",
    how: "Beliebige Embed-URL (z. B. euer eigenes Tool) hier eintragen.",
  },
};

/**
 * EmbedFrame — responsiver Rahmen für Knight-Lab-Tools (oder jedes iframe).
 * Solange keine URL eingetragen ist, erscheint eine freundliche Anleitung
 * statt eines leeren Kastens.
 */
export function EmbedFrame({
  tool,
  src,
  title,
  heightVh = 72,
  note,
}: {
  tool: "timeline" | "juxtapose" | "storymap" | "other";
  src: string;
  title: string;
  heightVh?: number;
  note?: string;
}) {
  const info = TOOL_INFO[tool];

  return (
    <Reveal className="mx-auto w-full max-w-5xl px-4">
      <figure>
        <div
          className="overflow-hidden rounded-2xl border shadow-2xl shadow-black/40"
          style={{
            height: `${heightVh}vh`,
            borderColor: "var(--border)",
            background: "var(--surface)",
          }}
        >
          {src ? (
            <iframe
              src={src}
              title={title}
              className="h-full w-full"
              frameBorder={0}
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <span
                className="rounded-full border px-3 py-1 text-xs uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-cabin)",
                  borderColor: "var(--accent-soft)",
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                {info.name} · noch einzubetten
              </span>
              <p className="max-w-md text-sm" style={{ color: "var(--fg-muted)" }}>
                {info.how}
              </p>
              {info.url && (
                <p className="text-xs" style={{ color: "var(--fg-faint)" }}>
                  Werkzeug: <span style={{ color: "var(--fg-muted)" }}>{info.url}</span>
                </p>
              )}
              <p className="max-w-md text-xs" style={{ color: "var(--fg-faint)" }}>
                Dann in <code style={{ color: "var(--fg-muted)" }}>story.config.ts</code> die
                Zeile <code style={{ color: "var(--fg-muted)" }}>src: &quot;&quot;</code> mit
                der Embed-URL füllen.
              </p>
            </div>
          )}
        </div>
        <figcaption
          className="mx-auto mt-3 max-w-2xl text-center text-xs"
          style={{ color: "var(--fg-faint)" }}
        >
          {title}
          {note ? ` — ${note}` : ""}
        </figcaption>
      </figure>
    </Reveal>
  );
}
