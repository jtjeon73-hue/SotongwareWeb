/**
 * PG-neutral commerce domain runtime (ESM).
 * Types live in src/types/commerce-core.ts — keep behaviors aligned.
 */

export const FORBIDDEN_PAYMENT_FIELDS = Object.freeze([
  "cardNumber",
  "card_number",
  "cvc",
  "cvv",
  "password",
  "accountPassword",
  "pan",
  "secret",
  "apiKey",
  "api_key",
  "privateKey",
]);

export class CommerceDomainError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "CommerceDomainError";
    this.code = code;
  }
}

export function assertIntegerAmount(amount, currency = "KRW") {
  if (typeof amount !== "number" || !Number.isInteger(amount) || !Number.isFinite(amount)) {
    throw new CommerceDomainError("amount/not-integer", "Amount must be an integer");
  }
  if (amount < 0) {
    throw new CommerceDomainError("amount/negative", "Amount cannot be negative");
  }
  if (currency === "KRW" && amount > 100_000_000) {
    throw new CommerceDomainError("amount/too-large", "Amount exceeds safety limit");
  }
  return amount;
}

export function assertNoForbiddenPaymentFields(payload) {
  for (const key of Object.keys(payload)) {
    const lower = key.toLowerCase();
    for (const bad of FORBIDDEN_PAYMENT_FIELDS) {
      if (
        lower === bad.toLowerCase() ||
        lower.includes("cardnumber") ||
        lower === "cvc" ||
        lower === "cvv"
      ) {
        throw new CommerceDomainError(
          "payload/forbidden-field",
          "Sensitive payment fields are not allowed",
        );
      }
    }
  }
}

export function assertPricingConsistency(input) {
  const amount = assertIntegerAmount(input.amount);
  if (input.pricingType === "free") {
    if (amount !== 0) {
      throw new CommerceDomainError("pricing/free-nonzero", "Free products must have amount 0");
    }
    if (input.billingCycle !== "none") {
      throw new CommerceDomainError("pricing/free-cycle", "Free products must use billingCycle none");
    }
    return;
  }
  if (input.pricingType === "one_time") {
    if (amount <= 0) {
      throw new CommerceDomainError("pricing/one-time-zero", "One-time products require amount > 0");
    }
    if (input.billingCycle !== "none") {
      throw new CommerceDomainError(
        "pricing/one-time-cycle",
        "One-time products must use billingCycle none",
      );
    }
    return;
  }
  if (input.pricingType === "subscription") {
    if (amount <= 0) {
      throw new CommerceDomainError("pricing/sub-zero", "Subscription products require amount > 0");
    }
    if (input.billingCycle !== "monthly" && input.billingCycle !== "annual") {
      throw new CommerceDomainError(
        "pricing/sub-cycle",
        "Subscription requires monthly or annual cycle",
      );
    }
  }
}

export function assertAmountMatchesProduct(requested, catalogAmount) {
  if (assertIntegerAmount(requested) !== assertIntegerAmount(catalogAmount)) {
    throw new CommerceDomainError(
      "amount/mismatch",
      "Requested amount does not match catalog price",
    );
  }
}

const ORDER_TRANSITIONS = {
  pending: ["paid", "cancelled", "expired"],
  paid: ["refunded"],
  cancelled: [],
  refunded: [],
  expired: [],
};

const PAYMENT_TRANSITIONS = {
  initiated: ["authorized", "paid", "failed", "cancelled"],
  authorized: ["paid", "failed", "cancelled"],
  paid: ["refunded"],
  failed: [],
  cancelled: [],
  refunded: [],
};

const ENTITLEMENT_TRANSITIONS = {
  active: ["revoked", "expired"],
  revoked: [],
  expired: [],
};

export function assertOrderTransition(from, to) {
  if (!(ORDER_TRANSITIONS[from] || []).includes(to)) {
    throw new CommerceDomainError(
      "order/invalid-transition",
      `Cannot transition order ${from} → ${to}`,
    );
  }
}

export function assertPaymentTransition(from, to) {
  if (!(PAYMENT_TRANSITIONS[from] || []).includes(to)) {
    throw new CommerceDomainError(
      "payment/invalid-transition",
      `Cannot transition payment ${from} → ${to}`,
    );
  }
}

export function assertEntitlementTransition(from, to) {
  if (!(ENTITLEMENT_TRANSITIONS[from] || []).includes(to)) {
    throw new CommerceDomainError(
      "entitlement/invalid-transition",
      `Cannot transition entitlement ${from} → ${to}`,
    );
  }
}

export function canGrantEntitlement(orderStatus) {
  return orderStatus === "paid";
}

function nowIso(clock) {
  return (clock || (() => new Date().toISOString()))();
}

function snapshotFromProduct(product) {
  return {
    productId: product.id,
    businessUnit: product.businessUnit,
    slug: product.slug,
    title: product.title,
    productType: product.productType,
    pricingType: product.pricingType,
    billingCycle: product.billingCycle,
    currency: product.currency,
    amount: product.amount,
    version: product.version,
    deliveryType: product.deliveryType,
  };
}

export function createCommerceStore() {
  return {
    ordersByIdempotency: new Map(),
    ordersById: new Map(),
    paymentsByIdempotency: new Map(),
    entitlementsByOrder: new Map(),
    webhooksByProviderEvent: new Map(),
  };
}

export function createOrder(input) {
  assertNoForbiddenPaymentFields({
    orderId: input.orderId,
    userId: input.userId,
    idempotencyKey: input.idempotencyKey,
  });
  if (input.actorUserId !== input.userId) {
    throw new CommerceDomainError("order/forbidden-user", "Cannot create order for another user");
  }
  if (input.product.status !== "published") {
    throw new CommerceDomainError("order/product-not-published", "Product is not purchasable");
  }
  assertPricingConsistency(input.product);
  assertAmountMatchesProduct(input.requestedAmount, input.product.amount);

  const existing = input.store.ordersByIdempotency.get(input.idempotencyKey);
  if (existing) {
    if (
      existing.userId !== input.userId ||
      existing.productSnapshot.productId !== input.product.id
    ) {
      throw new CommerceDomainError("order/idempotency-conflict", "Idempotency key already used");
    }
    return existing;
  }

  const ts = nowIso(input.clock);
  const order = {
    id: input.orderId,
    userId: input.userId,
    productSnapshot: snapshotFromProduct(input.product),
    amount: assertIntegerAmount(input.product.amount),
    currency: input.product.currency,
    status: "pending",
    idempotencyKey: input.idempotencyKey,
    createdAt: ts,
    updatedAt: ts,
    paidAt: null,
  };
  input.store.ordersByIdempotency.set(input.idempotencyKey, order);
  input.store.ordersById.set(order.id, order);
  return order;
}

export function markOrderPaid(input) {
  const order = input.store.ordersById.get(input.orderId);
  if (!order) throw new CommerceDomainError("order/not-found", "Order not found");
  assertOrderTransition(order.status, "paid");
  const ts = nowIso(input.clock);
  const next = { ...order, status: "paid", updatedAt: ts, paidAt: ts };
  input.store.ordersById.set(next.id, next);
  input.store.ordersByIdempotency.set(next.idempotencyKey, next);
  return next;
}

export function markOrderRefunded(input) {
  const order = input.store.ordersById.get(input.orderId);
  if (!order) throw new CommerceDomainError("order/not-found", "Order not found");
  assertOrderTransition(order.status, "refunded");
  const ts = nowIso(input.clock);
  const next = { ...order, status: "refunded", updatedAt: ts };
  input.store.ordersById.set(next.id, next);
  input.store.ordersByIdempotency.set(next.idempotencyKey, next);
  return next;
}

export function initiatePaymentAttempt(input) {
  const order = input.store.ordersById.get(input.orderId);
  if (!order) throw new CommerceDomainError("payment/order-missing", "Order not found");
  if (order.status !== "pending") {
    throw new CommerceDomainError("payment/order-not-pending", "Order is not pending");
  }
  const existing = input.store.paymentsByIdempotency.get(input.idempotencyKey);
  if (existing) return existing;

  const ts = nowIso(input.clock);
  const attempt = {
    id: input.attemptId,
    orderId: order.id,
    userId: order.userId,
    provider: input.provider,
    providerTransactionId: null,
    merchantOrderId: input.merchantOrderId,
    amount: order.amount,
    currency: order.currency,
    status: "initiated",
    failureCode: null,
    failureMessage: null,
    idempotencyKey: input.idempotencyKey,
    createdAt: ts,
    updatedAt: ts,
  };
  input.store.paymentsByIdempotency.set(input.idempotencyKey, attempt);
  return attempt;
}

export function grantEntitlementForPaidOrder(input) {
  if (!canGrantEntitlement(input.order.status)) {
    throw new CommerceDomainError("entitlement/not-paid", "Entitlement requires paid order");
  }
  const existing = input.store.entitlementsByOrder.get(input.order.id);
  if (existing) return existing;

  const ts = nowIso(input.clock);
  const accessLevel =
    input.order.productSnapshot.pricingType === "subscription" ? "subscribed" : "owned";
  const entitlement = {
    id: input.entitlementId,
    userId: input.order.userId,
    productId: input.order.productSnapshot.productId,
    orderId: input.order.id,
    accessLevel,
    status: "active",
    startsAt: ts,
    expiresAt: null,
    createdAt: ts,
    updatedAt: ts,
  };
  input.store.entitlementsByOrder.set(input.order.id, entitlement);
  return entitlement;
}

export function completePaymentAttempt(input) {
  const attempt = input.store.paymentsByIdempotency.get(input.idempotencyKey);
  if (!attempt) throw new CommerceDomainError("payment/not-found", "Payment attempt not found");
  assertPaymentTransition(attempt.status, "paid");
  const ts = nowIso(input.clock);
  const paidAttempt = {
    ...attempt,
    status: "paid",
    providerTransactionId: input.providerTransactionId,
    updatedAt: ts,
  };
  input.store.paymentsByIdempotency.set(input.idempotencyKey, paidAttempt);
  const order = markOrderPaid({ store: input.store, orderId: attempt.orderId, clock: input.clock });
  const entitlement = grantEntitlementForPaidOrder({
    store: input.store,
    order,
    entitlementId: `ent_${order.id}`,
    clock: input.clock,
  });
  return { attempt: paidAttempt, order, entitlement };
}

export function revokeEntitlementAfterRefund(input) {
  const entitlement = input.store.entitlementsByOrder.get(input.orderId);
  if (!entitlement) throw new CommerceDomainError("entitlement/not-found", "Entitlement not found");
  assertEntitlementTransition(entitlement.status, "revoked");
  const ts = nowIso(input.clock);
  const next = { ...entitlement, status: "revoked", updatedAt: ts };
  input.store.entitlementsByOrder.set(input.orderId, next);
  return next;
}

export function processWebhookEvent(input) {
  const existing = input.store.webhooksByProviderEvent.get(input.providerEventId);
  if (existing) return existing;
  const ts = nowIso(input.clock);
  const event = {
    id: input.eventId,
    provider: input.provider,
    providerEventId: input.providerEventId,
    orderId: input.orderId,
    processStatus: "received",
    summary: String(input.summary || "").slice(0, 200),
    createdAt: ts,
    updatedAt: ts,
  };
  input.store.webhooksByProviderEvent.set(input.providerEventId, event);
  return event;
}

export function assertCanReadOrder(order, actorUserId, isAdmin) {
  if (isAdmin) return;
  if (order.userId !== actorUserId) {
    throw new CommerceDomainError("order/forbidden-read", "Cannot read another user's order");
  }
}

export function assertCanReadEntitlement(entitlement, actorUserId, isAdmin) {
  if (isAdmin) return;
  if (entitlement.userId !== actorUserId) {
    throw new CommerceDomainError(
      "entitlement/forbidden-read",
      "Cannot read another user's entitlement",
    );
  }
}

export function createNoopPaymentProviderAdapter(id = "noop") {
  return {
    id,
    async createCheckoutSession(input) {
      assertIntegerAmount(input.amount);
      return { checkoutUrl: `https://example.invalid/checkout/${input.orderId}` };
    },
  };
}
