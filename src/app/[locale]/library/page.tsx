import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LEARNING_CARDS } from "@/lib/content/learning-cards";

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("library");
  const lang = locale === "de" ? "de" : "en";

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="user-words text-2xl text-ink">{t("title")}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t("intro")}</p>
      </header>
      <ul className="flex flex-col gap-4">
        {LEARNING_CARDS.map((card) => (
          <li key={card.id}>
            <Link
              href={`/${locale}/library/${card.slug}`}
              className="user-words text-[16px] text-ink hover:text-signal"
            >
              {card.title[lang]}
            </Link>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink-muted">
              {card.tags.join(" · ")}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
