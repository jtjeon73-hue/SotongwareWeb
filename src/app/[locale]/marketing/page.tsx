import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { ventureLabels } from "@/i18n/venture-labels";
import { MarketingPageView } from "@/views/venture/VenturePageViews";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = ventureLabels[locale].marketing;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/marketing" });
}

export default async function MarketingPage({ params }: PageProps) {
  const { locale } = await params;
  return <MarketingPageView locale={locale} />;
}
