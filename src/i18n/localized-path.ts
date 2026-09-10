import type { Locale } from "./config";
import { defaultLocale, locales } from "./config";

const AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/account", "/dashboard"];

function normalizePathname(pathname: string): string {
  const raw = pathname.split("?")[0] || "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function stripLocalePrefixInternal(pathname: string): string {
  const stripped = pathname.replace(/^\/(ko|en)(\/|$)/, "/");
  return stripped === "" ? "/" : stripped;
}

/** Paths that must not receive /ko|/en prefix (static preview, auth, etc.) */
export function isLocaleExemptPath(pathname: string): boolean {
  const normalized = normalizePathname(pathname);
  const bare = stripLocalePrefixInternal(normalized);
  if (AUTH_PATHS.some((p) => bare === p || bare.startsWith(`${p}/`))) {
    return true;
  }
  if (bare === "/preview" || bare.startsWith("/preview/")) {
    return true;
  }
  return false;
}

/** Preview commerce is Korean-only UI; English locale switch is unavailable. */
export function isPreviewPath(pathname: string): boolean {
  const bare = stripLocalePrefixInternal(normalizePathname(pathname));
  return bare === "/preview" || bare.startsWith("/preview/");
}

export function localeHomePath(locale: Locale): string {
  return `/${locale}`;
}

/** Prefix internal path with locale (auth + preview paths unchanged) */
export function localizePath(path: string, locale: Locale = defaultLocale): string {
  if (!path || path.startsWith("#") || path.startsWith("http") || path.startsWith("mailto:")) {
    return path;
  }
  const [pathname, query] = path.split("?");
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (isLocaleExemptPath(normalized)) {
    const bare = stripLocalePrefixInternal(normalized);
    return query ? `${bare}?${query}` : bare;
  }
  const stripped = stripLocalePrefixInternal(normalized);
  const base = stripped === "/" ? "" : stripped;
  const localized = `/${locale}${base}`;
  return query ? `${localized}?${query}` : localized;
}

/** Switch locale while preserving path */
export function switchLocalePath(currentPath: string, targetLocale: Locale): string {
  const pathname = currentPath.split("?")[0] ?? "/";
  const query = currentPath.includes("?") ? currentPath.slice(currentPath.indexOf("?")) : "";

  if (isLocaleExemptPath(pathname)) {
    // Never emit /ko/preview/... or /en/preview/...
    const safe = stripLocalePrefixInternal(pathname);
    return `${safe}${query}`;
  }

  const stripped = stripLocalePrefixInternal(pathname);
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
  return stripLocalePrefixInternal(normalizePathname(pathname));
}

export { locales };
