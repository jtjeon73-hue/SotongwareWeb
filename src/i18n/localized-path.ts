import type { Locale } from "./config";
import { defaultLocale, locales } from "./config";

const AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/account", "/dashboard"];

export function localeHomePath(locale: Locale): string {
  return `/${locale}`;
}

/** Prefix internal path with locale (auth paths unchanged) */
export function localizePath(path: string, locale: Locale = defaultLocale): string {
  if (!path || path.startsWith("#") || path.startsWith("http") || path.startsWith("mailto:")) {
    return path;
  }
  const [pathname, query] = path.split("?");
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (AUTH_PATHS.some((p) => normalized === p || normalized.startsWith(`${p}/`))) {
    return query ? `${normalized}?${query}` : normalized;
  }
  const stripped = normalized.replace(/^\/(ko|en)(\/|$)/, "/");
  const base = stripped === "/" ? "" : stripped;
  const localized = `/${locale}${base}`;
  return query ? `${localized}?${query}` : localized;
}

/** Switch locale while preserving path */
export function switchLocalePath(currentPath: string, targetLocale: Locale): string {
  const pathname = currentPath.split("?")[0] ?? "/";
  const query = currentPath.includes("?") ? currentPath.slice(currentPath.indexOf("?")) : "";
  if (AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return currentPath;
  }
  const stripped = pathname.replace(/^\/(ko|en)(\/|$)/, "/");
  const base = stripped === "/" ? "" : stripped;
  return `${localeHomePath(targetLocale)}${base}${query}`;
}

export function detectLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(ko|en)(\/|$)/);
  if (match?.[1] === "en") return "en";
  if (match?.[1] === "ko") return "ko";
  return defaultLocale;
}

export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/(ko|en)(\/|$)/, "/");
  return stripped === "" ? "/" : stripped;
}

export { locales };
