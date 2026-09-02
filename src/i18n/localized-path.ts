import type { Locale } from "./config";
import { defaultLocale } from "./config";

/** Locale-prefixed home path */
export function localeHomePath(locale: Locale): string {
  return `/${locale}`;
}

/** Switch locale while preserving non-home paths (home only for now) */
export function switchLocalePath(currentPath: string, targetLocale: Locale): string {
  const stripped = currentPath.replace(/^\/(ko|en)(\/|$)/, "/");
  if (stripped === "/" || stripped === "") {
    return localeHomePath(targetLocale);
  }
  return stripped;
}

export function detectLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(ko|en)(\/|$)/);
  if (match?.[1] === "en") return "en";
  if (match?.[1] === "ko") return "ko";
  return defaultLocale;
}
