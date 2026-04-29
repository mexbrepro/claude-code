import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-ground-50 text-ink antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 sm:px-6">
            <Header locale={locale} />
            <main className="flex-1 pb-24 pt-6">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

function Header({ locale }: { locale: string }) {
  return (
    <header className="flex items-center justify-between border-b border-ground-200/60 py-5">
      <Link href={`/${locale}`} className="text-sm tracking-wide text-ink-soft">
        Dynamic Companion
      </Link>
      <Nav locale={locale} />
    </header>
  );
}

function Nav({ locale }: { locale: string }) {
  // useTranslations works in client/server components inside the provider tree.
  return (
    <nav className="flex gap-5 text-sm text-ink-muted">
      <NavLink href={`/${locale}/practice`} k="practice" />
      <NavLink href={`/${locale}/weflection`} k="weflection" />
      <NavLink href={`/${locale}/sessions`} k="sessions" />
      <NavLink href={`/${locale}/library`} k="library" />
      <NavLink href={`/${locale}/settings`} k="settings" />
    </nav>
  );
}

function NavLink({
  href,
  k,
}: {
  href: string;
  k: "practice" | "weflection" | "library" | "settings" | "sessions";
}) {
  const t = useTranslations("nav");
  return (
    <Link href={href} className="hover:text-ink transition-colors">
      {t(k)}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="py-6 text-center text-xs text-ink-muted">
      The app waits to be visited.
    </footer>
  );
}
