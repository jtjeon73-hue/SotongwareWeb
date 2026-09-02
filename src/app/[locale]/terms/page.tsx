import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { pageLabels } from "@/i18n/page-labels";
import { PrivacyTermsPageView } from "@/views/PrivacyTermsPageView";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = pageLabels[locale].terms;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/terms" });
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  return <PrivacyTermsPageView locale={locale} kind="terms" />;
}
