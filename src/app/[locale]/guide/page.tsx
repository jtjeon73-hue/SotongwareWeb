import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { pageLabels } from "@/i18n/page-labels";
import { GuidePageView } from "@/views/GuidePageView";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = pageLabels[locale].guide;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/guide" });
}

export default async function GuidePage({ params }: PageProps) {
  const { locale } = await params;
  return <GuidePageView locale={locale} />;
}
