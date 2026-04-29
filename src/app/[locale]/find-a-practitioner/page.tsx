import { setRequestLocale, getTranslations } from "next-intl/server";
import { PRACTITIONERS, type PractitionerEntry } from "@/lib/content/practitioners";

const ORDER: Array<PractitionerEntry["kind"]> = [
  "process_work",
  "dynamic_facilitation",
  "wisdom_council",
  "crisis_line",
];

export default async function FindPractitionerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("practitioners");
  const lang: "en" | "de" = locale === "de" ? "de" : "en";

  // Region preference is locale-driven by default, but every region's
  // entries appear — collapsed under a soft heading. The spec is
  // explicit that the app's role here is to point outward, not to
  // host a directory ourselves; we curate the entry points and let
  // the practitioners' own sites do the rest.
  const preferredRegion = lang === "de" ? "de_at_ch" : "us";

  return (
    <section className="flex flex-col gap-8 pt-2">
      <header>
        <h1 className="user-words text-2xl text-ink">{t("title")}</h1>
        <p className="mt-2 text-sm text-ink-muted">{t("intro")}</p>
      </header>

      {ORDER.map((kind) => {
        const entries = PRACTITIONERS.filter((p) => p.kind === kind);
        if (!entries.length) return null;
        const sorted = [...entries].sort((a, b) => {
          const aP = a.region === "intl" ? 0 : a.region === preferredRegion ? -1 : 1;
          const bP = b.region === "intl" ? 0 : b.region === preferredRegion ? -1 : 1;
          return aP - bP;
        });
        return (
          <section key={kind} className="flex flex-col gap-3">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              {t(`kinds.${kind}`)}
            </h2>
            <ul className="flex flex-col gap-4">
              {sorted.map((p) => (
                <li key={p.id}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="user-words text-[15px] text-ink hover:text-signal"
                  >
                    {p.title[lang]}
                  </a>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {p.body[lang]}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="border-t border-ground-200 pt-6 text-xs text-ink-muted">
        {t("disclaimer")}
      </p>
    </section>
  );
}
