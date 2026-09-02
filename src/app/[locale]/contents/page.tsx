import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { ventureLabels } from "@/i18n/venture-labels";
import { ContentsPageView } from "@/views/venture/VenturePageViews";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = ventureLabels[locale].contents;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/contents" });
}

export default async function ContentsPage({ params }: PageProps) {
  const { locale } = await params;
  return <ContentsPageView locale={locale} />;
}
