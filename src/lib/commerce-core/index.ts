/**
 * Typed facade for commerce-core.
 * Runtime implementation: ./domain.mjs (Node/Next ESM).
 */
export type {
  CommerceBillingCycle,
  CommerceBusinessUnit,
  CommerceCurrency,
  CommerceDeliveryType,
  CommerceOrder,
  CommercePricingType,
  CommerceProductPublic,
  CommerceProductStatus,
  CommerceProductType,
  OrderProductSnapshot,
  OrderStatus,
  PaymentAttempt,
  PaymentAttemptStatus,
  PaymentProviderAdapter,
  PaymentWebhookEvent,
  ProductEntitlement,
  ProductEntitlementStatus,
  WebhookProcessStatus,
} from "@/types/commerce-core";
export { FORBIDDEN_PAYMENT_FIELDS } from "@/types/commerce-core";

export {
  CommerceDomainError,
  assertIntegerAmount,
  assertNoForbiddenPaymentFields,
  assertPricingConsistency,
  assertAmountMatchesProduct,
  assertOrderTransition,
  assertPaymentTransition,
  assertEntitlementTransition,
  canGrantEntitlement,
  createCommerceStore,
  createOrder,
  markOrderPaid,
  markOrderRefunded,
  initiatePaymentAttempt,
  grantEntitlementForPaidOrder,
  completePaymentAttempt,
  revokeEntitlementAfterRefund,
  processWebhookEvent,
  assertCanReadOrder,
  assertCanReadEntitlement,
  createNoopPaymentProviderAdapter,
} from "./domain.mjs";
