/**
 * Rendered HTML locale content checks (run after `npm run build`)
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "out");

const HANGUL = /[가-힣]/;
const EN_FORBIDDEN_UI = /\b(로그인|회원가입|소통웨어|무료|테스트 중|현재 공개 중인 제품|전기 점검)\b/;

const EN_ROUTES = ["en.html", "en/products.html", "en/apps.html"];
const KO_ROUTES = ["ko.html", "ko/products.html"];

let failed = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}

function pass(msg) {
  console.log(`PASS: ${msg}`);
}

function resolveBuiltPath(route) {
  const direct = join(outDir, route);
  if (existsSync(direct)) return direct;
  const nested = join(outDir, route.replace(/\.html$/, ""), "index.html");
  if (existsSync(nested)) return nested;
  return null;
}

function stripScriptsAndStyles(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
}

function visibleText(html) {
  return stripScriptsAndStyles(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripLocaleSwitcher(text) {
  return text.replace(/한국어\s+English/g, "English").replace(/English\s+한국어/g, "English");
}

function checkDivLang(filePath, expected) {
  const html = readFileSync(filePath, "utf8");
  const match = html.match(/<div\s+lang=["']([^"']+)["']/i);
  if (!match || match[1] !== expected) {
    fail(`${filePath}: expected div lang="${expected}", got ${match?.[1] ?? "none"}`);
    return;
  }
  pass(`${filePath}: div lang=${expected}`);
}

for (const route of EN_ROUTES) {
  const filePath = resolveBuiltPath(route);
  if (!filePath) {
    fail(`missing built file ${route}`);
    continue;
  }

  checkDivLang(filePath, "en");

  const text = stripLocaleSwitcher(visibleText(readFileSync(filePath, "utf8")));
  if (HANGUL.test(text)) {
    const sample = text.match(/.{0,40}[가-힣].{0,40}/)?.[0] ?? "";
    fail(`${route}: unexpected Korean in rendered HTML — "...${sample}..."`);
  } else {
    pass(`${route}: no Korean in visible text`);
  }

  if (route === "en/products.html") {
    if (EN_FORBIDDEN_UI.test(text)) {
      fail("en/products.html: forbidden Korean UI strings");
    } else {
      pass("en/products.html: no forbidden Korean UI strings");
    }
    if (!text.includes("Electrical Inspection") && !text.includes("Available products")) {
      fail("en/products.html: missing expected English product copy");
    } else {
      pass("en/products.html: English product copy present");
    }
    if (!text.includes("Log In") || !text.includes("Sign Up")) {
      fail("en/products.html: missing Log In / Sign Up in header");
    } else {
      pass("en/products.html: Log In / Sign Up present");
    }
  }
}

for (const route of KO_ROUTES) {
  const filePath = resolveBuiltPath(route);
  if (!filePath) {
    fail(`missing built file ${route}`);
    continue;
  }
  checkDivLang(filePath, "ko");
  const text = visibleText(readFileSync(filePath, "utf8"));
  if (/\bLog In\b/.test(text) || /\bSign Up\b/.test(text)) {
    fail(`${route}: English auth labels on Korean page`);
  } else {
    pass(`${route}: no English-only auth labels`);
  }
}

console.log(failed === 0 ? "\nrendered locale content: PASS" : `\nrendered locale content: FAIL (${failed})`);
process.exit(failed === 0 ? 0 : 1);
