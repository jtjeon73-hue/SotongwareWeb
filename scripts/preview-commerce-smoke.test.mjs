/**
 * Preview commerce smoke: ensure static export HTML exists for key routes.
 * Run after `npm run build` (expects ./out).
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");

const routes = [
  "preview/commerce.html",
  "preview/commerce/showcase.html",
  "preview/commerce/showcase-v4.html",
  "preview/commerce/pricing.html",
  "preview/commerce/checkout.html",
  "preview/commerce/payment-result.html",
  "preview/commerce/library.html",
  "preview/commerce/business/automation.html",
  "preview/commerce/business/apps.html",
  "preview/commerce/business/ebooks.html",
  "preview/commerce/business/knowledge.html",
  "preview/commerce/business/marketing.html",
  "preview/commerce/business/contents.html",
  "preview/commerce/product/factory-start-ebook.html",
  "preview/commerce/product/weekly-quiz-pack.html",
];

const banner = "검토용 시제품";
let failed = 0;

if (!fs.existsSync(out)) {
  console.error("FAIL: out/ missing — run npm run build first");
  process.exit(1);
}

for (const rel of routes) {
  const file = path.join(out, rel);
  if (!fs.existsSync(file)) {
    console.error("MISSING", rel);
    failed += 1;
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes(banner)) {
    console.error("NO_BANNER", rel);
    failed += 1;
    continue;
  }
  if (
    html.includes("/ko/preview/") ||
    html.includes("/en/preview/") ||
    html.includes('"/ko/preview"') ||
    html.includes('"/en/preview"')
  ) {
    console.error("BAD_LOCALE_HREF", rel);
    failed += 1;
    continue;
  }
  console.log("OK", rel);
}

const showcase = path.join(out, "preview/commerce/showcase.html");
if (fs.existsSync(showcase)) {
  const sh = fs.readFileSync(showcase, "utf8");
  if (!sh.includes("Global Premium") && !sh.includes("화려한 V3") && !sh.includes("Showcase")) {
    console.error("SHOWCASE_MARKERS_MISSING");
    failed += 1;
  } else {
    console.log("OK showcase markers");
  }
  if (!sh.includes("깔끔한 V2")) {
    console.error("SHOWCASE_MISSING_V2_COMPARE");
    failed += 1;
  }
} else {
  console.error("MISSING showcase");
  failed += 1;
}

const v4 = path.join(out, "preview/commerce/showcase-v4.html");
if (fs.existsSync(v4)) {
  const vh = fs.readFileSync(v4, "utf8");
  if (!vh.includes("Premium 3D") && !vh.includes("입체 V4") && !vh.includes("Showcase V4")) {
    console.error("V4_MARKERS_MISSING");
    failed += 1;
  } else console.log("OK v4 markers");
  if (!vh.includes("화려한 V3") && !vh.includes("/showcase")) {
    console.error("V4_MISSING_V3_COMPARE");
    failed += 1;
  }
} else {
  console.error("MISSING showcase-v4");
  failed += 1;
}

const ko = path.join(out, "ko.html");
if (!fs.existsSync(ko)) {
  console.error("MISSING public route ko.html");
  failed += 1;
} else {
  console.log("OK ko.html (regression)");
}

if (failed > 0) {
  console.error(`FAIL: ${failed} checks`);
  process.exit(1);
}
console.log("PASS preview-commerce smoke");
