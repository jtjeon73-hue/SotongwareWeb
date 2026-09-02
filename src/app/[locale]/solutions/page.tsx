import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { pageLabels } from "@/i18n/page-labels";
import { SolutionsPageView } from "@/views/SolutionsPageView";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = pageLabels[locale].solutions;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/solutions" });
}

export default async function SolutionsPage({ params }: PageProps) {
  const { locale } = await params;
  return <SolutionsPageView locale={locale} />;
}
