/**
 * Static checks: commerce omit + live key leakage guards.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function pass(n) {
  console.log(`PASS: ${n}`);
}
function fail(n, e) {
  console.error(`FAIL: ${n}`);
  console.error(e);
  process.exitCode = 1;
}
function run(n, fn) {
  try {
    fn();
    pass(n);
  } catch (e) {
    fail(n, e);
  }
}

run("commerce handlers cloud-omit by default", () => {
  const src = fs.readFileSync(path.join(root, "functions/src/commerce/handlers.ts"), "utf8");
  assert.match(src, /ALLOW_COMMERCE_FUNCTIONS/);
  assert.match(src, /commerceFunctionsOmitted/);
  assert.match(src, /omit:\s*commerceFunctionsOmitted/);
});

run("no NEXT_PUBLIC secret key pattern in source", () => {
  const files = [
    "functions/src/commerce/adapter.ts",
    "functions/src/commerce/handlers.ts",
    "src/lib/commerce-checkout.ts",
    ".env.example",
  ];
  for (const f of files) {
    const s = fs.readFileSync(path.join(root, f), "utf8");
    assert.ok(!/NEXT_PUBLIC_TOSS_SECRET/i.test(s), f);
    assert.ok(!/live_sk_/i.test(s), f);
    assert.ok(!/test_sk_[a-z0-9]/i.test(s), f);
  }
});

run("production out/ must not contain live_sk_ if present", () => {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    pass("production out/ must not contain live_sk_ if present (skipped: no out yet)");
    return;
  }
  const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (/\.(html|js|txt|json)$/.test(ent.name)) {
        const s = fs.readFileSync(p, "utf8");
        assert.ok(!/live_sk_/i.test(s), p);
        assert.ok(!/TOSS_SECRET_KEY\s*=\s*\S+/.test(s), p);
      }
    }
  };
  walk(outDir);
});

if (process.exitCode) process.exit(process.exitCode);
console.log("\nCommerce options/secret tests: all passed");
