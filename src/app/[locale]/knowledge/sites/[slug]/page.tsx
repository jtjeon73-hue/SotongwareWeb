import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { getKnowledgeSiteBySlug, knowledgeSiteSlugs } from "@/data/service-catalog";
import { KnowledgeSiteView } from "@/components/knowledge/KnowledgeSiteView";

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => knowledgeSiteSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const site = getKnowledgeSiteBySlug(slug);
  if (!site) return { title: locale === "en" ? "Knowledge site" : "지식 사이트" };
  return createLocalePageMetadata({
    locale,
    title: site.name[locale],
    description: site.description[locale],
    path: `/knowledge/sites/${slug}`,
  });
}

export default async function KnowledgeSitePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const site = getKnowledgeSiteBySlug(slug);
  if (!site) notFound();
  return <KnowledgeSiteView site={site} locale={locale} />;
}
