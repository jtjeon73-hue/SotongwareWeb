import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { ContactPageView } from "@/views/ContactPageView";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const { getSiteDictionary } = await import("@/i18n/get-dictionary");
  const p = getSiteDictionary(locale).pages.contact;
  return createLocalePageMetadata({ locale, title: p.meta.title, description: p.meta.description, path: "/contact" });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  return <ContactPageView locale={locale} />;
}
