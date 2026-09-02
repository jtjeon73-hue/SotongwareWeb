import type { Locale } from "./config";
import { locales, localeOg } from "./config";
import { siteConfig } from "@/data/navigation";
import { getDictionary } from "./get-dictionary";

export function createLocaleMetadata(locale: Locale) {
  const dict = getDictionary(locale);
  const path = `/${locale}`;
  const url = new URL(path, siteConfig.url).toString();

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        locales.map((l) => [l, new URL(`/${l}`, siteConfig.url).toString()]),
      ),
    },
    openGraph: {
      type: "website" as const,
      locale: localeOg[locale],
      url,
      siteName: siteConfig.name,
      title: `${dict.meta.title} | ${siteConfig.name}`,
      description: dict.meta.description,
    },
    twitter: {
      card: "summary" as const,
      title: `${dict.meta.title} | ${siteConfig.name}`,
      description: dict.meta.description,
    },
  };
}
