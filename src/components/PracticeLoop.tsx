"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PresenceDot } from "./PresenceDot";
import { cn } from "@/lib/utils";

type QuestionKey = "body" | "dream" | "edge" | "flirt";
const ORDER: QuestionKey[] = ["body", "dream", "edge", "flirt"];

type Mirror = { mirror: string; followup: string | null };
type EntryRecord = {
  question: QuestionKey;
  answer: string;
  mirror: Mirror | null;
};

type PatternSurfacing = {
  message: string;
  patterns: { key: string; phrase: string; recurrence: number }[];
};

export function PracticeLoop({ locale }: { locale: string }) {
  const t = useTranslations("practice");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [history, setHistory] = useState<EntryRecord[]>([]);
  const [done, setDone] = useState(false);
  const [surfacing, setSurfacing] = useState<PatternSurfacing | null>(null);

  const current = ORDER[step];

  async function send() {
    if (!draft.trim() || pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          questionType: current,
          questionText: t(`questions.${current}`),
          answer: draft,
        }),
      });
      const data: Mirror = res.ok
        ? await res.json()
        : { mirror: "", followup: null };
      setHistory((h) => [
        ...h,
        { question: current, answer: draft, mirror: data },
      ]);
      setDraft("");
      advance();
    } finally {
      setPending(false);
    }
  }

  function skip() {
    setHistory((h) => [
      ...h,
      { question: current, answer: "", mirror: null },
    ]);
    setDraft("");
    advance();
  }

  function advance() {
    if (step < ORDER.length - 1) setStep(step + 1);
    else setDone(true);
  }

  // Pattern surfacing (spec §5). Fires once when the practice loop ends.
  // The endpoint enforces the once-only contract — calling it again
  // returns no patterns even if the user reloads.
  useEffect(() => {
    if (!done) return;
    fetch(`/api/practice/patterns?locale=${locale}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: PatternSurfacing | null) => {
        if (data && data.message) setSurfacing(data);
      })
      .catch(() => {
        /* silent — pattern surfacing is never critical */
      });
  }, [done, locale]);

  return (
    <section className="flex flex-col gap-8">
      <header>
        <h1 className="user-words text-2xl text-ink">{t("title")}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t("subtitle")}</p>
      </header>

      {history.map((h, i) => (
        <PracticeHistoryItem key={i} item={h} questionLabel={t(`questions.${h.question}`)} />
      ))}

      {!done && (
        <article className="flex flex-col gap-4">
          <p className="user-words text-lg text-ink">{t(`questions.${current}`)}</p>
          <textarea
            className="w-full resize-none rounded-md border border-ground-200 bg-white/40 p-4 text-[15px] leading-relaxed text-ink shadow-sm outline-none focus:border-ground-400"
            placeholder={t("voicePlaceholder")}
            rows={3}
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
            <button
              onClick={skip}
              disabled={pending}
              className="text-sm text-ink-muted hover:text-ink"
            >
              {t("skip")}
            </button>
            {pending && <PresenceDot active />}
          </div>
        </article>
      )}

      {done && surfacing && <PatternPanel locale={locale} surfacing={surfacing} />}
      {done && <EndOptions locale={locale} history={history} />}
    </section>
  );
}

function PatternPanel({
  locale,
  surfacing,
}: {
  locale: string;
  surfacing: PatternSurfacing;
}) {
  return (
    <article className="mt-2 flex flex-col gap-4 border-l border-signal/40 pl-4 animate-rise">
      <p className="user-words text-[15px] text-ink">{surfacing.message}</p>
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/weflection`}
          className="text-sm text-ink hover:text-signal"
        >
          → {locale === "de" ? "Ja, gemeinsam ansehen" : "Yes, look together"}
        </Link>
        <button
          onClick={() => {
            // Acknowledge declined — no body actions yet, just record telemetry.
            void fetch("/api/practice/patterns", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                patternKeys: surfacing.patterns.map((p) => p.key),
                accepted: false,
              }),
            });
          }}
          className="text-sm text-ink-muted hover:text-ink"
        >
          ·
        </button>
      </div>
    </article>
  );
}

function PracticeHistoryItem({
  item,
  questionLabel,
}: {
  item: EntryRecord;
  questionLabel: string;
}) {
  return (
    <article className="border-l border-ground-200 pl-4 opacity-80">
      <p className="text-xs uppercase tracking-wide text-ink-muted">{questionLabel}</p>
      {item.answer ? (
        <p className={cn("user-words mt-2 text-[15px] text-ink")}>{item.answer}</p>
      ) : (
        <p className="mt-2 text-sm italic text-ink-muted">—</p>
      )}
      {item.mirror?.mirror && (
        <p className="user-words mt-3 text-[14px] text-ink-muted">
          {item.mirror.mirror}
        </p>
      )}
      {item.mirror?.followup && (
        <p className="user-words mt-2 text-[14px] text-ink">
          {item.mirror.followup}
        </p>
      )}
    </article>
  );
}

function EndOptions({
  locale,
  history,
}: {
  locale: string;
  history: EntryRecord[];
}) {
  const t = useTranslations("practice.endChoice");
  const [recommended, setRecommended] = useState<{ slug: string; title: string } | null>(null);

  // Quietly look up a single card recommendation based on what came up.
  // Spec §3.2: cards are pulled, never pushed — so we offer at most one,
  // and the user has to pick it themselves.
  useEffect(() => {
    const text = history
      .filter((h) => h.answer)
      .map((h) => h.answer)
      .join("\n");
    if (!text.trim()) return;
    fetch("/api/cards/recommend", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, locale }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.slug) setRecommended({ slug: d.slug, title: d.title });
      })
      .catch(() => {
        /* silent */
      });
  }, [history, locale]);

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-ground-200 pt-6">
      <p className="text-sm text-ink-muted">·</p>
      <p className="text-ink">{t("end")}</p>
      {recommended ? (
        <Link
          href={`/${locale}/library/${recommended.slug}`}
          className="text-ink hover:text-signal"
        >
          → {recommended.title}
        </Link>
      ) : (
        <Link href={`/${locale}/library`} className="text-ink hover:text-signal">
          → {t("card")}
        </Link>
      )}
      <Link href={`/${locale}/weflection`} className="text-ink hover:text-signal">
        → {t("weflection")}
      </Link>
    </div>
  );
}
