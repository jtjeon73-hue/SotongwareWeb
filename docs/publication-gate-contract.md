# Publication Gate Contract (SotongwareWeb ↔ SotongWareControl)

## Purpose

The public website must only surface digital outcomes that passed full validation and explicit user approval in SotongWareControl. Sotong24Work generation alone never triggers public listing.

## Approval flow (target)

1. Sotong24Work completes production
2. Step validators PASS
3. Final outcome validation
4. Copyright, policy, and security review
5. User preview in SotongWareControl
6. User final publish approval
7. Homepage registration and deployment

## Eligibility (all required — fail-closed)

| Field | Required value |
|-------|----------------|
| `productionStatus` | `completed` |
| `validationStatus` | `passed` |
| `qualityStatus` | `approved` |
| `complianceStatus` | `approved` |
| `publicationStatus` | `published` |
| `userFinalApproval` | `true` |

Missing or unknown fields are treated as **not public**.

## Blocked publication statuses

`draft`, `generated`, `testing`, `awaiting_review`, `internal_validation`, `rejected`, `failed`, `cancelled`, `cancelled_preserved`, `archived_private`

## Homepage integration

- Filter: `src/lib/publication-eligibility.ts` → `isProductPublic()`
- Catalog: `getVisibleProducts()` in `src/lib/product-catalog.ts`
- Surfaces: Home featured/results, Products, Works, venture listings, search, sitemap, structured data

## Audit fields (future Control sync)

`productId`, `productType`, `instructionId`, `jobId`, `revision`, validation result, quality/compliance status, approver, approval timestamp, publish/unpublish timestamps, deploy URL/version.

## Product-type review criteria (documentation only)

- **Apps**: device testing, privacy, deployable build
- **E-books**: manuscript, cover, PDF/EPUB, citations, copyright
- **Music**: rights for audio, lyrics, images, platform policy
- **Video / content**: media rights, subtitles, safety and accuracy
- **Knowledge**: sources, accuracy, free/paid scope
- **Websites**: security, privacy, mobile, SEO, deployment
- **Industrial / smart-farm cases**: customer permission, confidentiality

These criteria are enforced in Control; the website only reads gate fields.
