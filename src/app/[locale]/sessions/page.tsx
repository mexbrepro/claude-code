import { redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { desc, eq } from "drizzle-orm";
import { getAvatarChoice } from "@/lib/auth/user";
import { db, schema } from "@/lib/db/client";
import { cookies } from "next/headers";

// Past sessions archive (spec §10). "Sessions accumulate as a quiet
// archive of the user's inner movement." The list is intentionally
// minimal — date, opening question, a one-line summary. The charts
// themselves live on the detail page.

export default async function SessionsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const avatar = await getAvatarChoice();
  if (!avatar) redirect(`/${locale}/onboarding`);

  const t = await getTranslations("sessions");

  if (!db) {
    return (
      <Empty title={t("title")} message={t("noDatabase")} locale={locale} />
    );
  }

  const jar = await cookies();
  const anonymousId = jar.get("dc_anon_id")?.value;
  if (!anonymousId) {
    return <Empty title={t("title")} message={t("empty")} locale={locale} />;
  }

  const userRow = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.anonymousId, anonymousId))
    .limit(1);
  if (!userRow.length) {
    return <Empty title={t("title")} message={t("empty")} locale={locale} />;
  }
  const userId = userRow[0].id;

  // Pull every session and a small summary count per session.
  const sessions = await db
    .select()
    .from(schema.weFlectionSessions)
    .where(eq(schema.weFlectionSessions.userId, userId))
    .orderBy(desc(schema.weFlectionSessions.startedAt));

  if (!sessions.length) {
    return <Empty title={t("title")} message={t("empty")} locale={locale} />;
  }

  const dateFmt = new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="user-words text-2xl text-ink">{t("title")}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t("intro")}</p>
      </header>
      <ul className="flex flex-col gap-5">
        {sessions.map((s) => (
          <li key={s.id}>
            <Link
              href={`/${locale}/sessions/${s.id}`}
              className="group block border-l border-ground-200 pl-4 transition-colors hover:border-ground-400"
            >
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                {dateFmt.format(new Date(s.startedAt))}
                {s.status === "active" && (
                  <span className="ml-2 text-signal">{t("statusActive")}</span>
                )}
              </p>
              <p className="user-words mt-1 text-[15px] text-ink group-hover:text-signal">
                {s.openingQuestion}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Empty({
  title,
  message,
  locale,
}: {
  title: string;
  message: string;
  locale: string;
}) {
  return (
    <section className="flex flex-col gap-4 pt-2">
      <h1 className="user-words text-2xl text-ink">{title}</h1>
      <p className="text-sm text-ink-muted">{message}</p>
      <Link href={`/${locale}/weflection`} className="text-ink hover:text-signal">
        →
      </Link>
    </section>
  );
}
