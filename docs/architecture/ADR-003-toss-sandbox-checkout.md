# ADR-003: Toss Payments sandbox checkout & entitlement authority

## Status

Accepted for foundation (mock/emulator). Live Toss sandbox window NOT TESTED without merchant test keys.

## Context

Static Next.js export cannot host secret payment logic. Commerce mutations belong in Firebase Functions (Node.js 22). Membership Functions remain on a separate allowlist.

Official sources:
- https://docs.tosspayments.com/reference (confirm/cancel/retrieve)
- https://docs.tosspayments.com/guides/v2/webhook (PAYMENT_STATUS_CHANGED; no documented HMAC for general payment status)

## Decision

### Functions (cloud-omit by default)

| Name | Type | Notes |
|------|------|-------|
| prepareCommerceCheckout | callable | auth + active + published one_time KRW |
| confirmCommercePayment | callable | amount/order ownership + PG confirm + finalize |
| handleTossPaymentWebhook | HTTP | POST JSON; re-fetch payment with secret; idempotent |
| refundCommercePayment | callable | admin claim only; full cancel only |

Include in cloud only when `ALLOW_COMMERCE_FUNCTIONS=true` or Functions emulator.

### PG adapter

- Default: mock adapter (no network)
- Optional HTTP Toss adapter using `TOSS_SECRET_KEY` (never `NEXT_PUBLIC_*`)
- Block test/live key mode mix; refuse `live_` outside live mode

### Webhook authenticity

Do **not** invent HMAC headers. For `PAYMENT_STATUS_CHANGED`, verify by server-side GET `/v1/payments/{paymentKey}` with secret key, then compare orderId/amount/status before mutating.

### Entitlement authority

- **Canonical commerce purchase rights:** `users/{uid}/productEntitlements/{ent_orderId}` (`source: commerce`)
- **Canonical memberContents premium rights:** `users/{uid}/entitlements/{businessId}`
- Responsibilities are split; clients cannot write either path for privilege escalation.
- One-time product access checks `productEntitlements` only. Membership portal checks `entitlements` only.

### SDK

No npm Toss SDK added in this phase (mock-first). When real client keys exist, load official Toss Payments JS v2 per docs; record package/version here before production.

## Consequences

- Membership deploy script must continue rejecting commerce function names.
- Commerce deploy uses `scripts/deploy-commerce-functions.mjs` with separate allowlist + `COMMERCE_SECRETS_READY` gate.
- Query-string success URLs never mark paid; UI reads Firestore order status after server confirm.
