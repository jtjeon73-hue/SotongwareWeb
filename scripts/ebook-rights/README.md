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
