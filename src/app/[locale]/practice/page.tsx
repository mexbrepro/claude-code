import { setRequestLocale } from "next-intl/server";
import { PracticeLoop } from "@/components/PracticeLoop";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PracticeLoop locale={locale} />;
}
