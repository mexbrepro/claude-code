"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// "After they read, you ask one open question: 'What landed?' or
// 'What stayed with you?' Then you wait." — spec §12 LEARNING_CARD mode.
//
// One quiet open input. The user can save what came up so they can
// revisit it later, or move on with no pressure.
export function CardLanded({ cardId }: { cardId: string }) {
  const t = useTranslations("library");
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function save() {
    if (!draft.trim() || pending) return;
    setPending(true);
    try {
      await fetch("/api/cards/landed", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cardId, reflection: draft }),
      });
      setSaved(true);
    } finally {
      setPending(false);
    }
  }

  if (saved) {
    return (
      <section className="border-t border-ground-200 pt-6">
        <p className="user-words text-[15px] text-ink-muted">{t("saved")}</p>
      </section>
    );
  }

  return (
    <section className="border-t border-ground-200 pt-6">
      <p className="user-words text-lg text-ink">{t("whatLanded")}</p>
      <textarea
        className="mt-3 w-full resize-none rounded-md border border-ground-200 bg-white/40 p-4 text-[15px] leading-relaxed text-ink shadow-sm outline-none focus:border-ground-400"
        rows={3}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        disabled={pending}
      />
      <div className="mt-3 flex items-center gap-4">
        <button
          onClick={save}
          disabled={pending || !draft.trim()}
          className="rounded-md bg-ground-700 px-4 py-2 text-sm text-ground-50 disabled:opacity-40"
        >
          {t("save")}
        </button>
        <button
          onClick={() => setSaved(true)}
          className="text-sm text-ink-muted hover:text-ink"
          disabled={pending}
        >
          {t("skip")}
        </button>
      </div>
    </section>
  );
}
