"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "sending" | "sent" | "error" | "invalid_link";

export function SignInForm({
  locale,
  initialStatus,
}: {
  locale: string;
  initialStatus?: Status;
}) {
  const t = useTranslations("signIn");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>(initialStatus ?? "idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="flex flex-col gap-6 pt-8">
      <header>
        <h1 className="user-words text-2xl text-ink">{t("title")}</h1>
        <p className="mt-2 text-sm text-ink-muted">{t("intro")}</p>
      </header>

      {status === "invalid_link" && (
        <p className="text-[14px] text-signal">{t("status.invalid")}</p>
      )}

      {status === "sent" ? (
        <p className="user-words text-[15px] text-ink">{t("status.sent")}</p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="w-full rounded-md border border-ground-200 bg-white/40 px-4 py-3 text-[15px] text-ink shadow-sm outline-none focus:border-ground-400"
            disabled={status === "sending"}
          />
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending" || !email.trim()}
              className="rounded-md bg-ground-700 px-4 py-2 text-sm text-ground-50 disabled:opacity-40"
            >
              {status === "sending" ? t("sending") : t("sendLink")}
            </button>
            {status === "error" && (
              <span className="text-xs text-signal">{t("status.error")}</span>
            )}
          </div>
        </form>
      )}

      <p className="pt-4 text-xs text-ink-muted">{t("anonymous")}</p>
    </section>
  );
}
