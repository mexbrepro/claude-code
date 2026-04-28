import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PracticeLoop } from "@/components/PracticeLoop";
import { getAvatarChoice } from "@/lib/auth/user";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const avatar = await getAvatarChoice();
  if (!avatar) redirect(`/${locale}/onboarding`);
  return <PracticeLoop locale={locale} />;
}
