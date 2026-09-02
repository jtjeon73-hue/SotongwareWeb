"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/localized-path";
import { cn } from "@/lib/utils";

const LOCALE_STORAGE_KEY = "sotongware-locale";

const compactLabels: Record<Locale, string> = {
  ko: "KO",
  en: "EN",
};

export function LocaleSwitcher({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const pathname = usePathname() ?? "/";
  const current = pathname.match(/^\/(ko|en)/)?.[1] as Locale | undefined;

  function handleSwitch(locale: Locale) {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-0.5 rounded-lg border border-surface-200 bg-surface-50 p-0.5",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {locales.map((locale) => {
        const href = switchLocalePath(pathname, locale);
        const isActive = current === locale || (!current && locale === "ko" && pathname === "/");

        return (
          <Link
            key={locale}
            href={href}
            onClick={() => handleSwitch(locale)}
            className={cn(
              "min-h-9 whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-semibold transition-colors",
              compact ? "min-w-[2.25rem] text-center" : "px-2.5",
              isActive
                ? "bg-white text-brand-700 shadow-sm"
                : "text-surface-600 hover:text-surface-900",
            )}
            aria-current={isActive ? "true" : undefined}
            aria-label={locale === "ko" ? "Korean" : "English"}
            lang={locale}
            title={locale === "ko" ? "한국어" : "English"}
          >
            {compact ? compactLabels[locale] : locale === "ko" ? "한국어" : "English"}
          </Link>
        );
      })}
    </div>
  );
}
