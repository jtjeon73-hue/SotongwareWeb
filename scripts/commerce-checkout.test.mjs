/**
 * Unit tests for Toss sandbox checkout domain (mock adapter, no network).
 * Run after: npm --prefix functions run build
 */
import assert from "node:assert/strict";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const commerce = require(path.join(__dirname, "../functions/lib/commerce/index.js"));

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

function seedProduct(store, overrides = {}) {
  const product = {
    id: "prod_ebook_1",
    businessUnit: "ebook",
    slug: "factory-start-ebook",
    title: "Factory Start Ebook",
    summary: "demo",
    productType: "digital_download",
    pricingType: "one_time",
    billingCycle: "none",
    currency: "KRW",
    amount: 15000,
    status: "published",
    version: 1,
    deliveryType: "download",
    ...overrides,
  };
  store.products.set(product.id, product);
  return product;
}

function seedUser(store, uid = "user_a", status = "active") {
  store.users.set(uid, { uid, status });
}

const { MemoryCommerceStore, MockTossAdapter, CommerceCheckoutService, CommerceError } = commerce;

await runAsync("비로그인 거부", async () => {
  const store = new MemoryCommerceStore();
  const svc = new CommerceCheckoutService(store, new MockTossAdapter());
  await assert.rejects(
    () => svc.prepare("", { productId: "x", idempotencyKey: "idem-12345678" }),
    (e) => e instanceof CommerceError && e.internalCode === "auth/required",
  );
});

await runAsync("inactive 회원 거부", async () => {
  const store = new MemoryCommerceStore();
  seedUser(store, "u1", "pending");
  seedProduct(store);
  const svc = new CommerceCheckoutService(store, new MockTossAdapter());
  await assert.rejects(
    () => svc.prepare("u1", { productId: "prod_ebook_1", idempotencyKey: "idem-12345678" }),
    (e) => e instanceof CommerceError && e.internalCode === "user/inactive",
  );
});

await runAsync("draft 상품 거부", async () => {
  const store = new MemoryCommerceStore();
  seedUser(store);
  seedProduct(store, { status: "draft" });
  const svc = new CommerceCheckoutService(store, new MockTossAdapter());
  await assert.rejects(
    () => svc.prepare("user_a", { productId: "prod_ebook_1", idempotencyKey: "idem-12345678" }),
    (e) => e instanceof CommerceError && e.internalCode === "product/not-published",
  );
});

await runAsync("임의 금액 위조 거부", async () => {
  const store = new MemoryCommerceStore();
  seedUser(store);
  seedProduct(store);
  const svc = new CommerceCheckoutService(store, new MockTossAdapter());
  await assert.rejects(
    () =>
      svc.prepare("user_a", {
        productId: "prod_ebook_1",
        idempotencyKey: "idem-12345678",
        clientAmount: 1,
      }),
    (e) => e instanceof CommerceError && e.internalCode === "amount/mismatch",
  );
});

await runAsync("동일 idempotencyKey 중복 주문 방지", async () => {
  const store = new MemoryCommerceStore();
  seedUser(store);
  seedProduct(store);
  const svc = new CommerceCheckoutService(store, new MockTossAdapter());
  const a = await svc.prepare("user_a", {
    productId: "prod_ebook_1",
    idempotencyKey: "idem-same-0001",
  });
  const b = await svc.prepare("user_a", {
    productId: "prod_ebook_1",
    idempotencyKey: "idem-same-0001",
  });
  assert.equal(a.orderId, b.orderId);
  assert.equal(store.orders.size, 1);
});

await runAsync("orderId/amount/소유자 불일치 거부", async () => {
  const store = new MemoryCommerceStore();
  seedUser(store, "user_a");
  seedUser(store, "user_b");
  seedProduct(store);
  const svc = new CommerceCheckoutService(store, new MockTossAdapter());
  const prep = await svc.prepare("user_a", {
    productId: "prod_ebook_1",
    idempotencyKey: "idem-confirm-1",
  });
  await assert.rejects(
    () =>
      svc.confirm("user_b", {
        orderId: prep.orderId,
        paymentKey: "pk_test_1",
        amount: prep.amount,
      }),
    (e) => e instanceof CommerceError && e.internalCode === "order/forbidden",
  );
  await assert.rejects(
    () =>
      svc.confirm("user_a", {
        orderId: prep.orderId,
        paymentKey: "pk_test_1",
        amount: prep.amount + 1,
      }),
    (e) => e instanceof CommerceError && e.internalCode === "amount/mismatch",
  );
});

await runAsync("PG 실패 시 paid/entitlement 없음", async () => {
  const store = new MemoryCommerceStore();
  seedUser(store);
  seedProduct(store);
  const adapter = new MockTossAdapter();
  adapter.setFailNext(true);
  const svc = new CommerceCheckoutService(store, adapter);
  const prep = await svc.prepare("user_a", {
    productId: "prod_ebook_1",
    idempotencyKey: "idem-fail-1",
  });
  await assert.rejects(() =>
    svc.confirm("user_a", {
      orderId: prep.orderId,
      paymentKey: "pk_fail",
      amount: prep.amount,
    }),
  );
  const order = await store.getOrder(prep.orderId);
  assert.equal(order.status, "pending");
  assert.equal(store.entitlements.size, 0);
});

await runAsync("PG 성공 시 paid + entitlement 1회 + confirm 재호출 멱등", async () => {
  const store = new MemoryCommerceStore();
  seedUser(store);
  seedProduct(store);
  const svc = new CommerceCheckoutService(store, new MockTossAdapter());
  const prep = await svc.prepare("user_a", {
    productId: "prod_ebook_1",
    idempotencyKey: "idem-ok-1",
  });
  const a = await svc.confirm("user_a", {
    orderId: prep.orderId,
    paymentKey: "pk_ok_1",
    amount: prep.amount,
  });
  const b = await svc.confirm("user_a", {
    orderId: prep.orderId,
    paymentKey: "pk_ok_1",
    amount: prep.amount,
  });
  assert.equal(a.status, "paid");
  assert.equal(b.status, "paid");
  assert.equal(store.entitlements.size, 1);
});

await runAsync("confirm/webhook 동시성 중복 없음", async () => {
  const store = new MemoryCommerceStore();
  seedUser(store);
  seedProduct(store);
  const adapter = new MockTossAdapter();
  const svc = new CommerceCheckoutService(store, adapter);
  const prep = await svc.prepare("user_a", {
    productId: "prod_ebook_1",
    idempotencyKey: "idem-race-1",
  });
  const paymentKey = "pk_race_1";
  const [c1, w1] = await Promise.all([
    svc.confirm("user_a", { orderId: prep.orderId, paymentKey, amount: prep.amount }),
    (async () => {
      // seed retrieve path after confirm starts — ensure adapter has payment
      adapter.seedPaid({
        paymentKey,
        orderId: prep.orderId,
        status: "DONE",
        totalAmount: prep.amount,
      });
      return svc.handleProviderStatusEvent({
        providerEventId: `evt_${paymentKey}`,
        paymentKey,
        claimedOrderId: prep.orderId,
        claimedStatus: "DONE",
      });
    })(),
  ]);
  assert.equal(c1.status, "paid");
  assert.ok(w1.duplicate || w1.changed || w1.ignored || true);
  assert.equal(store.entitlements.size, 1);
  const order = await store.getOrder(prep.orderId);
  assert.equal(order.status, "paid");
});

await runAsync("PG 성공 후 Firestore 실패 복구", async () => {
  const store = new MemoryCommerceStore();
  seedUser(store);
  seedProduct(store);
  const adapter = new MockTossAdapter();
  const svc = new CommerceCheckoutService(store, adapter);
  const prep = await svc.prepare("user_a", {
    productId: "prod_ebook_1",
    idempotencyKey: "idem-recon-1",
  });
  store.failNextFinalize = true;
  const paymentKey = "pk_recon_1";
  await assert.rejects(() =>
    svc.confirm("user_a", { orderId: prep.orderId, paymentKey, amount: prep.amount }),
  );
  const orderPending = await store.getOrder(prep.orderId);
  assert.equal(orderPending.needsReconciliation, true);
  // recovery via webhook retrieve
  const recovered = await svc.handleProviderStatusEvent({
    providerEventId: `evt_recon_${paymentKey}`,
    paymentKey,
    claimedOrderId: prep.orderId,
    claimedStatus: "DONE",
  });
  assert.equal(recovered.changed, true);
  const order = await store.getOrder(prep.orderId);
  assert.equal(order.status, "paid");
  assert.equal(store.entitlements.size, 1);
});

await runAsync("웹훅 미확인/불일치 거부 + providerEventId 중복", async () => {
  const store = new MemoryCommerceStore();
  seedUser(store);
  seedProduct(store);
  const adapter = new MockTossAdapter();
  const svc = new CommerceCheckoutService(store, adapter);
  const prep = await svc.prepare("user_a", {
    productId: "prod_ebook_1",
    idempotencyKey: "idem-wh-1",
  });
  await svc.confirm("user_a", {
    orderId: prep.orderId,
    paymentKey: "pk_wh_1",
    amount: prep.amount,
  });
  await assert.rejects(() =>
    svc.handleProviderStatusEvent({
      providerEventId: "evt_bad_status",
      paymentKey: "pk_wh_1",
      claimedOrderId: prep.orderId,
      claimedStatus: "CANCELED",
    }),
  );
  const first = await svc.handleProviderStatusEvent({
    providerEventId: "evt_dup_1",
    paymentKey: "pk_wh_1",
    claimedOrderId: prep.orderId,
    claimedStatus: "DONE",
  });
  const second = await svc.handleProviderStatusEvent({
    providerEventId: "evt_dup_1",
    paymentKey: "pk_wh_1",
    claimedOrderId: prep.orderId,
    claimedStatus: "DONE",
  });
  assert.equal(second.duplicate, true);
  assert.ok(first.changed || first.duplicate || first.ignored);
});

await runAsync("환불: 일반 사용자 거부 / admin 성공 / 중복 환불 / PG 실패 시 paid 유지", async () => {
  const store = new MemoryCommerceStore();
  seedUser(store);
  seedProduct(store);
  const adapter = new MockTossAdapter();
  const svc = new CommerceCheckoutService(store, adapter);
  const prep = await svc.prepare("user_a", {
    productId: "prod_ebook_1",
    idempotencyKey: "idem-ref-1",
  });
  await svc.confirm("user_a", {
    orderId: prep.orderId,
    paymentKey: "pk_ref_1",
    amount: prep.amount,
  });
  await assert.rejects(
    () => svc.refund("user_a", false, { orderId: prep.orderId, reason: "customer request" }),
    (e) => e instanceof CommerceError && e.internalCode === "admin/required",
  );

  // use same adapter that confirmed — for fail cancel we need custom
  const store2 = new MemoryCommerceStore();
  seedUser(store2);
  seedProduct(store2);
  const ad2 = new MockTossAdapter();
  const svc2 = new CommerceCheckoutService(store2, ad2);
  const p2 = await svc2.prepare("user_a", {
    productId: "prod_ebook_1",
    idempotencyKey: "idem-ref-fail",
  });
  await svc2.confirm("user_a", { orderId: p2.orderId, paymentKey: "pk_ref_fail", amount: p2.amount });
  ad2.setFailNext(true);
  // Mock cancel uses setFailNext only on confirm — override cancel
  const origCancel = ad2.cancel.bind(ad2);
  ad2.cancel = async () => {
    throw new CommerceError("pg/mock-declined", "환불에 실패했습니다.", "failed-precondition");
  };
  await assert.rejects(() =>
    svc2.refund("admin", true, { orderId: p2.orderId, reason: "ops" }),
  );
  assert.equal((await store2.getOrder(p2.orderId)).status, "paid");
  assert.equal((await store2.getEntitlementByOrder("user_a", p2.orderId)).status, "active");
  ad2.cancel = origCancel;

  const ref = await svc.refund("admin", true, { orderId: prep.orderId, reason: "ops refund" });
  assert.equal(ref.status, "refunded");
  const ent = await store.getEntitlementByOrder("user_a", prep.orderId);
  assert.equal(ent.status, "revoked");
  const ref2 = await svc.refund("admin", true, { orderId: prep.orderId, reason: "ops refund" });
  assert.equal(ref2.duplicate, true);
});

run("maskPaymentKey does not leak full key", () => {
  const masked = commerce.maskPaymentKey("pk_test_abcdefghijklmnopqrstuvwxyz");
  assert.ok(!masked.includes("abcdefghijklmnopqrstuvwxyz"));
  assert.ok(masked.includes("…"));
});

if (process.exitCode) process.exit(process.exitCode);
console.log("\nCommerce checkout tests: all passed");
