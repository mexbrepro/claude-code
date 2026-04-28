import Link from "next/link";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getAvatarChoice } from "@/lib/auth/user";

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const avatar = await getAvatarChoice();
  if (!avatar) redirect(`/${locale}/onboarding`);
  return <Landing locale={locale} />;
}

function Landing({ locale }: { locale: string }) {
  const t = useTranslations();
  return (
    <section className="flex flex-col items-start gap-10 pt-12">
      <div>
        <h1 className="user-words text-3xl text-ink">{t("app.name")}</h1>
        <p className="mt-3 text-ink-muted">{t("app.tagline")}</p>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href={`/${locale}/practice`}
          className="text-ink hover:text-signal transition-colors"
        >
          → {t("nav.practice")}
        </Link>
        <Link
          href={`/${locale}/weflection`}
          className="text-ink hover:text-signal transition-colors"
        >
          → {t("nav.weflection")}
        </Link>
        <Link
          href={`/${locale}/library`}
          className="text-ink hover:text-signal transition-colors"
        >
          → {t("nav.library")}
        </Link>
      </div>
    </section>
  );
}
