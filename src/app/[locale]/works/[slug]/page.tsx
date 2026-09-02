import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { workCategories } from "@/i18n/page-labels";
import { LocalizedDetailPageView } from "@/views/LocalizedDetailPageView";

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => workCategories[locale].map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const cat = workCategories[locale].find((c) => c.slug === slug);
  if (!cat) return { title: "Works" };
  return createLocalePageMetadata({ locale, title: cat.title, description: cat.description, path: `/works/${slug}` });
}

export default async function WorksCategoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const cat = workCategories[locale].find((c) => c.slug === slug);
  if (!cat) notFound();

  return (
    <LocalizedDetailPageView locale={locale} title={cat.title} description={cat.description} backPath="/works" />
  );
}
