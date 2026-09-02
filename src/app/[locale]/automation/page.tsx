import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { ventureLabels } from "@/i18n/venture-labels";
import { AutomationPageView } from "@/views/venture/VenturePageViews";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = ventureLabels[locale].automation;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/automation" });
}

export default async function AutomationPage({ params }: PageProps) {
  const { locale } = await params;
  return <AutomationPageView locale={locale} />;
}
