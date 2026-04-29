import { setRequestLocale } from "next-intl/server";
import { SignInForm } from "@/components/SignInForm";

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const { status } = await searchParams;
  setRequestLocale(locale);
  const initial =
    status === "invalid" ? "invalid_link" : status === "unconfigured" ? "error" : undefined;
  return <SignInForm locale={locale} initialStatus={initial} />;
}
