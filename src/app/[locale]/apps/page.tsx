import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { ventureLabels } from "@/i18n/venture-labels";
import { AppsPageView } from "@/views/venture/VenturePageViews";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = ventureLabels[locale].apps;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/apps" });
}

export default async function AppsPage({ params }: PageProps) {
  const { locale } = await params;
  return <AppsPageView locale={locale} />;
}
