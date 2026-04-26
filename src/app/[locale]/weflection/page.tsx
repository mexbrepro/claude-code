import { setRequestLocale } from "next-intl/server";
import { WeFlectionBoard } from "@/components/WeFlectionBoard";

export default async function WeFlectionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WeFlectionBoard locale={locale} />;
}
