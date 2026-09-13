/** Shared commerce types for Cloud Functions (Toss one-time KRW). */

export type CommerceProductDoc = {
  id: string;
  businessUnit: string;
  slug: string;
  title: string;
  summary?: string;
  productType: string;
  pricingType: "free" | "one_time" | "subscription";
  billingCycle: "none" | "monthly" | "annual";
  currency: "KRW";
  amount: number;
  status: "draft" | "review" | "published" | "suspended" | "archived";
  version: number;
  deliveryType: string;
};

export type OrderProductSnapshot = {
  productId: string;
  businessUnit: string;
  slug: string;
  title: string;
  productType: string;
  pricingType: string;
  billingCycle: string;
  currency: "KRW";
  amount: number;
  version: number;
  deliveryType: string;
};

export type CommerceOrderDoc = {
  id: string;
  userId: string;
  productSnapshot: OrderProductSnapshot;
  amount: number;
  currency: "KRW";
  status: "pending" | "paid" | "cancelled" | "refunded" | "expired";
  idempotencyKey: string;
  provider: "toss" | "mock";
  paymentAttemptId: string | null;
  paymentKeyMasked: string | null;
  paidAt: unknown | null;
  refundedAt: unknown | null;
  createdAt: unknown;
  updatedAt: unknown;
  needsReconciliation?: boolean;
};

export type PaymentAttemptDoc = {
  id: string;
  orderId: string;
  userId: string;
  provider: "toss" | "mock";
  providerTransactionId: string | null;
  paymentKeyMasked: string | null;
  merchantOrderId: string;
  amount: number;
  currency: "KRW";
  status: "initiated" | "authorized" | "paid" | "failed" | "cancelled" | "refunded";
  failureCode: string | null;
  failureMessage: string | null;
  idempotencyKey: string;
  needsReconciliation?: boolean;
  createdAt: unknown;
  updatedAt: unknown;
};

export type ProductEntitlementDoc = {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  accessLevel: "owned" | "subscribed" | "licensed";
  status: "active" | "revoked" | "expired";
  startsAt: unknown;
  expiresAt: null;
  createdAt: unknown;
  updatedAt: unknown;
  /** Canonical commerce entitlement — never client-writable */
  source: "commerce";
};

export type TossPaymentView = {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  method?: string;
  approvedAt?: string | null;
};

export type PrepareCheckoutInput = {
  productId: string;
  idempotencyKey: string;
  /** Ignored for pricing — accepted only to detect tampering */
  clientAmount?: unknown;
};

export type ConfirmPaymentInput = {
  orderId: string;
  paymentKey: string;
  amount: number;
};

export type RefundPaymentInput = {
  orderId: string;
  reason: string;
};
