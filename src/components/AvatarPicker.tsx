"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const AVATARS: { id: "liss" | "kena" | "anu" | "wer"; voice: "masc" | "fem"; note: { en: string; de: string } }[] = [
  {
    id: "liss",
    voice: "fem",
    note: {
      en: "Old English: to listen.",
      de: "Altenglisch: hören.",
    },
  },
  {
    id: "kena",
    voice: "fem",
    note: {
      en: "A quiet name, gender-soft.",
      de: "Ein leiser Name, geschlechtsoffen.",
    },
  },
  {
    id: "anu",
    voice: "masc",
    note: {
      en: "Short, calm.",
      de: "Kurz, ruhig.",
    },
  },
  {
    id: "wer",
    voice: "masc",
    note: {
      en: "German: who. The question stays open.",
      de: "Deutsch: wer. Die Frage bleibt offen.",
    },
  },
];

export function AvatarPicker({ locale }: { locale: string }) {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [picked, setPicked] = useState<string | null>(null);
  const lang = locale === "de" ? "de" : "en";

  function commit() {
    if (!picked) return;
    document.cookie = `dc_avatar=${picked}; path=/; max-age=31536000; samesite=lax`;
    document.cookie = `dc_locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    router.push(`/${locale}/practice`);
  }

  return (
    <section className="flex flex-col gap-8 pt-8">
      <header>
        <h1 className="user-words text-2xl text-ink">{t("title")}</h1>
        <p className="mt-2 text-sm text-ink-muted">{t("intro")}</p>
      </header>

      <ul className="flex flex-col gap-3">
        {AVATARS.map((a) => (
          <li key={a.id}>
            <button
              onClick={() => setPicked(a.id)}
              className={`flex w-full items-baseline justify-between rounded-md border px-4 py-3 text-left transition-colors ${
                picked === a.id
                  ? "border-ground-500 bg-ground-100"
                  : "border-ground-200 hover:border-ground-300"
              }`}
            >
              <span className="user-words text-lg text-ink capitalize">{a.id}</span>
              <span className="text-xs text-ink-muted">{a.note[lang]}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <button
          onClick={commit}
          disabled={!picked}
          className="rounded-md bg-ground-700 px-4 py-2 text-sm text-ground-50 disabled:opacity-40"
        >
          {t("continue")}
        </button>
      </div>
    </section>
  );
}
