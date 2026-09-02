"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { detectLocaleFromPath } from "@/i18n/localized-path";
import { getDictionary } from "@/i18n/get-dictionary";
import type { HomeDictionary } from "@/i18n/types";

interface LocaleContextValue {
  locale: Locale;
  dict: HomeDictionary;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  dict: getDictionary(defaultLocale),
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = detectLocaleFromPath(pathname ?? "/");

  const value = useMemo(
    () => ({ locale, dict: getDictionary(locale) }),
    [locale],
  );

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "ko";
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
