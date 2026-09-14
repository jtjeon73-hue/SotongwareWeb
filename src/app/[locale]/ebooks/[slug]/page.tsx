import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { ebookCatalogSlugs, getEbookBySlug } from "@/data/service-catalog";
import { EbookDetailView } from "@/components/ebook/EbookDetailView";

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => ebookCatalogSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const book = getEbookBySlug(slug);
  if (!book) return { title: locale === "en" ? "E-book" : "전자책" };
  return createLocalePageMetadata({
    locale,
    title: book.title[locale],
    description: book.summary[locale],
    path: `/ebooks/${slug}`,
  });
}

export default async function EbookDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const book = getEbookBySlug(slug);
  if (!book) notFound();
  return <EbookDetailView book={book} locale={locale} />;
}
