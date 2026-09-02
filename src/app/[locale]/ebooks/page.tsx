import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { ventureLabels } from "@/i18n/venture-labels";
import { EbooksPageView } from "@/views/venture/VenturePageViews";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = ventureLabels[locale].ebooks;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/ebooks" });
}

export default async function EbooksPage({ params }: PageProps) {
  const { locale } = await params;
  return <EbooksPageView locale={locale} />;
}
