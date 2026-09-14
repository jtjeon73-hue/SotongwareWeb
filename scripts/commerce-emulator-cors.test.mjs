/**
 * Local commerce emulator helpers — no secrets, no deploy.
 * Verifies callable OPTIONS preflight returns CORS headers (Emulator only).
 */
import assert from "node:assert/strict";

const PROJECT = process.env.GCLOUD_PROJECT || process.env.GCLOUD_PROJECT || "sotongware";
const HOST = process.env.FIREBASE_FUNCTIONS_EMULATOR_HOST || "127.0.0.1:5001";
const ORIGIN = process.env.COMMERCE_CORS_TEST_ORIGIN || "http://localhost:3000";

const CALLABLES = ["ensureMyMemberProfile", "prepareCommerceCheckout"];

function pass(name) {
  console.log(`PASS: ${name}`);
}
function fail(name, e) {
  console.error(`FAIL: ${name}`);
  console.error(e);
  process.exitCode = 1;
}

async function optionsCors(name) {
  const url = `http://${HOST}/${PROJECT}/us-central1/${name}`;
  const res = await fetch(url, {
    method: "OPTIONS",
    headers: {
      Origin: ORIGIN,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type,authorization",
    },
  });
  const allowOrigin = res.headers.get("access-control-allow-origin");
  assert.ok(res.status >= 200 && res.status < 300, `${name} OPTIONS status ${res.status}`);
  assert.ok(
    allowOrigin === "*" || allowOrigin === ORIGIN,
    `${name} missing ACAO (got ${allowOrigin})`,
  );
  pass(`OPTIONS CORS ${name} status=${res.status} acao=${allowOrigin}`);
}

async function unauthenticatedNegative(name) {
  const url = `http://${HOST}/${PROJECT}/us-central1/${name}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Origin: ORIGIN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: {} }),
  });
  // Callable protocol: should not be opaque network/CORS failure
  assert.notEqual(res.status, 404, `${name} must be exported (not 404)`);
  const acao = res.headers.get("access-control-allow-origin");
  assert.ok(acao === "*" || acao === ORIGIN, `${name} POST missing CORS`);
  pass(`unauth callable reachable ${name} status=${res.status}`);
}

async function main() {
  for (const name of CALLABLES) {
    try {
      await optionsCors(name);
    } catch (e) {
      fail(`OPTIONS ${name}`, e);
    }
  }
  for (const name of CALLABLES) {
    try {
      await unauthenticatedNegative(name);
    } catch (e) {
      fail(`unauth ${name}`, e);
    }
  }
  if (process.exitCode) {
    console.error("\ncommerce-emulator-cors: FAIL — Functions may not be loaded (discovery timeout / empty export).");
    process.exit(1);
  }
  console.log("\ncommerce-emulator-cors: PASS");
}

main();
