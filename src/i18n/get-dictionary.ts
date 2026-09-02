import type { Locale } from "./config";
import type { HomeDictionary } from "./types";
import type { FullDictionary } from "./site-types";
import { koHome } from "./dictionaries/ko";
import { enHome } from "./dictionaries/en";
import { koSite, koCapabilities } from "./dictionaries/site-ko";
import { enSite, enCapabilities } from "./dictionaries/site-en";

const homeDictionaries: Record<Locale, HomeDictionary> = {
  ko: koHome,
  en: enHome,
};

export function getDictionary(locale: Locale): HomeDictionary {
  return homeDictionaries[locale];
}

export function getSiteDictionary(locale: Locale) {
  return locale === "en" ? enSite : koSite;
}

export function getCapabilitiesDictionary(locale: Locale) {
  return locale === "en" ? enCapabilities : koCapabilities;
}

export function getFullDictionary(locale: Locale): FullDictionary & HomeDictionary {
  return {
    ...homeDictionaries[locale],
    site: getSiteDictionary(locale),
    capabilityPages: getCapabilitiesDictionary(locale),
  };
}

/** Dev/build parity check — throws if ko/en keys differ */
export function assertDictionaryParity(): void {
  const koKeys = JSON.stringify(Object.keys(flattenKeys(koHome)));
  const enKeys = JSON.stringify(Object.keys(flattenKeys(enHome)));
  if (koKeys !== enKeys) {
    throw new Error("Home dictionary key parity mismatch between ko and en");
  }
  const koSiteKeys = JSON.stringify(Object.keys(flattenKeys(koSite)));
  const enSiteKeys = JSON.stringify(Object.keys(flattenKeys(enSite)));
  if (koSiteKeys !== enSiteKeys) {
    throw new Error("Site dictionary key parity mismatch between ko and en");
  }
}

function flattenKeys(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return prefix ? [prefix] : [];
  }
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    flattenKeys(v, prefix ? `${prefix}.${k}` : k),
  );
}
