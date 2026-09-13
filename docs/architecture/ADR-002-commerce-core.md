# ADR-002: Shared commerce core (PG-neutral)

## Decision

Six business units share one commerce domain (Product / Order / PaymentAttempt / Entitlement / WebhookEvent). No per-unit payment stacks.

## Consequences

- Public catalog docs (`commerceProducts`) must not contain secrets or internal cost fields; use `commerceProductInternal` for admin-only data.
- Client writes to orders/payments/webhooks/productEntitlements are denied; Admin SDK / future commerce Functions own mutations.
- Membership Functions allowlist stays two names only until a separate commerce deploy gate is approved.
- Real PG API calls, fake card UI, and live payment claims are forbidden until PG selection + Secret Manager + webhook verification ship.


## Related

- Toss checkout: `docs/architecture/ADR-003-toss-sandbox-checkout.md`
