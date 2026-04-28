"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type AvatarId = "liss" | "kena" | "anu" | "wer";
const AVATARS: AvatarId[] = ["liss", "kena", "anu", "wer"];

export function Settings({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const tOnboard = useTranslations("onboarding");
  const router = useRouter();
  const [avatar, setAvatar] = useState<AvatarId | null>(null);
  const [language, setLanguage] = useState<"en" | "de">(locale === "de" ? "de" : "en");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.avatar) setAvatar(d.avatar);
        if (d?.language) setLanguage(d.language);
      })
      .catch(() => {
        /* fall through to defaults */
      });
  }, []);

  async function save() {
    setPending(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ avatar, language }),
      });
      // If language changed, navigate to that locale tree so the UI updates.
      if (language !== locale) {
        router.push(`/${language}/settings`);
        router.refresh();
      } else {
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="flex flex-col gap-8 pt-2">
      <h1 className="user-words text-2xl text-ink">{t("settings")}</h1>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          {tOnboard("languageLabel")}
        </label>
        <div className="flex gap-3">
          {(["en", "de"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                language === l
                  ? "border-ground-500 bg-ground-100"
                  : "border-ground-200 hover:border-ground-300"
              }`}
            >
              {l === "en" ? "English" : "Deutsch"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          {tOnboard("title")}
        </label>
        <ul className="flex flex-col gap-2">
          {AVATARS.map((a) => (
            <li key={a}>
              <button
                onClick={() => setAvatar(a)}
                className={`flex w-full items-baseline justify-between rounded-md border px-4 py-3 text-left transition-colors ${
                  avatar === a
                    ? "border-ground-500 bg-ground-100"
                    : "border-ground-200 hover:border-ground-300"
                }`}
              >
                <span className="user-words text-lg text-ink capitalize">{a}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button
          onClick={save}
          disabled={pending}
          className="rounded-md bg-ground-700 px-4 py-2 text-sm text-ground-50 disabled:opacity-40"
        >
          {tOnboard("continue")}
        </button>
      </div>
    </section>
  );
}
