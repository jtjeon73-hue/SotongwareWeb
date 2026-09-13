/**
 * Toss sandbox window connection unit tests (no network, no real keys).
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

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
async function runAsync(name, fn) {
  try {
    await fn();
    pass(name);
  } catch (e) {
    fail(name, e);
  }
}

const commerce = require(path.join(root, "functions/lib/commerce/index.js"));
const {
  MemoryCommerceStore,
  MockTossAdapter,
  CommerceCheckoutService,
  createTossCustomerKey,
  assertValidCustomerKey,
  resolvePgMode,
  assertSecretMatchesMode,
  CommerceError,
} = commerce;

run("customerKey 형식·특수문자·이메일 거부", () => {
  const k = createTossCustomerKey();
  assert.ok(k.length >= 2 && k.length <= 50);
  assert.match(k, /[-_=.@]/);
  assert.doesNotThrow(() => assertValidCustomerKey(k));
  assert.throws(() => assertValidCustomerKey("user@example.com"), CommerceError);
  assert.throws(() => assertValidCustomerKey("abcdef"), CommerceError);
});

run("customerKey는 UID/email 패턴이 아님", () => {
  for (let i = 0; i < 20; i++) {
    const k = createTossCustomerKey();
    assert.ok(!k.includes("@") || !k.includes("."));
    assert.ok(!/^uid_/i.test(k) || k.startsWith("ck_"));
    assert.match(k, /^ck_/);
  }
});

run("resolvePgMode mock/test 명시 · live 거부", () => {
  assert.equal(resolvePgMode({ COMMERCE_PG_MODE: "mock" }), "mock");
  assert.equal(resolvePgMode({ COMMERCE_PG_MODE: "test", TOSS_SECRET_KEY: "test_sk_x" }), "test");
  assert.equal(resolvePgMode({ FUNCTIONS_EMULATOR: "true" }), "mock");
  assert.equal(
    resolvePgMode({ FUNCTIONS_EMULATOR: "true", COMMERCE_PG_MODE: "test", TOSS_SECRET_KEY: "test_sk_x" }),
    "test",
  );
  assert.throws(
    () => resolvePgMode({ COMMERCE_PG_MODE: "live" }),
    (e) => e instanceof CommerceError && e.internalCode === "mode/live-forbidden",
  );
  assert.throws(
    () => resolvePgMode({ TOSS_SECRET_KEY: "live_sk_x" }),
    (e) => e instanceof CommerceError && e.internalCode === "mode/live-forbidden",
  );
});

run("Emulator+test가 mock으로 강제되지 않음", () => {
  const mode = resolvePgMode({
    FUNCTIONS_EMULATOR: "true",
    COMMERCE_PG_MODE: "test",
    TOSS_SECRET_KEY: "test_sk_demo",
  });
  assert.equal(mode, "test");
});

run("live secret 거부 · test secret 필요", () => {
  assert.throws(() => assertSecretMatchesMode("live_sk_x", "test"), CommerceError);
  assert.throws(() => assertSecretMatchesMode("", "test"), CommerceError);
  assert.doesNotThrow(() => assertSecretMatchesMode("test_sk_x", "test"));
});

await runAsync("prepare가 customerKey·pgMode·mockCheckout 반환", async () => {
  process.env.COMMERCE_PG_MODE = "mock";
  delete process.env.TOSS_SECRET_KEY;
  const store = new MemoryCommerceStore();
  store.users.set("user_a", { uid: "user_a", status: "active" });
  store.products.set("prod_ebook_1", {
    id: "prod_ebook_1",
    businessUnit: "ebook",
    slug: "x",
    title: "Ebook",
    summary: "d",
    productType: "digital_download",
    pricingType: "one_time",
    billingCycle: "none",
    currency: "KRW",
    amount: 15000,
    status: "published",
    version: 1,
    deliveryType: "download",
  });
  const svc = new CommerceCheckoutService(store, new MockTossAdapter());
  const prep = await svc.prepare("user_a", {
    productId: "prod_ebook_1",
    idempotencyKey: "idem-ck-0001",
  });
  assert.ok(prep.customerKey);
  assert.equal(prep.pgMode, "mock");
  assert.equal(prep.mockCheckout, true);
  assertValidCustomerKey(prep.customerKey);
  assert.notEqual(prep.customerKey, "user_a");
  const again = await svc.prepare("user_a", {
    productId: "prod_ebook_1",
    idempotencyKey: "idem-ck-0002",
  });
  assert.equal(again.customerKey, prep.customerKey);
});

run("SDK adapter 모듈·CheckoutView에 requestPayment 연결", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.ok(pkg.dependencies["@tosspayments/tosspayments-sdk"]);
  assert.match(pkg.dependencies["@tosspayments/tosspayments-sdk"], /2\./);
  const tossBrowser = fs.readFileSync(path.join(root, "src/lib/toss-browser.ts"), "utf8");
  assert.match(tossBrowser, /loadTossPayments/);
  assert.match(tossBrowser, /renderPaymentWindow/);
  assert.match(tossBrowser, /requestPayment/);
  assert.match(tossBrowser, /buildRequestPaymentParams/);
  assert.match(tossBrowser, /clientAmountOverride/);
  const checkout = fs.readFileSync(path.join(root, "src/components/commerce/CheckoutView.tsx"), "utf8");
  assert.match(checkout, /openTossSandboxPaymentWindow/);
  assert.match(checkout, /inFlight/);
  assert.doesNotMatch(checkout, /mockMode = usingEmulator/);
  const result = fs.readFileSync(path.join(root, "src/components/commerce/CheckoutResultView.tsx"), "utf8");
  assert.match(result, /confirmPayment/);
  assert.match(result, /paymentKey/);
  assert.doesNotMatch(result, /paid = .*paymentKey/);
  const fail = fs.readFileSync(path.join(root, "src/components/commerce/CheckoutFailView.tsx"), "utf8");
  assert.match(fail, /결제가 완료되지 않았습니다/);
  assert.doesNotMatch(fail, /confirmPayment|status.*=.*paid/);
});

run("secret이 client bundle 소스에 없음", () => {
  const files = [
    "src/lib/toss-browser.ts",
    "src/lib/commerce-mode.ts",
    "src/lib/commerce-checkout.ts",
    "src/components/commerce/CheckoutView.tsx",
    "src/components/commerce/CheckoutResultView.tsx",
  ];
  for (const f of files) {
    const t = fs.readFileSync(path.join(root, f), "utf8");
    assert.doesNotMatch(t, /TOSS_SECRET_KEY/);
    assert.doesNotMatch(t, /live_sk_/i);
    assert.doesNotMatch(t, /secretKey\s*[:=]/);
  }
});

run("client/secret key family·live 거부 헬퍼 존재", () => {
  const modeSrc = fs.readFileSync(path.join(root, "functions/src/commerce/mode.ts"), "utf8");
  assert.match(modeSrc, /live-forbidden|keys\/live-forbidden/);
  assert.match(modeSrc, /test_/);
  const clientMode = fs.readFileSync(path.join(root, "src/lib/commerce-mode.ts"), "utf8");
  assert.match(clientMode, /isCommerceTestSurfaceBlocked/);
  assert.match(clientMode, /buildCheckoutRedirectUrls/);
});

console.log("\ncommerce-toss-window: done");
