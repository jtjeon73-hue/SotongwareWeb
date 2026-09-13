# ADR-003: Toss Payments sandbox checkout & entitlement authority

## Status

Accepted for mock + real Toss sandbox window connection (manual sandbox E2E may remain NOT TESTED).

## Context

Static Next.js export cannot host secret payment logic. Commerce mutations belong in Firebase Functions (Node.js 22). Membership Functions remain on a separate allowlist.

Official sources:
- https://docs.tosspayments.com/
- https://docs.tosspayments.com/guides/v2/payment-widget/integration-window
- https://docs.tosspayments.com/reference (confirm/cancel/retrieve)
- https://docs.tosspayments.com/guides/v2/webhook (PAYMENT_STATUS_CHANGED; no documented HMAC for general payment status)

## Decision

### Functions (cloud-omit by default)

| Name | Type | Notes |
|------|------|-------|
| prepareCommerceCheckout | callable | auth + active + published one_time KRW; returns server customerKey + pgMode |
| confirmCommercePayment | callable | amount/order ownership + PG confirm + finalize |
| handleTossPaymentWebhook | HTTP | POST JSON; re-fetch payment with secret; idempotent |
| refundCommercePayment | callable | admin claim only; full cancel only |

Include in cloud only when `ALLOW_COMMERCE_FUNCTIONS=true` or Functions emulator.

### PG modes (explicit; Emulator != mock)

| Mode | Client | Server | Notes |
|------|--------|--------|-------|
| mock | Mock confirm | MockTossAdapter | No Toss network; auto tests / Emulator default when unset |
| test | Toss SDK v2 window | HttpTossAdapter + test secret | Real sandbox; fail-closed without test keys |
| live | refused | refused | Always fail-closed in this phase |

`COMMERCE_PG_MODE=test` on Emulator uses real Toss sandbox window + test confirm API.

### SDK (browser)

- npm: `@tosspayments/tosspayments-sdk@2.8.1`
- Flow: `loadTossPayments` -> `widgets({ customerKey })` -> `setAmount` -> `renderPaymentWindow` -> `requestPayment` (공식 결제창형)
- Use 주문서형·결제창형 key family only; never mix API 개별 연동 keys
- Client key only in browser (`NEXT_PUBLIC_TOSS_CLIENT_KEY`); secret only in Functions (`TOSS_SECRET_KEY`)
- Live keys rejected on all paths

### customerKey

- Server-generated random stable id (`ck_…`), stored as `users/{uid}.tossCustomerKey` (Admin SDK only)
- Never Firebase UID / email / phone; client cannot mutate field (Rules)

### Webhook authenticity

Do **not** invent HMAC headers. For `PAYMENT_STATUS_CHANGED`, verify by server-side GET `/v1/payments/{paymentKey}` with secret key, then compare orderId/amount/status before mutating.

### Entitlement authority

- **Canonical commerce purchase rights:** `users/{uid}/productEntitlements/{ent_orderId}` (`source: commerce`)
- **Canonical memberContents premium rights:** `users/{uid}/entitlements/{businessId}`
- One-time product access checks `productEntitlements` only.

## Consequences

- Membership deploy script must continue rejecting commerce function names.
- Commerce deploy uses `scripts/deploy-commerce-functions.mjs` with separate allowlist + `COMMERCE_SECRETS_READY` gate.
- Query-string success URLs never mark paid; UI calls confirm then reads Firestore.
- Production Hosting build blocks mock/test checkout surfaces.
