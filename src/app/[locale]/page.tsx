import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";
import { createLocaleMetadata } from "@/i18n/metadata";
import { LocalizedHomePage } from "@/components/home/hub/LocalizedHomePage";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createLocaleMetadata(locale);
}

export default async function LocaleHomePage({ params }: PageProps) {
  const { locale } = await params;
  return <LocalizedHomePage locale={locale} />;
}
