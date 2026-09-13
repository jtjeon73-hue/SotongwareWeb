/**
 * Authoritative commerce-core domain types (PG-neutral).
 * Marketing SotongProduct catalog remains separate; this models sellable commerce records.
 */

export type CommerceBusinessUnit =
  | "automation"
  | "app"
  | "ebook"
  | "knowledge"
  | "marketing"
  | "content";

export type CommerceProductType =
  | "digital_download"
  | "web_service"
  | "app"
  | "content"
  | "education"
  | "automation";

export type CommercePricingType = "free" | "one_time" | "subscription";
export type CommerceBillingCycle = "none" | "monthly" | "annual";
export type CommerceCurrency = "KRW";

export type CommerceProductStatus =
  | "draft"
  | "review"
  | "published"
  | "suspended"
  | "archived";

export type CommerceDeliveryType =
  | "download"
  | "unlock"
  | "license"
  | "service_access"
  | "manual";

/** Public catalog document — never mix secrets/internal fields here */
export interface CommerceProductPublic {
  id: string;
  businessUnit: CommerceBusinessUnit;
  slug: string;
  title: string;
  summary: string;
  productType: CommerceProductType;
  pricingType: CommercePricingType;
  billingCycle: CommerceBillingCycle;
  currency: CommerceCurrency;
  /** Integer minor units for KRW = won */
  amount: number;
  status: CommerceProductStatus;
  version: number;
  deliveryType: CommerceDeliveryType;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded" | "expired";

export interface OrderProductSnapshot {
  productId: string;
  businessUnit: CommerceBusinessUnit;
  slug: string;
  title: string;
  productType: CommerceProductType;
  pricingType: CommercePricingType;
  billingCycle: CommerceBillingCycle;
  currency: CommerceCurrency;
  amount: number;
  version: number;
  deliveryType: CommerceDeliveryType;
}

export interface CommerceOrder {
  id: string;
  userId: string;
  productSnapshot: OrderProductSnapshot;
  amount: number;
  currency: CommerceCurrency;
  status: OrderStatus;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
}

export type PaymentAttemptStatus =
  | "initiated"
  | "authorized"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export interface PaymentAttempt {
  id: string;
  orderId: string;
  userId: string;
  provider: string;
  providerTransactionId: string | null;
  merchantOrderId: string;
  amount: number;
  currency: CommerceCurrency;
  status: PaymentAttemptStatus;
  /** Internal machine code — never show raw to customers */
  failureCode: string | null;
  /** Customer-safe message */
  failureMessage: string | null;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductEntitlementStatus = "active" | "revoked" | "expired";

export interface ProductEntitlement {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  accessLevel: "owned" | "subscribed" | "licensed";
  status: ProductEntitlementStatus;
  startsAt: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type WebhookProcessStatus = "received" | "processed" | "ignored" | "failed";

export interface PaymentWebhookEvent {
  id: string;
  provider: string;
  providerEventId: string;
  orderId: string | null;
  processStatus: WebhookProcessStatus;
  /** Minimal audit — never store full PAN/CVC or raw secrets */
  summary: string;
  createdAt: string;
  updatedAt: string;
}

/** Forbidden field names that must never appear on payment/order payloads */
export const FORBIDDEN_PAYMENT_FIELDS = [
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
] as const;

export type PaymentProviderAdapter = {
  readonly id: string;
  /** Placeholder — real PG calls forbidden in this phase */
  createCheckoutSession(input: {
    orderId: string;
    amount: number;
    currency: CommerceCurrency;
  }): Promise<{ checkoutUrl: string }>;
};
