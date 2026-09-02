import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { AboutPageView } from "@/views/AboutPageView";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const { getSiteDictionary } = await import("@/i18n/get-dictionary");
  const p = getSiteDictionary(locale).pages.about;
  return createLocalePageMetadata({ locale, title: p.meta.title, description: p.meta.description, path: "/about" });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  return <AboutPageView locale={locale} />;
}
