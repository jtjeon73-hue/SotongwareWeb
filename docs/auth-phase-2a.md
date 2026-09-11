# Auth Phase 2A — Secure Membership Foundation

Status: implemented foundation (email Auth + Free profile + Rules hardening).
Out of scope: Google login UI activation, Basic plan, PG, live Hosting deploy, account deletion execution.

## Security model

- Admin = Firebase Auth custom claim `role == admin` only (Rules + UI).
- Client cannot create `users/{uid}` documents.
- Client updates limited to safe fields: displayName, lastLoginAt, emailVerified, locale, consentAt, policyVersion, updatedAt, email.
- Privilege fields (`role`, `status`, `membershipGrade`, `provisionedBy`) are server-owned.
- Entitlements remain admin/server write only.
- Email verification never grants admin or paid rights.

## Provisioning

1. `provisionMemberProfile` — Auth `onCreate` trigger (idempotent Free/`member`).
2. `ensureMyMemberProfile` — authenticated callable recovery (idempotent; never elevates).

## Client flags

- `NEXT_PUBLIC_FIREBASE_USE_EMULATOR=true` — Auth 9099 / Firestore 8080 / Functions 5001
- `NEXT_PUBLIC_AUTH_ALLOW_PROD=true` — allow local next-dev against live Auth (default off)
- `NEXT_PUBLIC_AUTH_SIGNUP_ENABLED=true` — enable live signup button (default off; emulator always allows)
- `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true` — show Google button (default off in Phase 2A)

## Routes

- `/login`, `/signup`, `/forgot-password`
- `/verify-email`, `/account`, `/account/withdrawal` (UI boundary only)
- `/access-denied`
- `/preview/commerce*` mock preserved

## Withdrawal

See `docs/auth-withdrawal-draft.md`. Execution deferred.

## Admin claims runbook (manual)

Do not set admin by email string compare in the client.

1. Use Firebase Admin SDK / Console custom claims tooling outside this repo key storage.
2. Set `{ role: "admin" }` on the Auth user.
3. User must refresh ID token.
4. Never commit service account JSON to the repository.
