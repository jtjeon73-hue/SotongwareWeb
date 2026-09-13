/**
 * Static UI smoke for checkout/purchases routes after build.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");

function mustExist(rel) {
  const p = path.join(out, rel);
  assert.ok(fs.existsSync(p), `missing ${rel}`);
  const html = fs.readFileSync(p, "utf8");
  assert.ok(!/live_sk_/i.test(html), rel);
  assert.ok(!/TOSS_SECRET_KEY\s*=/.test(html), rel);
  return html;
}

if (!fs.existsSync(out)) {
  console.error("FAIL: out/ missing — run production build first");
  process.exit(1);
}

const checkout = mustExist("checkout.html");
assert.match(checkout, /결제|checkout/i);

mustExist("checkout/result.html");
mustExist("checkout/fail.html");
mustExist("account/purchases.html");
mustExist("account/purchases/detail.html");

console.log("PASS: checkout/purchases static HTML present without secrets");
console.log("\nCommerce UI smoke: PASS");
