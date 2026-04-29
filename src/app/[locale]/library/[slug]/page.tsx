import { notFound } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getCardBySlug, LEARNING_CARDS } from "@/lib/content/learning-cards";
import { CardReadTracker } from "@/components/CardReadTracker";
import { CardLanded } from "@/components/CardLanded";

export function generateStaticParams() {
  return LEARNING_CARDS.flatMap((card) =>
    ["en", "de"].map((locale) => ({ locale, slug: card.slug })),
  );
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const card = getCardBySlug(slug);
  if (!card) notFound();
  const lang = locale === "de" ? "de" : "en";
  return (
    <article className="flex flex-col gap-6">
      <CardReadTracker cardId={card.id} />
      <Link href={`/${locale}/library`} className="text-xs text-ink-muted hover:text-ink">
        ←
      </Link>
      <header>
        <h1 className="user-words text-2xl text-ink">{card.title[lang]}</h1>
        <p className="mt-2 text-xs uppercase tracking-wide text-ink-muted">
          {card.tags.join(" · ")}
        </p>
      </header>
      <p className="user-words whitespace-pre-line text-[16px] leading-relaxed text-ink">
        {card.body[lang]}
      </p>
      <CardLanded cardId={card.id} />
      {card.related.length > 0 && (
        <footer className="border-t border-ground-200 pt-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Related
          </p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {card.related.map((relSlug) => {
              const related = LEARNING_CARDS.find((c) => c.id === relSlug || c.slug === relSlug);
              if (!related) return null;
              return (
                <li key={related.id}>
                  <Link
                    href={`/${locale}/library/${related.slug}`}
                    className="text-sm text-ink hover:text-signal"
                  >
                    → {related.title[lang]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </footer>
      )}
    </article>
  );
}
