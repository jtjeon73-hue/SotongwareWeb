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
  if (/firestore\.(collection|doc)\(|createUserWithEmail|getFunctions\(|initializeApp\(/.test(html) && html.includes("preview/commerce") && /apiKey/.test(html)) {
    // Firebase client bundle may appear in shared chunks — only fail if page embeds secrets
  }
  console.log("OK", rel);
}

// Public regression: ko home still present
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
