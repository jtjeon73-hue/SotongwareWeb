import type { Locale } from "./config";
import type { HomeDictionary } from "./types";
import { koHome } from "./dictionaries/ko";
import { enHome } from "./dictionaries/en";

const dictionaries: Record<Locale, HomeDictionary> = {
  ko: koHome,
  en: enHome,
};

export function getDictionary(locale: Locale): HomeDictionary {
  return dictionaries[locale];
}
