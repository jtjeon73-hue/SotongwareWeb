# Auth Phase 2A — Secure Membership Foundation

Status: blocker repair — server-owned identity/consent fields; pending → Free after validated consent.
Out of scope: Google login UI activation, Basic plan, PG, live Hosting deploy, account deletion execution.

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

## Policy versions

- `CURRENT_TERMS_VERSION` = `2026-09-11`
- `CURRENT_PRIVACY_VERSION` = `2026-09-11`
- Client may request these versions; server rejects arbitrary, previous, or empty values
- Client clocks are never stored for consent

## Legacy users (no live migration in this phase)

Existing production profiles are **not** modified by this change set until Functions/Rules are deployed.

Migration plan (future, separate change):

1. Leave existing `status=active` users as-is (grandfather).
2. Optionally map legacy `consentAt`/`policyVersion` → `terms*`/`privacy*` on next successful re-consent.
3. Do not auto-backdate consent timestamps.
4. Do not force pending on legacy actives in a silent migration.

## Client flags

- `NEXT_PUBLIC_FIREBASE_USE_EMULATOR=true` — Auth 9099 / Firestore 8080 / Functions 5001
- `NEXT_PUBLIC_AUTH_ALLOW_PROD=true` — allow local next-dev against live Auth (default off)
- `NEXT_PUBLIC_AUTH_SIGNUP_ENABLED=true` — UI/app soft gate only (not server security)
- `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true` — show Google button (default off)

## Safe deploy order (after gate PASS)

1. Deploy Functions (`provisionMemberProfile`, `ensureMyMemberProfile`)
2. Function smoke (emulator or controlled)
3. Deploy Firestore Rules
4. Rules negative tests
5. Confirm Auth Email/Password intent in Console (no silent change here)
6. Ship app with signup flag still off
7. Enable `NEXT_PUBLIC_AUTH_SIGNUP_ENABLED` only when ready
8. One test account: signup → active Free → login → verify email flow
9. Abort: flag off; keep Functions deployed if rolling Rules back

## Withdrawal

See `docs/auth-withdrawal-draft.md`. Execution deferred.

## Admin claims

Custom claim `{ role: "admin" }` only. Never email string compare. Never commit service account keys.
