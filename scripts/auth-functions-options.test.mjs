/**
 * Static verification of membership Function runtime options + contact omit.
 * Run: node scripts/auth-functions-options.test.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const member = fs.readFileSync(path.join(root, "functions/src/member-profile.ts"), "utf8");
const index = fs.readFileSync(path.join(root, "functions/src/index.ts"), "utf8");

function pass(n) {
  console.log(`PASS: ${n}`);
}

try {
  assert.match(member, /region:\s*"us-central1"/);
  assert.match(member, /memory:\s*"256MiB"/);
  assert.match(member, /timeoutSeconds:\s*30/);
  assert.match(member, /minInstances:\s*0/);
  assert.match(member, /maxInstances:\s*5/);
  assert.match(member, /ensureMyMemberProfile\s*=\s*onCall/);
  pass("ensureMyMemberProfile options");

  assert.match(member, /memory:\s*"256MB"/);
  assert.match(member, /maxInstances:\s*3/);
  assert.match(member, /\.region\("us-central1"\)/);
  assert.match(member, /auth\.user\(\)/);
  assert.match(member, /runWith\(/);
  assert.doesNotMatch(member, /failurePolicy:\s*true/);
  pass("provisionMemberProfile gen1 options");

  assert.match(index, /omit:\s*!?\(runningInEmulator/);
  assert.match(index, /ALLOW_CONTACT_FUNCTION/);
  assert.match(index, /submitContactInquiry/);
  assert.match(index, /maxInstances:\s*3/);
  pass("submitContactInquiry omit fail-closed + preserved");

  console.log("\nAuth functions options tests: all passed");
} catch (e) {
  console.error("FAIL", e);
  process.exit(1);
}
