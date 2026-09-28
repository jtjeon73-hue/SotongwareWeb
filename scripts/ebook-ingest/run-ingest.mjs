/**
 * Run Golden ebook ingest → generated catalog module (no absolute path in web runtime).
 *
 * Usage:
 *   node scripts/ebook-ingest/run-ingest.mjs --registration ai-first-ebook-for-50s --workspace <path>
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertNoInternalLeakInReaderBody,
  assertNoPublicAssetUrls,
  buildEbookCatalogItem,
  catalogItemToTsModule,
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

const { item, provenance, tocCount, chapterCount } = buildEbookCatalogItem(workspace, reg);
assertNoPublicAssetUrls(item);
assertNoInternalLeakInReaderBody(item);

const outDir = join(repoRoot, "src", "data", "service-catalog", "generated");
mkdirSync(outDir, { recursive: true });
const tsPath = join(outDir, `${reg.slug}.catalog.ts`);
const provPath = join(outDir, `${reg.slug}.provenance.json`);
writeFileSync(tsPath, catalogItemToTsModule(item, provenance), "utf8");
writeFileSync(provPath, JSON.stringify(provenance, null, 2) + "\n", "utf8");

const pageCount = item.chapters.reduce((n, ch) => n + ch.pages.length, 0);
const paraCount = item.chapters.reduce(
  (n, ch) => n + ch.pages.reduce((m, p) => m + p.paragraphs.length, 0),
  0,
);

console.log(
  JSON.stringify(
    {
      ok: true,
      slug: item.slug,
      accessTier: item.accessTier,
      status: item.status,
      tocCount,
      chapterCount,
      pageCount,
      paraCount,
      tsPath: tsPath.replace(repoRoot + "\\", "").replace(repoRoot + "/", ""),
      provenancePath: provPath.replace(repoRoot + "\\", "").replace(repoRoot + "/", ""),
      pdfSha: provenance.sourcePdfSha256,
      epubSha: provenance.sourceEpubSha256,
    },
    null,
    2,
  ),
);
