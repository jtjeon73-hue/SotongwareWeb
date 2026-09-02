"use client";

import { useLocale } from "@/contexts/LocaleProvider";
import { localizePath } from "@/i18n/localized-path";

export function useLocalePath() {
  const { locale } = useLocale();
  return (path: string) => localizePath(path, locale);
}
