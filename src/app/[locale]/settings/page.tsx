import { setRequestLocale } from "next-intl/server";
import { Settings } from "@/components/Settings";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Settings locale={locale} />;
}
