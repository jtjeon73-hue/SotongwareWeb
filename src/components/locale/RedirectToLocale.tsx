"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/localized-path";

const LOCALE_STORAGE_KEY = "sotongware-locale";

export function RedirectToLocale({ path }: { path: string }) {
  const router = useRouter();

  useEffect(() => {
    let locale: Locale = defaultLocale;
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored === "en" || stored === "ko") locale = stored;
    } catch {
      /* ignore */
    }
    router.replace(localizePath(path, locale));
  }, [router, path]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-sm text-surface-500">Redirecting…</p>
    </div>
  );
}
