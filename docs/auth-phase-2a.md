# Auth Phase 2A — Secure Membership Foundation

Status: membership Functions on Node.js 22; contact callable cloud-omitted.
Out of scope until separate approval: Hosting/Rules deploy, Auth provider re-enable, Google/Basic/PG.

## Field write authority

| Field | Writer |
|-------|--------|
| email, emailVerified | Server only (from Firebase Auth token) |
| role, status, membershipGrade, provisionedBy | Server only |
| termsVersion, termsAcceptedAt, privacyVersion, privacyAcceptedAt | Server only |
| consentAt, policyVersion | Server only (legacy mirrors of consent; not client-writable) |
| locale | Client self (Rules allowlist) |
| entitlements | Admin/server only |

Client `users` create is denied. Arbitrary field injection via set/merge/update is denied.

## Provisioning flow (pending → Free)

1. Auth account created
2. `provisionMemberProfile` (onCreate) creates **pending** profile — no fabricated consent
3. Authenticated `ensureMyMemberProfile` validates `termsVersion` + `privacyVersion` against server constants exactly
4. Server `FieldValue.serverTimestamp()` records acceptance
5. `status` becomes `active` (Free); member content stays fail-closed while `pending`

Callable binds all writes to `request.auth.uid`. Payload `uid` / `targetUid` mismatch → permission-denied.

## First cloud Functions deploy (allowlist)

**Include**

| Function | Limits |
|----------|--------|
| `ensureMyMemberProfile` | gen2 callable, us-central1, 256MiB, timeout 30s, minInstances 0, maxInstances 5, auth required |
| `provisionMemberProfile` | gen1 Auth onCreate, us-central1, 256MB, timeout 30s, minInstances 0, maxInstances 3, idempotent, no failurePolicy retry |

**Runtime:** Node.js **22** (`functions/package.json` `engines.node`). Gen1 Auth `onCreate` remains; Node.js 20 deprecation is addressed by this runtime.

**Exclude**

- `submitContactInquiry` — source preserved; `omit: true` on cloud unless `ALLOW_CONTACT_FUNCTION=true`. Emulator still loads it (`FUNCTIONS_EMULATOR`).
- Hosting, Firestore Rules/indexes, Storage

Safe commands (do not run without user approval for live deploy):

```bash
npm run deploy:functions:auth-membership:check
# after explicit approval only:
npm run deploy:functions:auth-membership -- --confirm-deploy
```

Legacy `npm run deploy:functions` / `deploy:all` refuse and exit non-zero.

Project guard: only `sotongware`. `sotongware-control` fails closed.

### App Check activation order (membership)

1. Configure Firebase App Check on the web app (reCAPTCHA Enterprise / Play Integrity as applicable).
2. Verify tokens in staging/emulator.
3. Then set `enforceAppCheck: true` on callables — **not before** step 1/2 (would break legitimate clients).
4. Contact callable requires App Check **before** any cloud deploy of that function.

## Contact Function follow-up (NOT implemented / NOT deployed)

Before any production deploy of `submitContactInquiry`:

- Firebase App Check enforced (`enforceAppCheck: true`) — deny without token
- Server-side IP or equivalent rate limit (not only email+subject 5-minute duplicate)
- Do not retain raw client IP long-term with personal data
- Block email/subject mutation spam bypass; global + per-identifier hourly quotas
- Keep payload/field length caps; minimize Firestore reads/writes
- maxInstances 3, timeout 30s, memory 256MiB, minInstances 0
- Idempotency for duplicates
- Negative tests: no App Check → DENY; over quota → DENY; bot/spam cases
- Emergency: delete/disable **only** the contact function if cost spikes

Current honeypot + weak duplicate check are **not** sufficient for cloud deploy.

## Cost operating baseline (document only — Billing UI not configured here)

- Monthly budget reference: **₩10,000**
- Alert thresholds: **₩1,000 / ₩5,000 / ₩9,000 / ₩10,000**
- Budget alerts are **notifications (soft)**, not a hard spend cap
- On anomaly: manually stop Functions (`deploy` script reverse / Console delete)
- Keep minInstances=0; keep membership maxInstances caps
- Check daily usage early after first deploy
- Periodically prune Artifact Registry images

## Policy versions

- `CURRENT_TERMS_VERSION` = `2026-09-11`
- `CURRENT_PRIVACY_VERSION` = `2026-09-11`

## Legacy users

No live migration in this phase. Grandfather existing `status=active` until separate work.

## Client flags

- `NEXT_PUBLIC_FIREBASE_USE_EMULATOR=true`
- `NEXT_PUBLIC_AUTH_ALLOW_PROD=true`
- `NEXT_PUBLIC_AUTH_SIGNUP_ENABLED=true` (soft gate only)
- `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true`

## Safe overall order (after Blaze — separate approval)

1. Cost alerts configured (soft)
2. Blaze upgrade (separate approval)
3. Membership Functions-only via allowlist script
4. Function health/logs
5. Hosting preview with new client
6. Hosting live (approval) then Rules (never Rules-before compatible Hosting)
7. Negative Rules tests
8. Email/Password only if approved
9. One test account
10. Google last

### Abort / rollback

- Functions: delete membership functions → back to 0
- Rules: restore previous ruleset in Console
- Hosting: previous release
- Providers: keep disabled until ready
- Contact: never deploy until security follow-up PASS

## Withdrawal

See `docs/auth-withdrawal-draft.md`. Execution deferred.

## Admin claims

Custom claim `{ role: "admin" }` only. Never email string compare. Never commit service account keys.


## Related

- Membership/commerce ops contract: `docs/membership-commerce-ops-contract.md`
- Commerce ADR: `docs/architecture/ADR-002-commerce-core.md`
