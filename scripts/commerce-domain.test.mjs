/**
 * Commerce domain unit tests (PG-free, in-memory).
 * Run: npm run test:commerce:domain
 */
import assert from "node:assert/strict";
import * as d from "../src/lib/commerce-core/domain.mjs";

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

const clock = () => "2026-09-14T00:00:00.000Z";

function sampleProduct(overrides = {}) {
  return {
    id: "prod_1",
    businessUnit: "knowledge",
    slug: "course-a",
    title: "Course A",
    summary: "summary",
    productType: "education",
    pricingType: "one_time",
    billingCycle: "none",
    currency: "KRW",
    amount: 15000,
    status: "published",
    version: 1,
    deliveryType: "unlock",
    createdAt: clock(),
    updatedAt: clock(),
    ...overrides,
  };
}

run("KRW 정수 금액 검증", () => {
  assert.equal(d.assertIntegerAmount(15000), 15000);
  assert.throws(() => d.assertIntegerAmount(10.5), /Amount must be an integer/);
  assert.throws(() => d.assertIntegerAmount(-1), /cannot be negative/);
});

run("무료·단건·월간·연간 상품 검증", () => {
  d.assertPricingConsistency({ pricingType: "free", billingCycle: "none", amount: 0 });
  d.assertPricingConsistency({ pricingType: "one_time", billingCycle: "none", amount: 1000 });
  d.assertPricingConsistency({
    pricingType: "subscription",
    billingCycle: "monthly",
    amount: 9900,
  });
  d.assertPricingConsistency({
    pricingType: "subscription",
    billingCycle: "annual",
    amount: 99000,
  });
  assert.throws(
    () => d.assertPricingConsistency({ pricingType: "free", billingCycle: "none", amount: 1 }),
    /Free products must have amount 0/,
  );
  assert.throws(
    () =>
      d.assertPricingConsistency({
        pricingType: "subscription",
        billingCycle: "none",
        amount: 1000,
      }),
    /Subscription requires monthly or annual/,
  );
});

run("서버 상품가격과 요청 금액 불일치 거부", () => {
  const store = d.createCommerceStore();
  assert.throws(
    () =>
      d.createOrder({
        store,
        orderId: "o1",
        userId: "u1",
        actorUserId: "u1",
        product: sampleProduct(),
        requestedAmount: 1,
        idempotencyKey: "idem-mismatch",
        clock,
      }),
    /does not match catalog price/,
  );
});

run("잘못된 상태전이 거부", () => {
  assert.throws(() => d.assertOrderTransition("cancelled", "paid"), /Cannot transition/);
  assert.throws(() => d.assertPaymentTransition("failed", "paid"), /Cannot transition/);
});

run("동일 idempotencyKey 중복 주문 방지", () => {
  const store = d.createCommerceStore();
  const a = d.createOrder({
    store,
    orderId: "o1",
    userId: "u1",
    actorUserId: "u1",
    product: sampleProduct(),
    requestedAmount: 15000,
    idempotencyKey: "idem-1",
    clock,
  });
  const b = d.createOrder({
    store,
    orderId: "o2",
    userId: "u1",
    actorUserId: "u1",
    product: sampleProduct(),
    requestedAmount: 15000,
    idempotencyKey: "idem-1",
    clock,
  });
  assert.equal(a.id, b.id);
  assert.equal(store.ordersById.size, 1);
});

run("동일 providerEventId 중복 webhook 처리 방지", () => {
  const store = d.createCommerceStore();
  const a = d.processWebhookEvent({
    store,
    eventId: "w1",
    provider: "noop",
    providerEventId: "evt_dup",
    orderId: "o1",
    summary: "paid",
    clock,
  });
  const b = d.processWebhookEvent({
    store,
    eventId: "w2",
    provider: "noop",
    providerEventId: "evt_dup",
    orderId: "o1",
    summary: "paid again",
    clock,
  });
  assert.equal(a.id, b.id);
  assert.equal(store.webhooksByProviderEvent.size, 1);
});

run("paid 이전 entitlement 지급 거부", () => {
  const store = d.createCommerceStore();
  const order = d.createOrder({
    store,
    orderId: "o-pending",
    userId: "u1",
    actorUserId: "u1",
    product: sampleProduct(),
    requestedAmount: 15000,
    idempotencyKey: "idem-pending",
    clock,
  });
  assert.throws(
    () =>
      d.grantEntitlementForPaidOrder({
        store,
        order,
        entitlementId: "e1",
        clock,
      }),
    /Entitlement requires paid order/,
  );
});

run("paid 후 entitlement 1회만 지급", () => {
  const store = d.createCommerceStore();
  const order = d.createOrder({
    store,
    orderId: "o-paid",
    userId: "u1",
    actorUserId: "u1",
    product: sampleProduct(),
    requestedAmount: 15000,
    idempotencyKey: "idem-paid",
    clock,
  });
  d.initiatePaymentAttempt({
    store,
    attemptId: "p1",
    orderId: order.id,
    provider: "noop",
    merchantOrderId: "m1",
    idempotencyKey: "pay-1",
    clock,
  });
  const first = d.completePaymentAttempt({
    store,
    idempotencyKey: "pay-1",
    providerTransactionId: "tx_1",
    clock,
  });
  const second = d.grantEntitlementForPaidOrder({
    store,
    order: first.order,
    entitlementId: "e-other",
    clock,
  });
  assert.equal(first.entitlement.id, second.id);
  assert.equal(store.entitlementsByOrder.size, 1);
});

run("refund 후 entitlement revoke", () => {
  const store = d.createCommerceStore();
  const order = d.createOrder({
    store,
    orderId: "o-ref",
    userId: "u1",
    actorUserId: "u1",
    product: sampleProduct(),
    requestedAmount: 15000,
    idempotencyKey: "idem-ref",
    clock,
  });
  d.initiatePaymentAttempt({
    store,
    attemptId: "p-ref",
    orderId: order.id,
    provider: "noop",
    merchantOrderId: "m-ref",
    idempotencyKey: "pay-ref",
    clock,
  });
  d.completePaymentAttempt({
    store,
    idempotencyKey: "pay-ref",
    providerTransactionId: "tx_ref",
    clock,
  });
  d.markOrderRefunded({ store, orderId: order.id, clock });
  const revoked = d.revokeEntitlementAfterRefund({ store, orderId: order.id, clock });
  assert.equal(revoked.status, "revoked");
});

run("다른 사용자의 주문·이용권 접근 거부", () => {
  const store = d.createCommerceStore();
  const order = d.createOrder({
    store,
    orderId: "o-own",
    userId: "u1",
    actorUserId: "u1",
    product: sampleProduct(),
    requestedAmount: 15000,
    idempotencyKey: "idem-own",
    clock,
  });
  assert.throws(() => d.assertCanReadOrder(order, "u2", false), /Cannot read another user/);
  assert.throws(
    () =>
      d.createOrder({
        store,
        orderId: "o-hack",
        userId: "u1",
        actorUserId: "u2",
        product: sampleProduct(),
        requestedAmount: 15000,
        idempotencyKey: "idem-hack",
        clock,
      }),
    /Cannot create order for another user/,
  );
});

run("민감 결제 필드 schema 거부", () => {
  assert.throws(
    () => d.assertNoForbiddenPaymentFields({ cardNumber: "FORBIDDEN_PAN_VALUE" }),
    /Sensitive payment fields/,
  );
  assert.throws(() => d.assertNoForbiddenPaymentFields({ cvc: "123" }), /Sensitive payment fields/);
});

if (process.exitCode) {
  process.exit(process.exitCode);
}
console.log("\nCommerce domain tests: all passed");
