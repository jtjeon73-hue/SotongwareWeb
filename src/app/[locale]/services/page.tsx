import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { pageLabels } from "@/i18n/page-labels";
import { ServicesPageView } from "@/views/ServicesPageView";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = pageLabels[locale].services;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/services" });
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  return <ServicesPageView locale={locale} />;
}
