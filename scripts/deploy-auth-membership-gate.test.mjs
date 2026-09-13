/**
 * Unit tests for auth membership deploy allowlist / project guards.
 * Run: node scripts/deploy-auth-membership-gate.test.mjs
 * Does NOT call firebase deploy.
 */
import assert from "node:assert/strict";
import {
  ALLOWED_FUNCTIONS,
  FORBIDDEN_FUNCTION_NAMES,
  assertSafeProject,
  buildFunctionsOnlyFlag,
  assertNoForbiddenTargets,
  buildDeployArgs,
  planAuthMembershipDeploy,
} from "./deploy-auth-membership-functions.mjs";

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

run("allowlist is membership only", () => {
  assert.deepEqual([...ALLOWED_FUNCTIONS].sort(), [
    "ensureMyMemberProfile",
    "provisionMemberProfile",
  ].sort());
  assert.ok(FORBIDDEN_FUNCTION_NAMES.includes("submitContactInquiry"));
});

run("accepts sotongware", () => {
  assertSafeProject("sotongware");
});

run("rejects sotongware-control", () => {
  assert.throws(() => assertSafeProject("sotongware-control"), /sotongware-control/);
});

run("rejects other project", () => {
  assert.throws(() => assertSafeProject("other-project"), /unexpected project/);
});

run("builds functions-only flag", () => {
  const flag = buildFunctionsOnlyFlag();
  assert.equal(
    flag,
    "functions:ensureMyMemberProfile,functions:provisionMemberProfile",
  );
  assert.ok(!flag.toLowerCase().includes("hosting"));
  assert.ok(!flag.toLowerCase().includes("firestore"));
  assert.ok(!flag.toLowerCase().includes("submitcontactinquiry"));
});


run("rejects commerce function names", () => {
  for (const name of [
    "prepareCommerceCheckout",
    "confirmCommercePayment",
    "handleTossPaymentWebhook",
    "refundCommercePayment",
  ]) {
    assert.ok(FORBIDDEN_FUNCTION_NAMES.includes(name), name);
    assert.throws(
      () => assertNoForbiddenTargets(`functions:${name}`),
      new RegExp(name),
    );
  }
});

run("rejects contact in allowlist builder", () => {
  assert.throws(
    () => buildFunctionsOnlyFlag(["submitContactInquiry"]),
    /Forbidden function/,
  );
});

run("rejects hosting/rules in only flag", () => {
  assert.throws(() => assertNoForbiddenTargets("hosting,functions:x"), /hosting/);
  assert.throws(() => assertNoForbiddenTargets("firestore:rules"), /firestore/);
  assert.throws(
    () => assertNoForbiddenTargets("functions:submitContactInquiry"),
    /submitContactInquiry/,
  );
});

run("buildDeployArgs is functions-only for sotongware", () => {
  const args = buildDeployArgs(
    "sotongware",
    "functions:ensureMyMemberProfile,functions:provisionMemberProfile",
  );
  assert.deepEqual(args, [
    "deploy",
    "--only",
    "functions:ensureMyMemberProfile,functions:provisionMemberProfile",
    "--project",
    "sotongware",
  ]);
});

run("planAuthMembershipDeploy from repo", () => {
  const plan = planAuthMembershipDeploy();
  assert.equal(plan.project, "sotongware");
  assert.ok(plan.commandPreview.includes("--project sotongware"));
  assert.ok(plan.commandPreview.includes("functions:ensureMyMemberProfile"));
  assert.ok(plan.commandPreview.includes("functions:provisionMemberProfile"));
  assert.ok(!plan.commandPreview.includes("submitContactInquiry"));
  assert.ok(!plan.commandPreview.includes("hosting"));
  assert.ok(!plan.commandPreview.includes("firestore"));
});

if (process.exitCode) {
  console.error("\nDeploy gate tests FAILED");
  process.exit(1);
}
console.log("\nDeploy gate tests: all passed");
