import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { ebookCatalogSlugs, getEbookBySlug } from "@/data/service-catalog";
import { EbookReaderView } from "@/components/ebook/EbookReaderView";

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => ebookCatalogSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const book = getEbookBySlug(slug);
  if (!book) return { title: locale === "en" ? "Reader" : "리더" };
  return createLocalePageMetadata({
    locale,
    title: `${book.title[locale]} · Reader`,
    description: book.summary[locale],
    path: `/ebooks/${slug}/read`,
  });
}

export default async function EbookReadPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const book = getEbookBySlug(slug);
  if (!book) notFound();
  return <EbookReaderView book={book} locale={locale} />;
}
