import { setRequestLocale } from "next-intl/server";
import { AvatarPicker } from "@/components/AvatarPicker";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AvatarPicker locale={locale} />;
}
