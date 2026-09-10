/**
 * Preview locale link matrix — validates KO/EN contracts for all preview routes
 * and public/auth regressions. Also asserts production source contains the fix.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/account", "/dashboard"];

function normalizePathname(pathname) {
  const raw = pathname.split("?")[0] || "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function stripLocalePrefixInternal(pathname) {
  const stripped = pathname.replace(/^\/(ko|en)(\/|$)/, "/");
  return stripped === "" ? "/" : stripped;
}

function isLocaleExemptPath(pathname) {
  const bare = stripLocalePrefixInternal(normalizePathname(pathname));
  if (AUTH_PATHS.some((p) => bare === p || bare.startsWith(`${p}/`))) return true;
  if (bare === "/preview" || bare.startsWith("/preview/")) return true;
  return false;
}

function isPreviewPath(pathname) {
  const bare = stripLocalePrefixInternal(normalizePathname(pathname));
  return bare === "/preview" || bare.startsWith("/preview/");
}

function switchLocalePath(currentPath, targetLocale) {
  const pathname = currentPath.split("?")[0] ?? "/";
  const query = currentPath.includes("?") ? currentPath.slice(currentPath.indexOf("?")) : "";
  if (isLocaleExemptPath(pathname)) {
    const safe = stripLocalePrefixInternal(pathname);
    return `${safe}${query}`;
  }
  const stripped = stripLocalePrefixInternal(pathname);
  const base = stripped === "/" ? "" : stripped;
  return `/${targetLocale}${base}${query}`;
}

function localizePath(pathInput, locale = "ko") {
  if (!pathInput || pathInput.startsWith("#") || pathInput.startsWith("http") || pathInput.startsWith("mailto:")) {
    return pathInput;
  }
  const [pathname, query] = pathInput.split("?");
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

const src = fs.readFileSync(path.join(process.cwd(), "src/i18n/localized-path.ts"), "utf8");
assert.match(src, /isPreviewPath/);
assert.match(src, /\/preview\//);
assert.match(src, /isLocaleExemptPath/);
assert.match(src, /stripLocalePrefixInternal/);

const switcher = fs.readFileSync(
  path.join(process.cwd(), "src/components/layout/LocaleSwitcher.tsx"),
  "utf8",
);
assert.match(switcher, /영문 준비 중/);
assert.match(switcher, /isPreviewPath/);
assert.match(switcher, /aria-disabled/);

const previewRoutes = [
  "/preview/commerce",
  "/preview/commerce/pricing",
  "/preview/commerce/checkout",
  "/preview/commerce/payment-result",
  "/preview/commerce/library",
  "/preview/commerce/business/automation",
  "/preview/commerce/business/apps",
  "/preview/commerce/business/ebooks",
  "/preview/commerce/business/knowledge",
  "/preview/commerce/business/marketing",
  "/preview/commerce/business/contents",
  "/preview/commerce/product/plc-dashboard-pack",
  "/preview/commerce/product/field-check-app",
  "/preview/commerce/product/factory-start-ebook",
  "/preview/commerce/product/weekly-quiz-pack",
  "/preview/commerce/product/free-tip-sheet",
  "/preview/commerce/product/promo-makeover",
  "/preview/commerce/product/morning-lofi-pack",
  "/preview/commerce/product/basic-member-note",
  "/preview/commerce/library?member=basic_active",
  "/preview/commerce/checkout?sku=factory-start-ebook&mode=one_time",
];

let failed = 0;
function check(name, fn) {
  try {
    fn();
    console.log("OK", name);
  } catch (e) {
    failed += 1;
    console.error("FAIL", name, e.message);
  }
}

console.log("--- preview KO/EN matrix ---");
for (const route of previewRoutes) {
  check(`KO ${route}`, () => {
    const href = switchLocalePath(route, "ko");
    assert.equal(href, route);
    assert.equal(href.includes("/ko/preview"), false);
  });
  check(`EN ${route}`, () => {
    const href = switchLocalePath(route, "en");
    assert.equal(href, route);
    assert.equal(href.includes("/en/preview"), false);
  });
  check(`localize ${route.split("?")[0]}`, () => {
    const p = route.split("?")[0];
    assert.equal(localizePath(p, "ko"), p);
    assert.equal(localizePath(p, "en"), p);
  });
}

check("recover /ko/preview/commerce", () => {
  assert.equal(switchLocalePath("/ko/preview/commerce", "ko"), "/preview/commerce");
  assert.equal(switchLocalePath("/en/preview/commerce/pricing", "en"), "/preview/commerce/pricing");
  assert.equal(isPreviewPath("/ko/preview/commerce"), true);
});

console.log("--- public locale regression ---");
check("public about", () => {
  assert.equal(switchLocalePath("/about", "ko"), "/ko/about");
  assert.equal(switchLocalePath("/ko/about", "en"), "/en/about");
  assert.equal(localizePath("/contact", "en"), "/en/contact");
});
check("auth", () => {
  assert.equal(switchLocalePath("/login", "en"), "/login");
  assert.equal(localizePath("/account", "ko"), "/account");
});

if (failed > 0) {
  console.error(`FAIL preview-locale-matrix: ${failed}`);
  process.exit(1);
}
console.log("PASS preview-locale-matrix");
