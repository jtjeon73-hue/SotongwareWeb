import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { contentCatalogSlugs, getContentBySlug } from "@/data/service-catalog";
import { ContentDetailView } from "@/components/content/ContentDetailView";

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => contentCatalogSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const item = getContentBySlug(slug);
  if (!item) return { title: locale === "en" ? "Content" : "콘텐츠" };
  return createLocalePageMetadata({
    locale,
    title: item.title[locale],
    description: item.summary[locale],
    path: `/contents/${slug}`,
  });
}

export default async function ContentDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const item = getContentBySlug(slug);
  if (!item) notFound();
  return <ContentDetailView item={item} locale={locale} />;
}
