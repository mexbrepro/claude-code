"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type AvatarId = "liss" | "kena" | "anu" | "wer";
const AVATARS: AvatarId[] = ["liss", "kena", "anu", "wer"];

export function Settings({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const tOnboard = useTranslations("onboarding");
  const tSettings = useTranslations("settings");
  const router = useRouter();
  const [avatar, setAvatar] = useState<AvatarId | null>(null);
  const [language, setLanguage] = useState<"en" | "de">(locale === "de" ? "de" : "en");
  const [email, setEmail] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.avatar) setAvatar(d.avatar);
        if (d?.language) setLanguage(d.language);
        if (typeof d?.email === "string") setEmail(d.email);
        if (typeof d?.autoSpeak === "boolean") setAutoSpeak(d.autoSpeak);
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
        body: JSON.stringify({ avatar, language, autoSpeak }),
      });
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

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push(`/${locale}/sign-in`);
    router.refresh();
  }

  return (
    <section className="flex flex-col gap-8 pt-2">
      <h1 className="user-words text-2xl text-ink">{t("settings")}</h1>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          {tSettings("email")}
        </label>
        {email ? (
          <div className="flex items-baseline gap-3">
            <p className="user-words text-[15px] text-ink">{email}</p>
            <button
              onClick={signOut}
              className="text-xs text-ink-muted hover:text-ink"
            >
              {tSettings("signOut")}
            </button>
          </div>
        ) : (
          <div className="flex items-baseline gap-3">
            <p className="user-words text-[15px] text-ink-muted">
              {tSettings("emailNone")}
            </p>
            <a
              href={`/${locale}/sign-in`}
              className="text-xs text-ink hover:text-signal"
            >
              {t("signIn")} →
            </a>
          </div>
        )}
      </div>

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

      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          checked={autoSpeak}
          onChange={(e) => setAutoSpeak(e.target.checked)}
          className="h-4 w-4 accent-ground-700"
        />
        {tSettings("autoSpeak")}
      </label>

      <div>
        <button
          onClick={save}
          disabled={pending}
          className="rounded-md bg-ground-700 px-4 py-2 text-sm text-ground-50 disabled:opacity-40"
        >
          {tSettings("save")}
        </button>
      </div>
    </section>
  );
}
