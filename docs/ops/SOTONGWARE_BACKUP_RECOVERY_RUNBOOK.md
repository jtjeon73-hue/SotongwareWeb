# SotongWare Backup & Recovery Runbook

> Purpose: after laptop loss/failure/replacement, restore the three core SotongWare repositories and rebuild from GitHub.
> Scope: **essential recovery baseline only**. Values of secrets are never stored here.

Last verified (local PC inventory + fresh clone): **2026-09-15**

---

## 1. Core repositories

| Repo | Local path (this PC) | GitHub origin | Firebase project |
|------|----------------------|---------------|------------------|
| Official website | `C:\Users\user\Documents\GitHub\SotongwareWeb` | `https://github.com/jtjeon73-hue/SotongwareWeb.git` | `sotongware` |
| Control (총관제) | `C:\Users\user\Documents\GitHub\SotongWareControl` | `https://github.com/jtjeon73-hue/SotongwareControl.git` | `sotongware-control` |
| Work (제작 에이전트) | `C:\Users\user\Documents\GitHub\Sotong24Work` | `https://github.com/jtjeon73-hue/Sotong24Work.git` | (local agent; relays to control) |

Public domains / hosting (website):

- https://sotongware.com
- https://sotongware.web.app
- Control hosting (reference): https://sotongware-control.web.app

---

## 2. Clone order (new PC)

```powershell
cd $env:USERPROFILE\Documents\GitHub
git clone https://github.com/jtjeon73-hue/SotongwareWeb.git
git clone https://github.com/jtjeon73-hue/SotongwareControl.git
git clone https://github.com/jtjeon73-hue/Sotong24Work.git
```

Notes:

- GitHub repo folder casing may normalize on Windows (`SotongwareControl` vs `SotongWareControl`). Use the clone directory Git creates.
- Prefer `main` branch for all three.
- Do **not** copy `.env` / secret files from chat logs. Recreate from password manager / Firebase Console / Secret Manager.

---

## 3. Development environment checklist

Install (versions observed on recovery baseline PC; exact patch may differ):

| Tool | Observed version |
|------|------------------|
| Windows | 10.0.26200 |
| Git | 2.52.0 |
| Node.js | 22.23.2 |
| npm | 11.13.0 |
| Python | 3.13.3 |
| Firebase CLI | 15.23.0 |
| Flutter | 3.44.4 (stable) |
| Dart | 3.12.2 |
| Java (OpenJDK) | 21.0.12 LTS |
| Visual Studio (vswhere) | 18.9.12112.369 |

Also typically needed for Work native builds:

- Visual Studio C++ / MSVC workload
- Windows SDK

---

## 4. Secrets / env names only

**VALUE policy for every row:** `<NOT STORED IN REPO>`

Full name-only table: [`SECRETS_MANIFEST.md`](./SECRETS_MANIFEST.md)

Recovery sources (where to re-enter, not values):

- Firebase Console → Project settings → Web app config (`sotongware`)
- Firebase Functions / Secret Manager (`sotongware`, `sotongware-control`)
- Toss Dashboard (test/live keys) — never commit
- Local password manager / offline sealed note (operator-owned)
- Control relay secret setter example: `SotongWareControl/tool/set_relay_secret.example.ps1` (does not contain values)

---

## 5. Build / test commands (no deploy)

### SotongwareWeb

```powershell
cd SotongwareWeb
npm install
npm --prefix functions install   # REQUIRED for Next typecheck (tsconfig includes functions/**)
npx tsc --noEmit                 # optional after functions install
npm run lint
npm run build
npm run test:i18n:parity
npm run test:header:layout
```

Fresh-clone note (2026-09-15): `npm install` alone then `npm run build` **fails** typecheck until `npm --prefix functions install` completes.

### SotongWareControl

```powershell
cd SotongwareControl   # or SotongWareControl
flutter pub get
flutter test
# Prefer a known subset first if full suite is long:
# flutter test test/commercial_catalog_coverage_test.dart
```

### Sotong24Work

```powershell
cd Sotong24Work
python scripts\cursor_safe\safe_repo_check.py
# Full native build via Visual Studio solution when needed:
# open Sotong24Work_1st.slnx  (MSVC) — Agent start/register/Golden WI: DO NOT run during recovery baseline
```

Read-only helpers live under `Sotong24Work/scripts/cursor_safe/`.

---

## 6. Official deploy procedures (document only — do not run during recovery baseline)

### Website (`sotongware`)

- Hosting only when intentionally releasing the public site:
  - `npm run deploy:hosting` (project `sotongware`)
- Do **not** casually deploy Functions / Rules / Auth.
- Refuse-unsafe scripts exist for broad `deploy:functions` / `deploy:all`.

### Control (`sotongware-control`)

- Use the official script only: `scripts/deploy_control.ps1`
- Never invent ad-hoc `firebase deploy` shortcuts for Control.
- Relay secret: `SOTONG24_RELAY_SECRET` via documented `firebase functions:secrets:set` flow (see Control docs) — **not** in this runbook as a value.

### Work

- No Firebase Hosting deploy for the agent binary.
- Do not auto-start Agent, register services, or execute Golden / WI during recovery validation.

---

## 7. Artifact backup policy (design — no bulk copy in this phase)

| Layer | What | Where |
|-------|------|--------|
| **A. GitHub** | Source, docs, contracts, small fixtures | Three remotes above |
| **B. Cloud Archive** | Large binaries & finals: APK/AAB, PDF/EPUB, images, video, music, review packages, provenance, R1/R2/R3, approved deliverables | Operator cloud archive (Drive/Storage/etc.) — **not configured by this doc** |
| **C. Offline Copy** | Same finals + sealed secret notes | External SSD (1 copy minimum) |

Preserve going forward:

- APK / AAB, PDF / EPUB, ebook originals
- App release artifacts, site deliverables
- Images, video, music
- Work instructions, user review packages, provenance
- Revision packages R1/R2/R3, final approved builds

This phase does **not** upload or move large trees.

---

## 8. New PC recovery checklist

1. Install Git, Node 22+, Flutter stable, Python 3, Firebase CLI, VS C++ (for Work).
2. Sign in to GitHub / Firebase CLI as the operator account (interactive; not scripted here).
3. Clone the three repos (section 2).
4. Recreate env/secrets from SECRETS_MANIFEST names only (section 4).
5. Run Web `npm install` + `npm --prefix functions install` + `lint` + `build`.
6. Run Control `flutter pub get` + a safe `flutter test`.
7. Run Work `safe_repo_check.py`; open MSVC solution only if native rebuild needed.
8. Confirm `git status` clean on each fresh clone before local WIP.
9. Only then consider Hosting/Control deploy using official procedures.
10. Run readiness script from Web: `node scripts/check-recovery-readiness.mjs`

---

## 9. Recovery completion criteria

PASS when:

- All three remotes clone successfully
- Web build succeeds after root + functions install
- Control `flutter pub get` + at least one test suite passes
- Work clone + read-only safe check passes
- Secrets names are documented; **no secret values** written into git
- Operator knows Cloud + Offline artifact policy

PARTIAL when remotes sync but local WIP on an existing PC is dirty (risk of losing unpushed work) — commit/push WIP separately before relying on that PC as sole copy.

---

## 10. Never do during recovery / incident

- `git reset --hard`, `git clean`, force push, interactive rebase of shared history
- Delete production Firebase data
- Enable Auth signup / live Toss payment casually
- Deploy Functions/Rules without gates
- Start Golden Run / WI / Agent registration as a “recovery test”
- Paste API keys into chat, tickets, or this repository
- Assume local dirty trees are backed up — they are not, until pushed or archived

---

## 11. Related files in this repo

- [`SECRETS_MANIFEST.md`](./SECRETS_MANIFEST.md) — env/secret **names**
- [`ARTIFACT_BACKUP_POLICY.md`](./ARTIFACT_BACKUP_POLICY.md) — what to keep where
- [`../../scripts/check-recovery-readiness.mjs`](../../scripts/check-recovery-readiness.mjs) — read-only status check
