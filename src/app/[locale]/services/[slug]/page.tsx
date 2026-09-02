import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { serviceLabels } from "@/i18n/page-labels";
import { services } from "@/data/services";
import { LocalizedDetailPageView } from "@/views/LocalizedDetailPageView";

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service" };
  const en = serviceLabels.en[slug];
  const title = locale === "en" && en ? en.title : service.title;
  const description = locale === "en" && en ? en.description : service.description;
  return createLocalePageMetadata({ locale, title, description, path: `/services/${slug}` });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  const en = serviceLabels.en[slug];
  const title = locale === "en" && en ? en.title : service.title;
  const description = locale === "en" && en ? en.description : service.description;

  return (
    <LocalizedDetailPageView locale={locale} title={title} description={description} backPath="/services" />
  );
}
