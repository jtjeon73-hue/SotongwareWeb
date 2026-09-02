"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { localeLabels } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/localized-path";
import { cn } from "@/lib/utils";

const LOCALE_STORAGE_KEY = "sotongware-locale";

export function LocaleSwitcher({ className }: { className?: string }) {
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
      className={cn("flex items-center gap-0.5 rounded-lg border border-surface-200 bg-surface-50 p-0.5", className)}
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
              "min-h-9 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors",
              isActive
                ? "bg-white text-brand-700 shadow-sm"
                : "text-surface-600 hover:text-surface-900",
            )}
            aria-current={isActive ? "true" : undefined}
            lang={locale}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
