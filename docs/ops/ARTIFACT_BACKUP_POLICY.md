# Artifact Backup Policy

Three-layer protection. This phase documents policy only — no bulk upload/move.

## A. GitHub (source of truth for code)

- SotongwareWeb / SotongWareControl / Sotong24Work remotes
- Docs, contracts, small fixtures, runbooks
- **Not** for multi‑hundred‑MB media trees or signed release binaries

## B. Cloud Archive (finals & large binaries)

Store under an operator-owned archive (Firebase Storage bucket, Drive, NAS cloud, etc.):

- APK / AAB
- PDF / EPUB / ebook source packages
- Site deliverable zips
- Images, video, music masters
- Work instruction packages
- User review packages
- Provenance / hash manifests
- R1 / R2 / R3 revision bundles
- Final approved customer deliverables

Naming suggestion: `{business}/{product}/{yyyy-mm-dd}/{sha-or-version}/`

## C. Offline Copy

- External SSD (minimum one independent copy)
- Include sealed secrets note (password manager export or encrypted vault) — **never** plain-text in GitHub
- Refresh after each Golden Run / major release

## Retention

- Keep last approved + previous approved for each product line
- Keep provenance with the binary it attests

## Out of scope for this baseline task

- Automated sync jobs
- Deleting local WIP
- Changing Firebase production objects
