"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { detectLocaleFromPath } from "@/i18n/localized-path";
import { getFullDictionary } from "@/i18n/get-dictionary";
import type { FullDictionary } from "@/i18n/site-types";
import type { HomeDictionary } from "@/i18n/types";

type DictionaryValue = FullDictionary & HomeDictionary;

interface LocaleContextValue {
  locale: Locale;
  dict: DictionaryValue;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  dict: getFullDictionary(defaultLocale),
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = detectLocaleFromPath(pathname ?? "/");

  const value = useMemo(
    () => ({ locale, dict: getFullDictionary(locale) }),
    [locale],
  );

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "ko";
    try {
      localStorage.setItem("sotongware-locale", locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
