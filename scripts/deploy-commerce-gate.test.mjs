import assert from "node:assert/strict";
import {
  COMMERCE_ALLOWED_FUNCTIONS,
  COMMERCE_FORBIDDEN_NAMES,
  assertSafeProject,
  assertKeyModeSafe,
  buildCommerceOnlyFlag,
  assertNoForbiddenTargets,
  planCommerceDeploy,
} from "./deploy-commerce-functions.mjs";

function pass(name) {
  console.log(`PASS: ${name}`);
}
function fail(name, e) {
  console.error(`FAIL: ${name}`);
  console.error(e);
  process.exitCode = 1;
}
function run(name, fn) {
  try {
    fn();
    pass(name);
  } catch (e) {
    fail(name, e);
  }
}

run("commerce allowlist exact", () => {
  assert.deepEqual([...COMMERCE_ALLOWED_FUNCTIONS].sort(), [
    "confirmCommercePayment",
    "handleTossPaymentWebhook",
    "prepareCommerceCheckout",
    "refundCommercePayment",
  ].sort());
});

run("rejects membership/contact in commerce gate", () => {
  for (const n of COMMERCE_FORBIDDEN_NAMES) {
    assert.throws(() => buildCommerceOnlyFlag([n]), /Forbidden|not on commerce/);
  }
});

run("project guards", () => {
  assertSafeProject("sotongware");
  assert.throws(() => assertSafeProject("sotongware-control"), /sotongware-control/);
});

run("key mode mix rejected", () => {
  assert.throws(
    () => assertKeyModeSafe({ COMMERCE_PG_MODE: "test", TOSS_SECRET_KEY: "live_sk_x" }),
    /live secret/,
  );
  assert.throws(
    () => assertKeyModeSafe({ COMMERCE_PG_MODE: "live", TOSS_SECRET_KEY: "test_sk_x" }),
    /test secret/,
  );
});

run("builds commerce-only flag", () => {
  const flag = buildCommerceOnlyFlag();
  assert.ok(flag.includes("prepareCommerceCheckout"));
  assert.ok(!flag.toLowerCase().includes("hosting"));
  assert.ok(!flag.toLowerCase().includes("ensuremymemberprofile"));
  assertNoForbiddenTargets(flag);
});

run("planCommerceDeploy check shape", () => {
  const plan = planCommerceDeploy();
  assert.equal(plan.project, "sotongware");
  assert.equal(plan.secretsReady, false);
});

if (process.exitCode) process.exit(process.exitCode);
console.log("\nCommerce deploy gate tests: all passed");
