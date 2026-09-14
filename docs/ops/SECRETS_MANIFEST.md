# SotongWare Secrets Manifest (names only)

**All VALUE fields:** `<NOT STORED IN REPO>`

Do not paste real keys into git, chat, or this file.

---

## SotongwareWeb (`sotongware`)

| Name | Side | Required | Restore from |
|------|------|----------|--------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | client | required for Auth/SDK | Firebase Console → Web app |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | client | required | Firebase Console (usually `sotongware.firebaseapp.com`) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | client | required | `sotongware` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | client | required for full SDK | Firebase Console → Web app |
| `NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION` | client | optional (default `us-central1`) | project convention |
| `NEXT_PUBLIC_FIREBASE_USE_EMULATOR` | client | optional (local) | local `.env.local` |
| `NEXT_PUBLIC_AUTH_ALLOW_PROD` | client | optional flag | local policy |
| `NEXT_PUBLIC_AUTH_EMAIL_ENABLED` | client | optional flag | local policy |
| `NEXT_PUBLIC_AUTH_SIGNUP_ENABLED` | client | optional flag | local policy |
| `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED` | client | optional flag | local policy |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | client | optional | GA4 admin |
| `NEXT_PUBLIC_CONTACT_PRODUCTION_READY` | client | optional flag | ops decision |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | client | optional until real PG | Toss Dashboard |
| `NEXT_PUBLIC_COMMERCE_PG_MODE` | client | optional (`mock`/`test`/`live`) | ops |
| `NEXT_PUBLIC_COMMERCE_MOCK_CHECKOUT` | client | optional | local/ops |
| `GOOGLE_SITE_VERIFICATION` | server/build | optional | Search Console |
| `NAVER_SITE_VERIFICATION` | server/build | optional | Naver Search Advisor |
| `TOSS_SECRET_KEY` | server (Functions) | required for real Toss | Toss Dashboard → Secret Manager |
| `COMMERCE_PG_MODE` | server | optional | Functions env / secrets |
| `COMMERCE_ALLOWED_ORIGINS` | server | optional | Functions env |
| `ALLOW_COMMERCE_FUNCTIONS` | server | gate | Functions env |
| `COMMERCE_SECRETS_READY` | server | gate | Functions env |
| `ALLOW_CONTACT_FUNCTION` | server | gate | Functions env |
| `GCLOUD_PROJECT` / `FIREBASE_*_EMULATOR*` | local test | optional | emulator scripts |

Template file (empty values): `.env.example`

---

## SotongWareControl (`sotongware-control`)

| Name | Side | Required | Restore from |
|------|------|----------|--------------|
| `SOTONG24_RELAY_SECRET` | server (Functions secret) | required for relay | Secret Manager + `tool/set_relay_secret.example.ps1` flow |
| `STUDY_ADMIN_UIDS` | server | optional/admin | ops |
| `STUDY_AI_API_KEY` | server | optional | AI provider (if used) |
| `CONTROL_ADMIN_AUTH_EMAIL` | server/config | optional override | ops |
| `CONTROL_ADMIN_UID` | server/config | optional override | ops |
| `FIREBASE_TOOLS_ROOT` | local scripts | optional | local npm firebase-tools path |
| Flutter/Firebase client options | app | required for Control app runtime | FlutterFire / Console (`sotongware-control`) |

Do not commit Firebase service-account JSON or relay secret files.

---

## Sotong24Work

| Name | Side | Required | Restore from |
|------|------|----------|--------------|
| Relay URL + same `SOTONG24_RELAY_SECRET` | local agent config (outside git) | required for remote relay | Control ops docs + sealed local config |
| `SOTONG24_RUN_LIVE_TESTS` | local scripts | optional | docs (keep `0` for offline) |
| Build stamp macros | build | generated | `scripts/write_build_stamp.ps1` |

Agent credentials and machine-local paths under `%LOCALAPPDATA%\SotongWare\Sotong24Work\` are **not** in git; restore from offline backup if needed.

---

## Count summary

- Website env/secret **names** documented: ~25
- Control secret/env **names** documented: ~8 (+ FlutterFire config)
- Work local/relay **names** documented: ~3

All values: `<NOT STORED IN REPO>`
