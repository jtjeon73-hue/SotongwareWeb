# Ebook catalog ingest (Golden → EbookCatalogItem)

Offline adapter that converts an approved Sotong24Work ebook workspace
(`publish/revisions/rN/manuscript` + evidence) into a homepage
`EbookCatalogItem` **without** exposing PDF/EPUB public URLs.

## Flow

1. Edit registration policy: `registrations/<id>.json`
   - `accessTier` / `status` / `priceNote` are operator-owned defaults
2. Run ingest (build machine only; path is CLI arg, never baked into web runtime):

```bash
npm run ebook:ingest -- --registration ai-first-ebook-for-50s --workspace "<EbookProjects/wi_...>"
```

3. Generated artifacts (committed):
   - `src/data/service-catalog/generated/<slug>.catalog.ts`
   - `src/data/service-catalog/generated/<slug>.provenance.json`
4. `src/data/service-catalog/ebooks.ts` merges fixtures + generated entries

## Tests

```bash
npm run test:ebook:ingest
```

## Rules

- Authoritative revision only (default R2)
- Fail-closed on SHA / approval / release_ready mismatch
- Reader body must not contain STEP/validator/path/SHA ops noise
- No Firebase Storage upload in this pipeline
