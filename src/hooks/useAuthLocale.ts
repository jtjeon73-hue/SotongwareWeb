"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { detectLocaleFromPath } from "@/i18n/localized-path";

const LOCALE_STORAGE_KEY = "sotongware-locale";

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "ko") return stored;
  } catch {
    /* ignore */
  }
  return null;
}

/** Locale for non-localized auth routes — path prefix, then stored preference */
export function useAuthLocale(): Locale {
  const pathname = usePathname();
  const fromPath = detectLocaleFromPath(pathname ?? "/");
  const [stored, setStored] = useState<Locale | null>(readStoredLocale);

  useEffect(() => {
    setStored(readStoredLocale());
  }, [pathname]);

  if (fromPath !== defaultLocale || pathname?.match(/^\/(ko|en)(\/|$)/)) {
    return fromPath;
  }
  return stored ?? defaultLocale;
}
