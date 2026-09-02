import type { Locale } from "@/i18n/config";
import { isCapabilitySlug, CAPABILITY_SLUGS } from "@/i18n/capabilities-config";
import { getCapabilitiesDictionary } from "@/i18n/get-dictionary";
import { CapabilityPageView } from "@/components/capabilities/CapabilityPageView";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return CAPABILITY_SLUGS.flatMap((slug) => [
    { locale: "ko", slug },
    { locale: "en", slug },
  ]);
}

type PageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isCapabilitySlug(slug)) return {};
  const content = getCapabilitiesDictionary(locale)[slug];
  return createLocalePageMetadata({
    locale,
    title: content.meta.title,
    description: content.meta.description,
    path: `/capabilities/${slug}`,
  });
}

export default async function CapabilityPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isCapabilitySlug(slug)) notFound();
  const content = getCapabilitiesDictionary(locale)[slug];
  return <CapabilityPageView locale={locale} slug={slug} content={content} />;
}
