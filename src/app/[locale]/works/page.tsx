import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { pageLabels } from "@/i18n/page-labels";
import { WorksPageView } from "@/views/WorksPageView";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = pageLabels[locale].works;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/works" });
}

export default async function WorksPage({ params }: PageProps) {
  const { locale } = await params;
  return <WorksPageView locale={locale} />;
}
