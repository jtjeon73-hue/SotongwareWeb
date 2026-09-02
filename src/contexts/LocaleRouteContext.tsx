"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/i18n/config";

const LocaleRouteContext = createContext<Locale | null>(null);

export function LocaleRouteProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleRouteContext.Provider value={locale}>{children}</LocaleRouteContext.Provider>;
}

export function useLocaleRoute(): Locale | null {
  return useContext(LocaleRouteContext);
}
