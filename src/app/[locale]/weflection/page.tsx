import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { WeFlectionBoard } from "@/components/WeFlectionBoard";
import { getAvatarChoice } from "@/lib/auth/user";

export default async function WeFlectionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const avatar = await getAvatarChoice();
  if (!avatar) redirect(`/${locale}/onboarding`);
  return <WeFlectionBoard locale={locale} />;
}
