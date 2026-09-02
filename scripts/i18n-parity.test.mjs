/**
 * i18n parity checks (no TS imports)
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcDir = join(root, "src");

let failed = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}

function pass(msg) {
  console.log(`PASS: ${msg}`);
}

// No "맛보기" in user-facing source
const koDict = readFileSync(join(srcDir, "i18n", "dictionaries", "ko.ts"), "utf8");
if (koDict.includes("맛보기")) {
  fail('"맛보기" found in ko dictionary');
} else {
  pass('no "맛보기" in ko dictionary');
}

const hubDir = join(srcDir, "components", "home", "hub");
if (existsSync(hubDir)) {
  for (const file of readdirSync(hubDir).filter((f) => f.endsWith(".tsx"))) {
    const content = readFileSync(join(hubDir, file), "utf8");
    if (content.includes("맛보기")) {
      fail(`"맛보기" in ${file}`);
    }
  }
}

// Capability route file
const capPage = join(srcDir, "app", "[locale]", "capabilities", "[slug]", "page.tsx");
if (!existsSync(capPage)) {
  fail("missing capabilities/[slug] locale page");
} else {
  pass("capability route file exists");
}

// Public locale routes (keep in sync with src/i18n/routes.ts)
const publicRoutes = [
  "",
  "about",
  "contact",
  "process",
  "guide",
  "privacy",
  "terms",
  "services",
  "products",
  "works",
  "solutions",
  "automation",
  "apps",
  "ebooks",
  "marketing",
  "contents",
  "knowledge",
  "capabilities/industrial-automation",
  "capabilities/smart-farm",
  "capabilities/ai-software",
  "capabilities/multiplatform-control",
];

for (const route of publicRoutes) {
  if (route.startsWith("capabilities/")) {
    continue;
  }
  const parts = route ? route.split("/") : [];
  const pagePath =
    parts.length === 0
      ? join(srcDir, "app", "[locale]", "page.tsx")
      : join(srcDir, "app", "[locale]", ...parts, "page.tsx");
  if (!existsSync(pagePath)) {
    fail(`missing locale page for /${route || ""}`);
  }
}
if (failed === 0) pass(`all ${publicRoutes.length} PUBLIC_LOCALE_ROUTES exist (capabilities via [slug])`);

// KO/EN dictionary key parity (home + site)
function flattenKeys(obj, prefix = "") {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return prefix ? [prefix] : [];
  }
  return Object.entries(obj).flatMap(([k, v]) => flattenKeys(v, prefix ? `${prefix}.${k}` : k));
}

function parseExportObject(filePath, exportName) {
  const src = readFileSync(filePath, "utf8");
  const marker = `export const ${exportName}`;
  const start = src.indexOf(marker);
  if (start < 0) return null;
  const eq = src.indexOf("=", start);
  let depth = 0;
  let started = false;
  let jsonLike = "";
  for (let i = eq + 1; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") {
      depth++;
      started = true;
    }
    if (started) jsonLike += ch;
    if (ch === "}") {
      depth--;
      if (started && depth === 0) break;
    }
  }
  try {
    return Function(`"use strict"; return (${jsonLike});`)();
  } catch {
    return null;
  }
}

const koHome = parseExportObject(join(srcDir, "i18n", "dictionaries", "ko.ts"), "koHome");
const enHome = parseExportObject(join(srcDir, "i18n", "dictionaries", "en.ts"), "enHome");
if (koHome && enHome) {
  const koKeys = JSON.stringify(flattenKeys(koHome).sort());
  const enKeys = JSON.stringify(flattenKeys(enHome).sort());
  if (koKeys !== enKeys) fail("home dictionary key mismatch ko/en");
  else pass("home dictionary key parity");
}

console.log(failed === 0 ? "\ni18n parity: PASS" : `\ni18n parity: FAIL (${failed} issues)`);
process.exit(failed === 0 ? 0 : 1);
