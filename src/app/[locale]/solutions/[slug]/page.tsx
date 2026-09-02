import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { solutionItems } from "@/i18n/page-labels";
import { LocalizedDetailPageView } from "@/views/LocalizedDetailPageView";

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => solutionItems[locale].map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const sol = solutionItems[locale].find((s) => s.slug === slug);
  if (!sol) return { title: "Solutions" };
  return createLocalePageMetadata({ locale, title: sol.title, description: sol.description, path: `/solutions/${slug}` });
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const sol = solutionItems[locale].find((s) => s.slug === slug);
  if (!sol) notFound();

  return (
    <LocalizedDetailPageView locale={locale} title={sol.title} description={sol.description} backPath="/solutions" />
  );
}
