# Membership & Commerce Ops Contract (foundation)

Status: source/rules/tests only. Not a legal compliance certificate.
Before public signup or live payments: business registration, PG contract, and privacy policy legal review are required.

## Collected personal data (planned minimum)

| Data | Purpose | Writer |
|------|---------|--------|
| uid | account key | Auth / server |
| email | account identity / contact | Auth token → server |
| emailVerified | trust signal | Auth token → server |
| displayName | UI greeting | client (self) or server |
| locale | UI language | client (self) |
| role, status, membershipGrade | authorization | server only |
| terms/privacy versions + acceptance timestamps | consent record | server only |
| order/payment/entitlement records | fulfillment & legal retention | server only |

## Client-writable vs server-only

Client-writable (Rules allowlist): `locale`, `displayName` (max 80 chars).
Server-only: `uid`, `email`, `emailVerified`, `role`, `status`, `membershipGrade`, `plan`, `paymentStatus`, consent fields, entitlements, orders, payments, webhooks.

## Storage forbidden

Do not store: passwords, card PAN, CVC/CVV, bank account passwords, PG API secrets, raw webhook secrets, full payment payloads with sensitive fields.

## Log masking

Never log email, UID, ID tokens, secrets, card data, or full webhook bodies in customer-visible errors or routine logs. Prefer opaque codes (`sw/*`, domain codes).

## Withdrawal vs legal retention (next executable contract)

1. Add `withdrawal_requested` lifecycle on profile (server-only) without deleting Auth immediately.
2. Soft-close login / revoke refresh; keep `commerceOrders` / payment audit for statutory retention.
3. Delete or anonymize non-required profile fields after retention window; never cascade-delete paid order history by default.
4. Ops migration of production data is out of scope until approved.

Current statuses: `pending` | `active` | `suspended`. Withdrawal is not implemented yet — do not treat account delete as payment record purge.

## Order / payment / entitlement transitions

Order: pending → paid | cancelled | expired; paid → refunded.
PaymentAttempt: initiated → authorized | paid | failed | cancelled; authorized → paid | failed | cancelled; paid → refunded.
Entitlement: created only after paid; active → revoked | expired; refund → revoke.

Idempotency: order `idempotencyKey` and webhook `providerEventId` must be unique-safe.

## PG integration gates (future)

- Webhook signature verification is mandatory before state changes.
- PG secrets live in Secret Manager only; never in repo, client, or Firestore public docs.
- Membership deploy allowlist must NEVER include commerce Functions.
- Commerce deploy requires a separate approved allowlist.

## Privacy policy follow-ups (before launch)

Disclose: collected fields, purposes, retention for orders/payments, withdrawal path, PG processor identity, overseas transfer if any, contact for privacy requests.

## Incident stop order

1. Disable payment/checkout Functions (or feature flags) first.
2. Disable related Cloud Functions that mutate orders/entitlements.
3. Disable Auth providers / signup if credential abuse is involved.
4. Preserve audit logs and webhook receipts for investigation.

Admin authority is Auth custom claim `role=admin` only — never Firestore `users.role` alone.
