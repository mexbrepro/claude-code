import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { asc, eq } from "drizzle-orm";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getAvatarChoice } from "@/lib/auth/user";
import { db, schema } from "@/lib/db/client";
import { cn } from "@/lib/utils";

const COLUMN_ORDER = ["solution", "concern", "data", "problem_statement"] as const;
type ChartType = (typeof COLUMN_ORDER)[number];

// Read-only session detail. Renders the charts as they were left,
// plus the harvest. Same visual language as the live board: charts
// in calm support, edge markers visible, problem-statement
// migrations grayed-and-linked.

export default async function SessionDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const avatar = await getAvatarChoice();
  if (!avatar) redirect(`/${locale}/onboarding`);

  if (!db) notFound();

  const jar = await cookies();
  const anonymousId = jar.get("dc_anon_id")?.value;
  if (!anonymousId) notFound();

  const userRow = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.anonymousId, anonymousId))
    .limit(1);
  if (!userRow.length) notFound();

  const sessions = await db
    .select()
    .from(schema.weFlectionSessions)
    .where(eq(schema.weFlectionSessions.id, id))
    .limit(1);
  if (!sessions.length || sessions[0].userId !== userRow[0].id) notFound();
  const session = sessions[0];

  const [entries, ofCourses, openThreads, bookmarks] = await Promise.all([
    db
      .select()
      .from(schema.chartEntries)
      .where(eq(schema.chartEntries.sessionId, id))
      .orderBy(asc(schema.chartEntries.sequenceInSession)),
    db
      .select()
      .from(schema.ofCourseEntries)
      .where(eq(schema.ofCourseEntries.sessionId, id))
      .orderBy(asc(schema.ofCourseEntries.sequence)),
    db
      .select()
      .from(schema.openThreads)
      .where(eq(schema.openThreads.sessionId, id)),
    db
      .select()
      .from(schema.bookmarks)
      .where(eq(schema.bookmarks.sessionId, id)),
  ]);

  const t = await getTranslations("weflection");
  const tHarvest = await getTranslations("weflection.harvest");
  const tSessions = await getTranslations("sessions");
  const dateFmt = new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const bookmarkedIds = new Set(bookmarks.map((b) => b.chartEntryId));

  function entriesFor(chart: ChartType) {
    const out: Array<{
      id: string;
      content: string;
      edge: boolean;
      bookmarked: boolean;
      isMigratedFrom?: boolean;
    }> = [];
    for (const e of entries) {
      if (e.chartType !== chart) continue;
      if (e.parentEntryId) {
        const parent = entries.find((p) => p.id === e.parentEntryId);
        if (parent && !out.some((o) => o.id === parent.id)) {
          out.push({
            id: parent.id,
            content: parent.contentCondensed,
            edge: parent.edgeMarker,
            bookmarked: bookmarkedIds.has(parent.id),
            isMigratedFrom: true,
          });
        }
      }
      out.push({
        id: e.id,
        content: e.contentCondensed,
        edge: e.edgeMarker,
        bookmarked: bookmarkedIds.has(e.id),
      });
    }
    return out;
  }

  return (
    <section className="flex flex-col gap-6">
      <Link href={`/${locale}/sessions`} className="text-xs text-ink-muted hover:text-ink">
        ←
      </Link>
      <header>
        <p className="text-xs uppercase tracking-wide text-ink-muted">
          {dateFmt.format(new Date(session.startedAt))}
          {session.status === "active" && (
            <span className="ml-2 text-signal">{tSessions("statusActive")}</span>
          )}
        </p>
        <h1 className="user-words mt-2 text-2xl text-ink">{session.openingQuestion}</h1>
        {session.continuedFromSessionId && (
          <Link
            href={`/${locale}/sessions/${session.continuedFromSessionId}`}
            className="mt-2 inline-block text-xs text-ink-muted hover:text-ink"
          >
            ← {tSessions("continuedFrom")}
          </Link>
        )}
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {COLUMN_ORDER.map((c) => (
          <section key={c} className="flex flex-col gap-3">
            <header className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              {t(`charts.${c}`)}
            </header>
            <ul className="flex flex-col gap-3">
              {entriesFor(c).map((e) => (
                <li
                  key={e.id}
                  className={cn(
                    "chart-entry",
                    e.edge && "edge-marker",
                    e.isMigratedFrom && "chart-entry-grayed",
                    e.bookmarked && "border-l-2 border-ground-400 pl-3",
                  )}
                >
                  {e.content}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {ofCourses.length > 0 && (
        <section className="border-t border-ground-200 pt-6">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            {tHarvest("ofCourses")}
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {ofCourses.map((c) => (
              <li key={c.id} className="user-words text-[15px] text-ink">
                {c.contentUserWords}
              </li>
            ))}
          </ul>
        </section>
      )}

      {openThreads.length > 0 && (
        <section className="border-t border-ground-200 pt-6">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            {tHarvest("openThreads")}
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {openThreads.map((c) => (
              <li
                key={c.id}
                className={cn(
                  "user-words text-[15px]",
                  c.status === "resolved" ? "text-ink-muted line-through decoration-ground-300" : "text-ink",
                )}
              >
                {c.contentUserWords}
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
