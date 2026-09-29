/**
 * Run Golden ebook ingest → public catalog + private content package.
 *
 * Usage:
 *   node scripts/ebook-ingest/run-ingest.mjs --registration ai-first-ebook-for-50s --workspace <path>
 *
 * Private package is written under artifacts/ebook-private/ (gitignored, never imported by Next).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertNoInternalLeakInReaderBody,
  assertNoPremiumBodyInPublicCatalog,
  assertNoPublicAssetUrls,
  assertPrivateArtifactLocation,
  buildEbookCatalogItem,
  catalogItemToTsModule,
  privateArtifactPath,
} from "./lib/ingest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : "";
}

const regId = argValue("--registration") || "ai-first-ebook-for-50s";
const workspace = argValue("--workspace");
if (!workspace) {
  console.error("FAIL: --workspace <golden EbookProjects path> required");
  process.exit(2);
}

const regPath = join(__dirname, "registrations", `${regId}.json`);
const reg = JSON.parse(readFileSync(regPath, "utf8"));

const built = buildEbookCatalogItem(workspace, reg);
const { item, privatePackage, provenance } = built;

assertNoPublicAssetUrls(item);
assertNoPremiumBodyInPublicCatalog(item);
assertNoInternalLeakInReaderBody(item);

const outDir = join(repoRoot, "src", "data", "service-catalog", "generated");
mkdirSync(outDir, { recursive: true });
const tsPath = join(outDir, `${reg.slug}.catalog.ts`);
const provPath = join(outDir, `${reg.slug}.provenance.json`);
writeFileSync(tsPath, catalogItemToTsModule(item), "utf8");
// Ops-only sidecar (not imported by app). Prefer private package for full provenance.
writeFileSync(provPath, JSON.stringify(provenance, null, 2) + "\n", "utf8");

const privPath = privateArtifactPath(repoRoot, reg.slug, reg.finalRevision);
assertPrivateArtifactLocation(repoRoot, privPath);
mkdirSync(dirname(privPath), { recursive: true });
writeFileSync(privPath, JSON.stringify(privatePackage, null, 2) + "\n", "utf8");

if (privatePackage.chapters.length === 0 && reg.accessTier === "premium") {
  console.error("FAIL: premium product produced empty private package");
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      slug: item.slug,
      accessTier: item.accessTier,
      status: item.status,
      tocCount: built.tocCount,
      chapterCount: built.chapterCount,
      publicPageCount: built.publicPageCount,
      publicParagraphCount: built.publicParagraphCount,
      privateChapterCount: built.privateChapterCount,
      privateParagraphCount: built.privateParagraphCount,
      tsPath: tsPath.replace(repoRoot + "\\", "").replace(repoRoot + "/", ""),
      provenancePath: provPath.replace(repoRoot + "\\", "").replace(repoRoot + "/", ""),
      privatePath: privPath.replace(repoRoot + "\\", "").replace(repoRoot + "/", ""),
      pdfSha: provenance.sourcePdfSha256,
      epubSha: provenance.sourceEpubSha256,
    },
    null,
    2,
  ),
);
