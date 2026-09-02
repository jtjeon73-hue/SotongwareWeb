import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { ventureLabels } from "@/i18n/venture-labels";
import { KnowledgePageView } from "@/views/venture/VenturePageViews";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = ventureLabels[locale].knowledge;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/knowledge" });
}

export default async function KnowledgePage({ params }: PageProps) {
  const { locale } = await params;
  return <KnowledgePageView locale={locale} />;
}
