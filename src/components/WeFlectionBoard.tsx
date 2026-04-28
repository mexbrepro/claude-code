"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ChartColumn, type ChartEntryView, type ChartType } from "./ChartColumn";
import { PresenceDot } from "./PresenceDot";

type ClassifiedTurn = {
  chart: ChartType;
  rationale_internal: string;
  user_words_condensed: string;
  edge_marker: boolean;
  verbal_response: string;
  is_problem_statement_migration: boolean;
  parent_entry_id: string | null;
};

type TurnRecord = {
  entryId: string;
  raw: string;
  classified: ClassifiedTurn;
  bookmarked?: boolean;
};

type Phase = "carry_over" | "active" | "harvesting_of_courses" | "harvesting_open_threads" | "ended";

type CarryOver = {
  priorSessionId: string | null;
  openThreads: { id: string; content: string }[];
  bookmarks: { id: string; note: string | null; content: string; chart: ChartType }[];
};

const COLUMN_ORDER: ChartType[] = ["solution", "concern", "data", "problem_statement"];

export function WeFlectionBoard({ locale }: { locale: string }) {
  const t = useTranslations("weflection");
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [opener, setOpener] = useState<string | null>(null);
  const [turns, setTurns] = useState<TurnRecord[]>([]);
  const [phase, setPhase] = useState<Phase>("carry_over");
  const [ofCourses, setOfCourses] = useState<string[]>([]);
  const [openThreads, setOpenThreads] = useState<string[]>([]);
  const [verbalResponse, setVerbalResponse] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [continuedFrom, setContinuedFrom] = useState<string | null>(null);
  const [carryOver, setCarryOver] = useState<CarryOver | null>(null);
  const [safety, setSafety] = useState<{
    bridgeMessage: string;
    links: { label: string; url: string }[];
  } | null>(null);

  useEffect(() => {
    fetch(`/api/weflection/open?locale=${locale}`)
      .then((r) => r.json())
      .then((d) => setOpener(d.opener));
    fetch(`/api/weflection/carry-over`)
      .then((r) => r.json())
      .then((d: CarryOver) => {
        if (d.openThreads.length || d.bookmarks.length) {
          setCarryOver(d);
        } else {
          setPhase("active");
        }
      })
      .catch(() => setPhase("active"));
  }, [locale]);

  function entriesFor(chart: ChartType): ChartEntryView[] {
    const list: ChartEntryView[] = [];
    for (const t of turns) {
      const c = t.classified;
      if (c.chart !== chart) continue;
      if (c.is_problem_statement_migration && c.parent_entry_id) {
        const parent = turns.find((p) => p.entryId === c.parent_entry_id);
        if (parent && !list.some((e) => e.id === parent.entryId)) {
          list.push({
            id: parent.entryId,
            contentCondensed: parent.classified.user_words_condensed,
            edgeMarker: parent.classified.edge_marker,
            isMigratedFrom: true,
          });
        }
      }
      list.push({
        id: t.entryId,
        contentCondensed: c.user_words_condensed,
        edgeMarker: c.edge_marker,
        bookmarked: t.bookmarked,
      });
    }
    return list;
  }

  async function send() {
    if (!draft.trim() || pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/weflection/turn", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          contribution: draft,
          prior: turns.map((t) => ({
            raw: t.raw,
            classified: t.classified,
            entryId: t.entryId,
          })),
          sessionId,
          continuedFromSessionId: continuedFrom,
        }),
      });
      const data = await res.json();
      if (data.safety) {
        setSafety(data.safety.resources);
        setPending(false);
        return;
      }
      const classified: ClassifiedTurn = data.classified;
      const entryId =
        data.entryId ??
        (typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`);
      setSessionId((s) => s ?? data.sessionId ?? null);
      setTurns((prev) => [...prev, { entryId, raw: draft, classified }]);
      setVerbalResponse(classified.verbal_response || null);
      setDraft("");
    } finally {
      setPending(false);
    }
  }

  async function moveEntry(entryId: string, to: ChartType) {
    setTurns((prev) =>
      prev.map((t) =>
        t.entryId === entryId
          ? { ...t, classified: { ...t.classified, chart: to } }
          : t,
      ),
    );
    if (sessionId) {
      // Best-effort: persist the override silently. The avatar never comments.
      void fetch("/api/weflection/turn", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entryId, to }),
      });
    }
  }

  async function bookmark(entryId: string) {
    setTurns((prev) =>
      prev.map((t) =>
        t.entryId === entryId ? { ...t, bookmarked: !t.bookmarked } : t,
      ),
    );
    if (sessionId) {
      void fetch("/api/weflection/bookmark", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, chartEntryId: entryId }),
      });
    }
  }

  async function startHarvest() {
    setPhase("harvesting_of_courses");
  }

  function captureHarvest(text: string) {
    if (phase === "harvesting_of_courses") {
      setOfCourses((p) => [...p, text]);
    } else if (phase === "harvesting_open_threads") {
      setOpenThreads((p) => [...p, text]);
    }
    setDraft("");
  }

  async function nextHarvestPhase() {
    if (phase === "harvesting_of_courses") {
      setPhase("harvesting_open_threads");
    } else if (phase === "harvesting_open_threads") {
      setPhase("ended");
      if (sessionId) {
        await fetch("/api/weflection/end", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId, ofCourses, openThreads }),
        });
      }
    }
  }

  if (safety) {
    return <SafetyPanel resources={safety} />;
  }

  if (phase === "carry_over" && carryOver) {
    return (
      <CarryOverPanel
        data={carryOver}
        onStartFresh={() => {
          setCarryOver(null);
          setPhase("active");
        }}
        onContinueHere={() => {
          setContinuedFrom(carryOver.priorSessionId);
          setCarryOver(null);
          setPhase("active");
        }}
      />
    );
  }

  if (phase === "carry_over") {
    return (
      <section className="flex justify-center pt-12">
        <PresenceDot active />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="user-words text-2xl text-ink">{t("title")}</h1>
        {opener && phase === "active" && (
          <p className="user-words mt-3 text-lg text-ink">{opener}</p>
        )}
      </header>

      {phase === "active" && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {COLUMN_ORDER.map((c) => (
              <ChartColumn
                key={c}
                type={c}
                label={t(`charts.${c}`)}
                entries={entriesFor(c)}
                onMove={moveEntry}
                onBookmark={bookmark}
              />
            ))}
          </div>

          {verbalResponse && (
            <p className="user-words text-[15px] text-ink-muted">{verbalResponse}</p>
          )}

          <div className="flex flex-col gap-3 border-t border-ground-200 pt-4">
            <textarea
              className="w-full resize-none rounded-md border border-ground-200 bg-white/40 p-4 text-[15px] leading-relaxed text-ink shadow-sm outline-none focus:border-ground-400"
              rows={3}
              placeholder=" "
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={pending}
            />
            <div className="flex items-center gap-4">
              <button
                onClick={send}
                disabled={pending || !draft.trim()}
                className="rounded-md bg-ground-700 px-4 py-2 text-sm text-ground-50 disabled:opacity-40"
              >
                {t("send")}
              </button>
              {turns.length > 0 && (
                <button
                  onClick={startHarvest}
                  disabled={pending}
                  className="text-sm text-ink-muted hover:text-ink"
                >
                  {t("endSession")}
                </button>
              )}
              {pending && <PresenceDot active />}
            </div>
          </div>
        </>
      )}

      {(phase === "harvesting_of_courses" ||
        phase === "harvesting_open_threads" ||
        phase === "ended") && (
        <Harvest
          phase={phase}
          ofCourses={ofCourses}
          openThreads={openThreads}
          onCapture={captureHarvest}
          onNext={nextHarvestPhase}
          draft={draft}
          setDraft={setDraft}
        />
      )}
    </section>
  );
}

function CarryOverPanel({
  data,
  onStartFresh,
  onContinueHere,
}: {
  data: CarryOver;
  onStartFresh: () => void;
  onContinueHere: () => void;
}) {
  const t = useTranslations("weflection.carryOver");
  return (
    <section className="flex flex-col gap-6 pt-6">
      <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {t("heading")}
      </h2>
      <ul className="flex flex-col gap-3">
        {data.openThreads.map((o) => (
          <li key={o.id} className="user-words text-[15px] text-ink">
            — {o.content}
          </li>
        ))}
        {data.bookmarks.map((b) => (
          <li
            key={b.id}
            className="user-words border-l border-ground-300 pl-3 text-[15px] text-ink"
          >
            — {b.content}
            {b.note && (
              <span className="ml-2 text-xs text-ink-muted">({b.note})</span>
            )}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={onContinueHere}
          className="rounded-md bg-ground-700 px-4 py-2 text-sm text-ground-50"
        >
          {t("continueHere")}
        </button>
        <button onClick={onStartFresh} className="text-sm text-ink-muted hover:text-ink">
          {t("startFresh")}
        </button>
      </div>
    </section>
  );
}

function Harvest({
  phase,
  ofCourses,
  openThreads,
  onCapture,
  onNext,
  draft,
  setDraft,
}: {
  phase: Phase;
  ofCourses: string[];
  openThreads: string[];
  onCapture: (text: string) => void;
  onNext: () => void;
  draft: string;
  setDraft: (v: string) => void;
}) {
  const tHarvest = useTranslations("weflection.harvest");
  const tFlection = useTranslations("weflection");
  return (
    <section className="flex flex-col gap-6 border-t border-ground-200 pt-6">
      {ofCourses.length > 0 && (
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            {tHarvest("ofCourses")}
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {ofCourses.map((c, i) => (
              <li key={i} className="user-words text-[15px] text-ink">
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
      {openThreads.length > 0 && (
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            {tHarvest("openThreads")}
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {openThreads.map((c, i) => (
              <li key={i} className="user-words text-[15px] text-ink">
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase !== "ended" && (
        <div className="mt-4 flex flex-col gap-3">
          <p className="user-words text-lg text-ink">
            {phase === "harvesting_of_courses"
              ? tFlection("harvest.ofCourses")
              : tFlection("harvest.openThreads")}
          </p>
          <textarea
            className="w-full resize-none rounded-md border border-ground-200 bg-white/40 p-4 text-[15px]"
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="flex items-center gap-4">
            <button
              onClick={() => draft.trim() && onCapture(draft)}
              disabled={!draft.trim()}
              className="rounded-md bg-ground-700 px-4 py-2 text-sm text-ground-50 disabled:opacity-40"
            >
              {tFlection("send")}
            </button>
            <button
              onClick={onNext}
              className="text-sm text-ink-muted hover:text-ink"
            >
              ·
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function SafetyPanel({
  resources,
}: {
  resources: { bridgeMessage: string; links: { label: string; url: string }[] };
}) {
  const t = useTranslations("safety");
  return (
    <section className="flex flex-col gap-5">
      <h1 className="user-words text-2xl text-ink">{t("heading")}</h1>
      <p className="user-words text-[15px] text-ink">{resources.bridgeMessage}</p>
      <div>
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          {t("linksHeading")}
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {resources.links.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="text-ink hover:text-signal"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
