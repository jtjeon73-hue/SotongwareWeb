# Account withdrawal draft (Auth Phase 2A)

Phase 2A ships UI boundary and design only. **No production deletion.**

## Required steps (future)

1. Re-authentication (recent login)
2. Firebase Auth account delete
3. Personal data erase or legal retention
4. Preserve orders / payments / audit logs
5. Irreversible confirmation copy
6. Failure recovery path

## Data classes

- Erasable profile fields: email display prefs, locale, consent metadata (subject to policy)
- Retain: payment records, invoices, security audit logs, fraud signals (as required by law)

## Failure recovery

- If Auth delete succeeds but Firestore purge fails: queue retry; do not leave orphan privileges elevated
- If Firestore purge succeeds but Auth delete fails: revoke session + mark `status=suspended` via Admin SDK

## UI

`/account/withdrawal` — disabled execute button + explanation.
