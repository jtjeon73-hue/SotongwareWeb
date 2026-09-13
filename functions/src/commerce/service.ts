import { FieldValue, type Firestore } from "firebase-admin/firestore";
import {
  createSafeOrderId,
  hashIdempotency,
  type TossPaymentsAdapter,
} from "./adapter";
import { CommerceError, maskPaymentKey } from "./errors";
import type {
  CommerceOrderDoc,
  CommerceProductDoc,
  ConfirmPaymentInput,
  PaymentAttemptDoc,
  PrepareCheckoutInput,
  ProductEntitlementDoc,
  RefundPaymentInput,
  TossPaymentView,
} from "./types";

type UserProfileLite = { uid: string; status: string };

export type CommerceCollections = {
  products: string;
  orders: string;
  attempts: string;
  webhooks: string;
  users: string;
};

export const FIXTURE_ONE_TIME_PRODUCT: CommerceProductDoc = {
  id: "fixture_one_time_ebook",
  businessUnit: "ebook",
  slug: "fixture-one-time-ebook",
  title: "One-time ebook (fixture)",
  summary: "Emulator/mock fixture only",
  productType: "digital_download",
  pricingType: "one_time",
  billingCycle: "none",
  currency: "KRW",
  amount: 12000,
  status: "published",
  version: 1,
  deliveryType: "download",
};

export const DEFAULT_COLLECTIONS: CommerceCollections = {
  products: "commerceProducts",
  orders: "commerceOrders",
  attempts: "commercePaymentAttempts",
  webhooks: "commercePaymentWebhookEvents",
  users: "users",
};

/** Minimal store for unit tests + Firestore adapter. */
export interface CommerceStore {
  getUser(uid: string): Promise<UserProfileLite | null>;
  getProduct(productId: string): Promise<CommerceProductDoc | null>;
  findOrderByIdempotency(userId: string, idempotencyKey: string): Promise<CommerceOrderDoc | null>;
  getOrder(orderId: string): Promise<CommerceOrderDoc | null>;
  getAttempt(attemptId: string): Promise<PaymentAttemptDoc | null>;
  findAttemptByOrder(orderId: string): Promise<PaymentAttemptDoc | null>;
  getEntitlementByOrder(userId: string, orderId: string): Promise<ProductEntitlementDoc | null>;
  getWebhook(providerEventId: string): Promise<{ id: string; processStatus: string } | null>;
  createPendingCheckout(input: {
    order: Omit<CommerceOrderDoc, "createdAt" | "updatedAt" | "paidAt" | "refundedAt"> & {
      createdAt?: unknown;
      updatedAt?: unknown;
    };
    attempt: Omit<PaymentAttemptDoc, "createdAt" | "updatedAt"> & {
      createdAt?: unknown;
      updatedAt?: unknown;
    };
  }): Promise<void>;
  /** Atomic finalize paid + entitlement once */
  finalizePaid(input: {
    orderId: string;
    attemptId: string;
    paymentKey: string;
    providerTransactionId: string | null;
    view: TossPaymentView;
  }): Promise<{ order: CommerceOrderDoc; entitlement: ProductEntitlementDoc; created: boolean }>;
  markNeedsReconciliation(orderId: string, attemptId: string): Promise<void>;
  finalizeRefund(input: {
    orderId: string;
    attemptId: string;
  }): Promise<{ order: CommerceOrderDoc; entitlement: ProductEntitlementDoc | null }>;
  ensureFixtureProduct?(product: CommerceProductDoc): Promise<void>;
  saveWebhookEvent(input: {
    providerEventId: string;
    orderId: string | null;
    summary: string;
    processStatus: "received" | "processed" | "ignored" | "failed";
  }): Promise<{ duplicate: boolean }>;
}

function nowField(): FirebaseFirestore.FieldValue {
  return FieldValue.serverTimestamp();
}

function snapshotFromProduct(p: CommerceProductDoc) {
  return {
    productId: p.id,
    businessUnit: p.businessUnit,
    slug: p.slug,
    title: p.title,
    productType: p.productType,
    pricingType: p.pricingType,
    billingCycle: p.billingCycle,
    currency: p.currency,
    amount: p.amount,
    version: p.version,
    deliveryType: p.deliveryType,
  };
}

export function assertOneTimeKrwProduct(product: CommerceProductDoc): void {
  if (product.status !== "published") {
    throw new CommerceError("product/not-published", "구매할 수 없는 상품입니다.", "failed-precondition");
  }
  if (product.pricingType !== "one_time") {
    throw new CommerceError(
      "product/not-one-time",
      "이번 단계에서는 단건 결제만 지원합니다.",
      "failed-precondition",
    );
  }
  if (product.billingCycle !== "none") {
    throw new CommerceError("product/bad-cycle", "상품 결제 주기가 올바르지 않습니다.", "failed-precondition");
  }
  if (product.currency !== "KRW") {
    throw new CommerceError("product/currency", "원화 결제만 지원합니다.", "failed-precondition");
  }
  if (!Number.isInteger(product.amount) || product.amount <= 0) {
    throw new CommerceError("product/amount", "상품 금액이 올바르지 않습니다.", "failed-precondition");
  }
}

export class MemoryCommerceStore implements CommerceStore {
  users = new Map<string, UserProfileLite>();
  products = new Map<string, CommerceProductDoc>();
  orders = new Map<string, CommerceOrderDoc>();
  attempts = new Map<string, PaymentAttemptDoc>();
  entitlements = new Map<string, ProductEntitlementDoc>();
  webhooks = new Map<string, { id: string; processStatus: string }>();
  /** Simulate Firestore write failure after PG success */
  failNextFinalize = false;

  async getUser(uid: string) {
    return this.users.get(uid) ?? null;
  }
  async getProduct(productId: string) {
    return this.products.get(productId) ?? null;
  }
  async findOrderByIdempotency(userId: string, idempotencyKey: string) {
    for (const o of this.orders.values()) {
      if (o.userId === userId && o.idempotencyKey === idempotencyKey) return o;
    }
    return null;
  }
  async getOrder(orderId: string) {
    return this.orders.get(orderId) ?? null;
  }
  async getAttempt(attemptId: string) {
    return this.attempts.get(attemptId) ?? null;
  }
  async findAttemptByOrder(orderId: string) {
    for (const a of this.attempts.values()) {
      if (a.orderId === orderId) return a;
    }
    return null;
  }
  async getEntitlementByOrder(userId: string, orderId: string) {
    for (const e of this.entitlements.values()) {
      if (e.userId === userId && e.orderId === orderId) return e;
    }
    return null;
  }
  async getWebhook(providerEventId: string) {
    return this.webhooks.get(providerEventId) ?? null;
  }
  async createPendingCheckout(input: {
    order: Omit<CommerceOrderDoc, "createdAt" | "updatedAt" | "paidAt" | "refundedAt">;
    attempt: Omit<PaymentAttemptDoc, "createdAt" | "updatedAt">;
  }) {
    const ts = { seconds: Date.now() / 1000 } as unknown as FirebaseFirestore.Timestamp;
    this.orders.set(input.order.id, {
      ...input.order,
      createdAt: ts,
      updatedAt: ts,
      paidAt: null,
      refundedAt: null,
    });
    this.attempts.set(input.attempt.id, {
      ...input.attempt,
      createdAt: ts,
      updatedAt: ts,
    });
  }
  async finalizePaid(input: {
    orderId: string;
    attemptId: string;
    paymentKey: string;
    providerTransactionId: string | null;
    view: TossPaymentView;
  }) {
    if (this.failNextFinalize) {
      this.failNextFinalize = false;
      throw new CommerceError("store/finalize-failed", "주문 확정에 실패했습니다.", "internal");
    }
    const order = this.orders.get(input.orderId);
    const attempt = this.attempts.get(input.attemptId);
    if (!order || !attempt) {
      throw new CommerceError("store/missing", "주문을 찾을 수 없습니다.", "not-found");
    }
    if (order.status === "paid") {
      const ent = await this.getEntitlementByOrder(order.userId, order.id);
      if (!ent) throw new CommerceError("store/entitlement-missing", "이용권 상태가 올바르지 않습니다.");
      return { order, entitlement: ent, created: false };
    }
    if (order.status !== "pending") {
      throw new CommerceError("order/bad-status", "결제할 수 없는 주문 상태입니다.", "failed-precondition");
    }
    const ts = { seconds: Date.now() / 1000 } as unknown as FirebaseFirestore.Timestamp;
    order.status = "paid";
    order.paidAt = ts;
    order.updatedAt = ts;
    order.paymentKeyMasked = maskPaymentKey(input.paymentKey);
    order.needsReconciliation = false;
    attempt.status = "paid";
    attempt.paymentKeyMasked = maskPaymentKey(input.paymentKey);
    attempt.providerTransactionId = input.providerTransactionId;
    attempt.updatedAt = ts;
    attempt.needsReconciliation = false;
    const entId = `ent_${order.id}`;
    let ent = this.entitlements.get(entId);
    let created = false;
    if (!ent) {
      ent = {
        id: entId,
        userId: order.userId,
        productId: order.productSnapshot.productId,
        orderId: order.id,
        accessLevel: "owned",
        status: "active",
        startsAt: ts,
        expiresAt: null,
        createdAt: ts,
        updatedAt: ts,
        source: "commerce",
      };
      this.entitlements.set(entId, ent);
      created = true;
    }
    return { order, entitlement: ent, created };
  }
  async markNeedsReconciliation(orderId: string, attemptId: string) {
    const order = this.orders.get(orderId);
    const attempt = this.attempts.get(attemptId);
    if (order) {
      order.needsReconciliation = true;
    }
    if (attempt) {
      attempt.needsReconciliation = true;
    }
  }
  async finalizeRefund(input: { orderId: string; attemptId: string }) {
    const order = this.orders.get(input.orderId);
    const attempt = this.attempts.get(input.attemptId);
    if (!order || !attempt) {
      throw new CommerceError("store/missing", "주문을 찾을 수 없습니다.", "not-found");
    }
    if (order.status === "refunded") {
      const ent = await this.getEntitlementByOrder(order.userId, order.id);
      return { order, entitlement: ent };
    }
    if (order.status !== "paid") {
      throw new CommerceError("order/not-paid", "환불할 수 없는 주문입니다.", "failed-precondition");
    }
    const ts = { seconds: Date.now() / 1000 } as unknown as FirebaseFirestore.Timestamp;
    order.status = "refunded";
    order.refundedAt = ts;
    order.updatedAt = ts;
    attempt.status = "refunded";
    attempt.updatedAt = ts;
    const ent = await this.getEntitlementByOrder(order.userId, order.id);
    if (ent && ent.status === "active") {
      ent.status = "revoked";
      ent.updatedAt = ts;
    }
    return { order, entitlement: ent };
  }
  async ensureFixtureProduct(product: CommerceProductDoc) {
    this.products.set(product.id, product);
  }
  async saveWebhookEvent(input: {
    providerEventId: string;
    orderId: string | null;
    summary: string;
    processStatus: "received" | "processed" | "ignored" | "failed";
  }) {
    if (this.webhooks.has(input.providerEventId)) {
      return { duplicate: true };
    }
    this.webhooks.set(input.providerEventId, {
      id: input.providerEventId,
      processStatus: input.processStatus,
    });
    return { duplicate: false };
  }
}

export class FirestoreCommerceStore implements CommerceStore {
  // note: return casts keep Firestore spread inference aligned with CommerceStore
  constructor(
    private readonly db: Firestore,
    private readonly cols: CommerceCollections = DEFAULT_COLLECTIONS,
  ) {}

  async getUser(uid: string) {
    const snap = await this.db.collection(this.cols.users).doc(uid).get();
    if (!snap.exists) return null;
    const d = snap.data() || {};
    return { uid, status: String(d.status || "") };
  }

  async getProduct(productId: string) {
    const snap = await this.db.collection(this.cols.products).doc(productId).get();
    if (!snap.exists) return null;
    const d = snap.data() || {};
    return { id: productId, ...(d as Omit<CommerceProductDoc, "id">) };
  }

  async findOrderByIdempotency(userId: string, idempotencyKey: string) {
    const q = await this.db
      .collection(this.cols.orders)
      .where("userId", "==", userId)
      .where("idempotencyKey", "==", idempotencyKey)
      .limit(1)
      .get();
    if (q.empty) return null;
    const doc = q.docs[0];
    return { id: doc.id, ...(doc.data() as Omit<CommerceOrderDoc, "id">) };
  }

  async getOrder(orderId: string) {
    const snap = await this.db.collection(this.cols.orders).doc(orderId).get();
    if (!snap.exists) return null;
    return { id: orderId, ...(snap.data() as Omit<CommerceOrderDoc, "id">) };
  }

  async getAttempt(attemptId: string) {
    const snap = await this.db.collection(this.cols.attempts).doc(attemptId).get();
    if (!snap.exists) return null;
    return { id: attemptId, ...(snap.data() as Omit<PaymentAttemptDoc, "id">) };
  }

  async findAttemptByOrder(orderId: string) {
    const q = await this.db
      .collection(this.cols.attempts)
      .where("orderId", "==", orderId)
      .limit(1)
      .get();
    if (q.empty) return null;
    const doc = q.docs[0];
    return { id: doc.id, ...(doc.data() as Omit<PaymentAttemptDoc, "id">) };
  }

  async getEntitlementByOrder(userId: string, orderId: string) {
    const snap = await this.db
      .collection(this.cols.users)
      .doc(userId)
      .collection("productEntitlements")
      .doc(`ent_${orderId}`)
      .get();
    if (!snap.exists) return null;
    return { id: snap.id, ...(snap.data() as Omit<ProductEntitlementDoc, "id">) };
  }

  async getWebhook(providerEventId: string) {
    const snap = await this.db.collection(this.cols.webhooks).doc(providerEventId).get();
    if (!snap.exists) return null;
    const d = snap.data() || {};
    return { id: providerEventId, processStatus: String(d.processStatus || "") };
  }

  async createPendingCheckout(input: {
    order: Omit<CommerceOrderDoc, "createdAt" | "updatedAt" | "paidAt" | "refundedAt">;
    attempt: Omit<PaymentAttemptDoc, "createdAt" | "updatedAt">;
  }) {
    const batch = this.db.batch();
    const orderRef = this.db.collection(this.cols.orders).doc(input.order.id);
    const attemptRef = this.db.collection(this.cols.attempts).doc(input.attempt.id);
    batch.set(orderRef, {
      ...input.order,
      paidAt: null,
      refundedAt: null,
      createdAt: nowField(),
      updatedAt: nowField(),
    });
    batch.set(attemptRef, {
      ...input.attempt,
      createdAt: nowField(),
      updatedAt: nowField(),
    });
    await batch.commit();
  }

  async finalizePaid(input: {
    orderId: string;
    attemptId: string;
    paymentKey: string;
    providerTransactionId: string | null;
    view: TossPaymentView;
  }) {
    const orderRef = this.db.collection(this.cols.orders).doc(input.orderId);
    const attemptRef = this.db.collection(this.cols.attempts).doc(input.attemptId);
    return this.db.runTransaction(async (tx) => {
      const orderSnap = await tx.get(orderRef);
      const attemptSnap = await tx.get(attemptRef);
      if (!orderSnap.exists || !attemptSnap.exists) {
        throw new CommerceError("store/missing", "주문을 찾을 수 없습니다.", "not-found");
      }
      const order = { id: orderSnap.id, ...(orderSnap.data() as Omit<CommerceOrderDoc, "id">) };
      const entRef = this.db
        .collection(this.cols.users)
        .doc(order.userId)
        .collection("productEntitlements")
        .doc(`ent_${order.id}`);
      const entSnap = await tx.get(entRef);
      if (order.status === "paid") {
        if (!entSnap.exists) {
          throw new CommerceError("store/entitlement-missing", "이용권 상태가 올바르지 않습니다.");
        }
        return {
          order,
          entitlement: { id: entSnap.id, ...(entSnap.data() as Omit<ProductEntitlementDoc, "id">) },
          created: false,
        };
      }
      if (order.status !== "pending") {
        throw new CommerceError("order/bad-status", "결제할 수 없는 주문 상태입니다.", "failed-precondition");
      }
      tx.update(orderRef, {
        status: "paid",
        paidAt: nowField(),
        updatedAt: nowField(),
        paymentKeyMasked: maskPaymentKey(input.paymentKey),
        needsReconciliation: false,
      });
      tx.update(attemptRef, {
        status: "paid",
        updatedAt: nowField(),
        paymentKeyMasked: maskPaymentKey(input.paymentKey),
        providerTransactionId: input.providerTransactionId,
        needsReconciliation: false,
      });
      let created = false;
      if (!entSnap.exists) {
        created = true;
        tx.set(entRef, {
          userId: order.userId,
          productId: order.productSnapshot.productId,
          orderId: order.id,
          accessLevel: "owned",
          status: "active",
          startsAt: nowField(),
          expiresAt: null,
          createdAt: nowField(),
          updatedAt: nowField(),
          source: "commerce",
        });
      }
      const entitlement: ProductEntitlementDoc = entSnap.exists
        ? { id: entSnap.id, ...(entSnap.data() as Omit<ProductEntitlementDoc, "id">) }
        : {
            id: `ent_${order.id}`,
            userId: order.userId,
            productId: order.productSnapshot.productId,
            orderId: order.id,
            accessLevel: "owned",
            status: "active",
            startsAt: nowField(),
            expiresAt: null,
            createdAt: nowField(),
            updatedAt: nowField(),
            source: "commerce",
          };
      return {
        order: { ...order, status: "paid", paymentKeyMasked: maskPaymentKey(input.paymentKey) },
        entitlement,
        created,
      } as { order: CommerceOrderDoc; entitlement: ProductEntitlementDoc; created: boolean };
    });
  }

  async markNeedsReconciliation(orderId: string, attemptId: string) {
    const batch = this.db.batch();
    batch.set(
      this.db.collection(this.cols.orders).doc(orderId),
      { needsReconciliation: true, updatedAt: nowField() },
      { merge: true },
    );
    batch.set(
      this.db.collection(this.cols.attempts).doc(attemptId),
      { needsReconciliation: true, updatedAt: nowField() },
      { merge: true },
    );
    await batch.commit();
  }

  async finalizeRefund(input: { orderId: string; attemptId: string }) {
    const orderRef = this.db.collection(this.cols.orders).doc(input.orderId);
    const attemptRef = this.db.collection(this.cols.attempts).doc(input.attemptId);
    return this.db.runTransaction(async (tx) => {
      const orderSnap = await tx.get(orderRef);
      const attemptSnap = await tx.get(attemptRef);
      if (!orderSnap.exists || !attemptSnap.exists) {
        throw new CommerceError("store/missing", "주문을 찾을 수 없습니다.", "not-found");
      }
      const order = { id: orderSnap.id, ...(orderSnap.data() as Omit<CommerceOrderDoc, "id">) };
      const entRef = this.db
        .collection(this.cols.users)
        .doc(order.userId)
        .collection("productEntitlements")
        .doc(`ent_${order.id}`);
      const entSnap = await tx.get(entRef);
      if (order.status === "refunded") {
        return {
          order,
          entitlement: entSnap.exists
            ? { id: entSnap.id, ...(entSnap.data() as Omit<ProductEntitlementDoc, "id">) }
            : null,
        };
      }
      if (order.status !== "paid") {
        throw new CommerceError("order/not-paid", "환불할 수 없는 주문입니다.", "failed-precondition");
      }
      tx.update(orderRef, {
        status: "refunded",
        refundedAt: nowField(),
        updatedAt: nowField(),
      });
      tx.update(attemptRef, {
        status: "refunded",
        updatedAt: nowField(),
      });
      if (entSnap.exists && entSnap.data()?.status === "active") {
        tx.update(entRef, { status: "revoked", updatedAt: nowField() });
      }
      const entitlement: ProductEntitlementDoc | null = entSnap.exists
        ? {
            id: entSnap.id,
            ...(entSnap.data() as Omit<ProductEntitlementDoc, "id">),
            status: "revoked",
          }
        : null;
      return {
        order: { ...order, status: "refunded" },
        entitlement,
      } as { order: CommerceOrderDoc; entitlement: ProductEntitlementDoc | null };
    });
  }

  async ensureFixtureProduct(product: CommerceProductDoc) {
    await this.db.collection(this.cols.products).doc(product.id).set(product, { merge: true });
  }
  async saveWebhookEvent(input: {
    providerEventId: string;
    orderId: string | null;
    summary: string;
    processStatus: "received" | "processed" | "ignored" | "failed";
  }) {
    const ref = this.db.collection(this.cols.webhooks).doc(input.providerEventId);
    return this.db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (snap.exists) return { duplicate: true };
      tx.set(ref, {
        provider: "toss",
        providerEventId: input.providerEventId,
        orderId: input.orderId,
        processStatus: input.processStatus,
        summary: input.summary.slice(0, 200),
        createdAt: nowField(),
        updatedAt: nowField(),
      });
      return { duplicate: false };
    });
  }
}

export class CommerceCheckoutService {
  constructor(
    private readonly store: CommerceStore,
    private readonly adapter: TossPaymentsAdapter,
  ) {}

  async prepare(uid: string, input: PrepareCheckoutInput) {
    if (!uid) {
      throw new CommerceError("auth/required", "로그인이 필요합니다.", "unauthenticated");
    }
    if (typeof input.idempotencyKey !== "string" || input.idempotencyKey.length < 8) {
      throw new CommerceError("idempotency/invalid", "요청이 올바르지 않습니다.", "invalid-argument");
    }
    if (typeof input.productId !== "string" || !input.productId) {
      throw new CommerceError("product/id", "상품을 선택해 주세요.", "invalid-argument");
    }
    if (input.clientAmount !== undefined && input.clientAmount !== null) {
      // Detect client price tampering attempts without trusting the value
      if (typeof input.clientAmount === "number" && !Number.isInteger(input.clientAmount)) {
        throw new CommerceError("amount/not-integer", "결제 금액이 올바르지 않습니다.", "invalid-argument");
      }
    }

    const user = await this.store.getUser(uid);
    if (!user || user.status !== "active") {
      throw new CommerceError("user/inactive", "회원 상태를 확인해 주세요.", "failed-precondition");
    }

    const existing = await this.store.findOrderByIdempotency(uid, input.idempotencyKey);
    if (existing) {
      if (existing.productSnapshot.productId !== input.productId) {
        throw new CommerceError("idempotency/conflict", "중복 요청이 충돌했습니다.", "aborted");
      }
      return this.publicPrepareResult(existing);
    }

    if ((process.env.FUNCTIONS_EMULATOR === "true" || process.env.COMMERCE_PG_MODE === "mock" || !process.env.TOSS_SECRET_KEY) && input.productId === FIXTURE_ONE_TIME_PRODUCT.id) {
      if (this.store.ensureFixtureProduct) {
        await this.store.ensureFixtureProduct(FIXTURE_ONE_TIME_PRODUCT);
      }
    }
    const product = await this.store.getProduct(input.productId);
    if (!product) {
      throw new CommerceError("product/missing", "상품을 찾을 수 없습니다.", "not-found");
    }
    assertOneTimeKrwProduct(product);

    if (
      typeof input.clientAmount === "number" &&
      Number.isInteger(input.clientAmount) &&
      input.clientAmount !== product.amount
    ) {
      throw new CommerceError("amount/mismatch", "결제 금액이 일치하지 않습니다.", "invalid-argument");
    }

    const orderId = createSafeOrderId();
    const attemptId = `pay_${orderId}`;
    const provider = this.adapter.id === "mock" ? "mock" : "toss";
    await this.store.createPendingCheckout({
      order: {
        id: orderId,
        userId: uid,
        productSnapshot: snapshotFromProduct(product),
        amount: product.amount,
        currency: "KRW",
        status: "pending",
        idempotencyKey: input.idempotencyKey,
        provider,
        paymentAttemptId: attemptId,
        paymentKeyMasked: null,
      },
      attempt: {
        id: attemptId,
        orderId,
        userId: uid,
        provider,
        providerTransactionId: null,
        paymentKeyMasked: null,
        merchantOrderId: orderId,
        amount: product.amount,
        currency: "KRW",
        status: "initiated",
        failureCode: null,
        failureMessage: null,
        idempotencyKey: hashIdempotency(uid, input.idempotencyKey),
      },
    });
    const order = await this.store.getOrder(orderId);
    if (!order) throw new CommerceError("store/missing", "주문 생성에 실패했습니다.", "internal");
    return this.publicPrepareResult(order);
  }

  private publicPrepareResult(order: CommerceOrderDoc) {
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      orderName: order.productSnapshot.title,
      productId: order.productSnapshot.productId,
      status: order.status,
      provider: order.provider,
    };
  }

  async confirm(uid: string, input: ConfirmPaymentInput) {
    if (!uid) throw new CommerceError("auth/required", "로그인이 필요합니다.", "unauthenticated");
    if (!input.orderId || !input.paymentKey) {
      throw new CommerceError("confirm/params", "결제 정보가 올바르지 않습니다.", "invalid-argument");
    }
    if (!Number.isInteger(input.amount) || input.amount <= 0) {
      throw new CommerceError("amount/invalid", "결제 금액이 올바르지 않습니다.", "invalid-argument");
    }
    if (input.paymentKey.length > 200) {
      throw new CommerceError("paymentKey/invalid", "결제 정보가 올바르지 않습니다.", "invalid-argument");
    }

    const order = await this.store.getOrder(input.orderId);
    if (!order) throw new CommerceError("order/missing", "주문을 찾을 수 없습니다.", "not-found");
    if (order.userId !== uid) {
      throw new CommerceError("order/forbidden", "주문에 접근할 수 없습니다.", "permission-denied");
    }
    if (order.amount !== input.amount) {
      throw new CommerceError("amount/mismatch", "결제 금액이 일치하지 않습니다.", "invalid-argument");
    }

    const attempt = (await this.store.findAttemptByOrder(order.id)) || null;
    if (!attempt) throw new CommerceError("attempt/missing", "결제 시도를 찾을 수 없습니다.", "not-found");

    if (order.status === "paid") {
      const ent = await this.store.getEntitlementByOrder(uid, order.id);
      return {
        orderId: order.id,
        status: "paid" as const,
        entitlementId: ent?.id ?? null,
        duplicate: true,
      };
    }
    if (order.status !== "pending") {
      throw new CommerceError("order/bad-status", "결제할 수 없는 주문 상태입니다.", "failed-precondition");
    }

    let view: TossPaymentView;
    try {
      view = await this.adapter.confirm({
        paymentKey: input.paymentKey,
        orderId: order.id,
        amount: order.amount,
      });
    } catch (e) {
      if (e instanceof CommerceError) throw e;
      throw new CommerceError("pg/confirm-failed", "결제 승인에 실패했습니다.", "failed-precondition");
    }

    this.assertPaymentMatchesOrder(view, order);
    if (view.status !== "DONE") {
      throw new CommerceError("pg/not-done", "결제가 완료되지 않았습니다.", "failed-precondition");
    }

    return this.finalizeAfterProviderSuccess(order, attempt, view);
  }

  /**
   * Webhook / reconciliation path: never trust payload alone —
   * always re-fetch payment from provider (official Toss guidance).
   * Toss PAYMENT_STATUS_CHANGED does not document an HMAC signature header;
   * authenticity = server-side retrieve with secret key.
   */
  async handleProviderStatusEvent(input: {
    providerEventId: string;
    paymentKey: string;
    claimedOrderId: string | null;
    claimedStatus: string | null;
  }) {
    if (!input.providerEventId || input.providerEventId.length > 200) {
      throw new CommerceError("webhook/event-id", "잘못된 웹훅입니다.", "invalid-argument");
    }
    if (!input.paymentKey) {
      throw new CommerceError("webhook/payment-key", "잘못된 웹훅입니다.", "invalid-argument");
    }

    const saved = await this.store.saveWebhookEvent({
      providerEventId: input.providerEventId,
      orderId: input.claimedOrderId,
      summary: `status=${input.claimedStatus || "unknown"}`,
      processStatus: "received",
    });
    if (saved.duplicate) {
      return { duplicate: true, changed: false };
    }

    const view = await this.adapter.retrieveByPaymentKey(input.paymentKey);
    if (input.claimedOrderId && view.orderId !== input.claimedOrderId) {
      throw new CommerceError("webhook/order-mismatch", "웹훅 검증에 실패했습니다.", "failed-precondition");
    }
    if (input.claimedStatus && input.claimedStatus !== view.status) {
      throw new CommerceError("webhook/status-mismatch", "웹훅 검증에 실패했습니다.", "failed-precondition");
    }

    const order = await this.store.getOrder(view.orderId);
    if (!order) {
      return { duplicate: false, changed: false, ignored: true };
    }
    const attempt = await this.store.findAttemptByOrder(order.id);
    if (!attempt) {
      return { duplicate: false, changed: false, ignored: true };
    }

    if (view.status === "DONE") {
      this.assertPaymentMatchesOrder(view, order);
      await this.finalizeAfterProviderSuccess(order, attempt, view);
      return { duplicate: false, changed: true, status: "paid" as const };
    }
    if (view.status === "CANCELED" || view.status === "PARTIAL_CANCELED") {
      if (view.status === "PARTIAL_CANCELED") {
        throw new CommerceError(
          "refund/partial-unsupported",
          "부분 환불은 지원하지 않습니다.",
          "invalid-argument",
        );
      }
      if (order.status === "paid") {
        await this.store.finalizeRefund({ orderId: order.id, attemptId: attempt.id });
        return { duplicate: false, changed: true, status: "refunded" as const };
      }
    }
    return { duplicate: false, changed: false, ignored: true };
  }

  async refund(adminUid: string, isAdmin: boolean, input: RefundPaymentInput) {
    if (!adminUid || !isAdmin) {
      throw new CommerceError("admin/required", "권한이 없습니다.", "permission-denied");
    }
    if (!input.orderId || typeof input.reason !== "string" || input.reason.trim().length < 2) {
      throw new CommerceError("refund/params", "환불 요청이 올바르지 않습니다.", "invalid-argument");
    }
    const order = await this.store.getOrder(input.orderId);
    if (!order) throw new CommerceError("order/missing", "주문을 찾을 수 없습니다.", "not-found");
    if (order.status === "refunded") {
      return { orderId: order.id, status: "refunded" as const, duplicate: true };
    }
    if (order.status !== "paid") {
      throw new CommerceError("order/not-paid", "환불할 수 없는 주문입니다.", "failed-precondition");
    }
    const attempt = await this.store.findAttemptByOrder(order.id);
    if (!attempt?.paymentKeyMasked) {
      throw new CommerceError("attempt/missing-key", "결제 정보를 찾을 수 없습니다.", "failed-precondition");
    }
    // Prefer full paymentKey from providerTransactionId storage field when present
    const paymentKey = attempt.providerTransactionId;
    if (!paymentKey) {
      throw new CommerceError("attempt/missing-key", "결제 키를 찾을 수 없습니다.", "failed-precondition");
    }

    let view: TossPaymentView;
    try {
      view = await this.adapter.cancel({
        paymentKey,
        cancelReason: input.reason.trim().slice(0, 200),
      });
    } catch (e) {
      if (e instanceof CommerceError) throw e;
      throw new CommerceError("pg/cancel-failed", "환불에 실패했습니다.", "failed-precondition");
    }
    if (view.status !== "CANCELED") {
      throw new CommerceError("pg/not-canceled", "환불이 완료되지 않았습니다.", "failed-precondition");
    }
    try {
      await this.store.finalizeRefund({ orderId: order.id, attemptId: attempt.id });
    } catch (e) {
      await this.store.markNeedsReconciliation(order.id, attempt.id);
      throw e;
    }
    return { orderId: order.id, status: "refunded" as const, duplicate: false };
  }

  private assertPaymentMatchesOrder(view: TossPaymentView, order: CommerceOrderDoc) {
    if (view.orderId !== order.id) {
      throw new CommerceError("pg/order-mismatch", "주문 정보가 일치하지 않습니다.", "failed-precondition");
    }
    if (view.totalAmount !== order.amount) {
      throw new CommerceError("pg/amount-mismatch", "결제 금액이 일치하지 않습니다.", "failed-precondition");
    }
  }

  private async finalizeAfterProviderSuccess(
    order: CommerceOrderDoc,
    attempt: PaymentAttemptDoc,
    view: TossPaymentView,
  ) {
    try {
      const result = await this.store.finalizePaid({
        orderId: order.id,
        attemptId: attempt.id,
        paymentKey: view.paymentKey,
        providerTransactionId: view.paymentKey,
        view,
      });
      return {
        orderId: order.id,
        status: "paid" as const,
        entitlementId: result.entitlement.id,
        duplicate: !result.created && order.status === "paid",
      };
    } catch (e) {
      await this.store.markNeedsReconciliation(order.id, attempt.id);
      // Reconciliation path: webhook/retrieve can retry finalize
      if (e instanceof CommerceError && e.internalCode === "store/finalize-failed") {
        throw new CommerceError(
          "finalize/needs-reconciliation",
          "결제는 확인됐으나 주문 확정 중입니다. 잠시 후 구매내역을 확인해 주세요.",
          "aborted",
        );
      }
      throw e;
    }
  }
}
