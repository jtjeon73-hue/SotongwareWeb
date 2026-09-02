import type { Metadata } from "next";
import type { Locale } from "./config";
import { locales, localeOg } from "./config";
import { siteConfig } from "@/data/navigation";
import { getDictionary } from "./get-dictionary";
import { localizePath } from "./localized-path";

export function createLocaleMetadata(locale: Locale) {
  const dict = getDictionary(locale);
  const path = `/${locale}`;
  const url = new URL(path, siteConfig.url).toString();

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: buildAlternates(locale, ""),
    openGraph: buildOg(locale, url, dict.meta.title, dict.meta.description),
    twitter: buildTwitter(dict.meta.title, dict.meta.description),
  };
}

type LocalePageMeta = {
  locale: Locale;
  title: string;
  description: string;
  path: string;
};

export function createLocalePageMetadata({
  locale,
  title,
  description,
  path,
}: LocalePageMeta): Metadata {
  const localizedPath = localizePath(path, locale);
  const url = new URL(localizedPath, siteConfig.url).toString();
  const socialTitle = `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: buildOg(locale, url, socialTitle, description),
    twitter: buildTwitter(socialTitle, description),
  };
}

function buildAlternates(locale: Locale, path: string) {
  const basePath = path.startsWith("/") ? path : `/${path}`;
  return {
    canonical: new URL(localizePath(basePath, locale), siteConfig.url).toString(),
    languages: Object.fromEntries(
      locales.map((l) => [l, new URL(localizePath(basePath, l), siteConfig.url).toString()]),
    ),
  };
}

function buildOg(locale: Locale, url: string, title: string, description: string) {
  return {
    type: "website" as const,
    locale: localeOg[locale],
    url,
    siteName: siteConfig.name,
    title,
    description,
  };
}

function buildTwitter(title: string, description: string) {
  return {
    card: "summary" as const,
    title,
    description,
  };
}
