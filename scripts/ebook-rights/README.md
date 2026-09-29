# Ebook publishing-rights gate

Fail-closed publication gate for SotongWare ebooks.

## Flow

1. Golden R2 manuscript (READ-ONLY)
2. `npm run ebook:rights:scan -- --registration <id> --workspace <EbookProjects/...>`
3. Human review of `artifacts/ebook-rights/...` evidence + tracked `records/*.rights.json`
4. Only after human clearance: set `reviewStatus=cleared` and mark all `openIssues[].resolved=true` with notes
5. `evaluateRightsPublicationGate` must PASS before security/publication approval

Automated scan **never** sets `cleared`.

## Commands

```bash
npm run ebook:rights:scan -- --registration ai-first-ebook-for-50s --workspace "C:/path/to/wi_plan_..."
npm run test:ebook:rights
```

## Privacy

Rights manifests/evidence are not imported by Next.js public catalog/Reader.

Private evidence lives under `scripts/ebook-rights/evidence/` (human attestation + source assessments). Do not import these into public catalog/Reader.

## Evidence completion

After official policy research + OWNER attestation (local only):

```bash
node scripts/ebook-rights/apply-evidence-completion.mjs
npm run test:ebook:rights
```

`reviewStatus=cleared` is allowed only when every blocking issue is resolved with evidence and no source/asset remains `unknown`. This is not a legal non-infringement warranty.
