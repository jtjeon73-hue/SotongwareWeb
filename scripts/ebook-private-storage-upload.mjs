/**
 * Private ebook Storage upload package builder (DRY-RUN only).
 *
 * Reads Phase 1 private-content.json, splits into canonical chapter objects,
 * writes local staging + contentAssets manifest. Never writes to Firebase.
 *
 * Usage:
 *   node scripts/ebook-private-storage-upload.mjs --dry-run \
 *     --product ai-first-ebook-for-50s --revision 2
 */
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const require = createRequire(import.meta.url);

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : "";
}

const dryRun = process.argv.includes("--dry-run") || !process.argv.includes("--upload");
const productId = argValue("--product") || "ai-first-ebook-for-50s";
const revision = Number(argValue("--revision") || 2);
const FREE_PREVIEW = new Set(["fm-01", "fm-02", "ch-01"]);
const EXPECTED_PDF =
  "ca2ecebe8667ccb67f5b6cd5515358781406b0ce65d157a01e3abc9adda28336";
const EXPECTED_EPUB =
  "147d9ccc15bea8c5917296498a5dc8cbc30f85c9df9210f3730abe09c5fde3e6";

if (!dryRun) {
  console.error("FAIL: live Storage upload is forbidden in this phase. Use --dry-run only.");
  process.exit(2);
}

const build = spawnSync("npm", ["run", "build"], {
  cwd: join(repoRoot, "functions"),
  encoding: "utf8",
  shell: true,
});
if (build.status !== 0) {
  console.error(build.stderr || build.stdout);
  process.exit(1);
}

const {
  canonicalEbookChapterObjectPath,
  EbookStoragePathError,
} = require(join(repoRoot, "functions", "lib", "ebook", "storage-path.js"));

const pkgPath = join(
  repoRoot,
  "artifacts",
  "ebook-private",
  productId,
  `r${revision}`,
  "private-content.json",
);
if (!existsSync(pkgPath)) {
  console.error(`FAIL: private package missing: ${pkgPath}`);
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const errors = [];

if ((pkg.productId || pkg.slug) !== productId) {
  errors.push(`productId_mismatch:${pkg.productId || pkg.slug}`);
}
if (Number(pkg.finalRevision) !== revision) {
  errors.push(`revision_mismatch:${pkg.finalRevision}`);
}

const chapters = Array.isArray(pkg.chapters) ? pkg.chapters : [];
const ids = new Set();
const premium = [];
for (const ch of chapters) {
  if (!ch?.id) {
    errors.push("chapter_missing_id");
    continue;
  }
  if (ids.has(ch.id)) errors.push(`duplicate_chapter:${ch.id}`);
  ids.add(ch.id);
  if (FREE_PREVIEW.has(ch.id)) {
    errors.push(`free_preview_in_private:${ch.id}`);
    continue;
  }
  if (ch.accessTier !== "premium") {
    errors.push(`non_premium_in_private:${ch.id}:${ch.accessTier}`);
    continue;
  }
  if (!Array.isArray(ch.pages) || ch.pages.length === 0) {
    errors.push(`empty_body:${ch.id}`);
    continue;
  }
  const paras = ch.pages.reduce((n, p) => n + (p.paragraphs || []).length, 0);
  if (paras === 0) errors.push(`empty_paragraphs:${ch.id}`);
  try {
    canonicalEbookChapterObjectPath(productId, revision, ch.id);
  } catch (e) {
    errors.push(`path_invalid:${ch.id}:${e instanceof Error ? e.message : e}`);
  }
  premium.push(ch);
}

if (premium.length !== 15 && productId === "ai-first-ebook-for-50s") {
  errors.push(`premium_count:${premium.length}!=15`);
}

const prov = pkg.provenance || {};
if (productId === "ai-first-ebook-for-50s") {
  if (prov.sourcePdfSha256 !== EXPECTED_PDF) errors.push("pdf_sha_mismatch");
  if (prov.sourceEpubSha256 !== EXPECTED_EPUB) errors.push("epub_sha_mismatch");
  if (prov.instructionId !== "wi_plan_1789914868666") errors.push("instructionId_mismatch");
}

if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors }, null, 2));
  process.exit(1);
}

const stagingRoot = join(
  repoRoot,
  "artifacts",
  "ebook-private-staging",
  productId,
  `r${revision}`,
  "chapters",
);
mkdirSync(stagingRoot, { recursive: true });

const assets = [];
const generatedAt = new Date().toISOString();

for (const ch of premium) {
  const objectPath = canonicalEbookChapterObjectPath(productId, revision, ch.id);
  // Stored object body — chapter only (no provenance/sibling chapters/paths).
  const objectBody = {
    id: ch.id,
    title: ch.title,
    accessTier: "premium",
    pages: ch.pages,
  };
  const json = JSON.stringify(objectBody);
  const contentHash = createHash("sha256").update(json).digest("hex");
  const localFile = join(stagingRoot, `${ch.id}.json`);
  writeFileSync(localFile, json + "\n", "utf8");
  assets.push({
    productId,
    revision,
    assetType: "ebook_chapter_json",
    chapterId: ch.id,
    storagePath: objectPath,
    contentHash,
    size: Buffer.byteLength(json, "utf8"),
    generatedAt,
    visibility: "private",
  });
}

const manifestDir = join(repoRoot, "artifacts", "ebook-content-assets", productId, `r${revision}`);
mkdirSync(manifestDir, { recursive: true });
const manifest = {
  schemaVersion: 1,
  productId,
  revision,
  generatedAt,
  dryRun: true,
  uploadedToFirebase: false,
  assetCount: assets.length,
  assets,
  provenance: {
    instructionId: prov.instructionId,
    finalRevision: prov.finalRevision ?? revision,
    sourcePdfSha256: prov.sourcePdfSha256,
    sourceEpubSha256: prov.sourceEpubSha256,
  },
  futureBinaries: {
    pdf: `private/ebooks/${productId}/r${revision}/files/book.pdf`,
    epub: `private/ebooks/${productId}/r${revision}/files/book.epub`,
    note: "Not uploaded in Phase 3. Public URL forbidden.",
  },
};
const manifestPath = join(manifestDir, "contentAssets.manifest.json");
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(
  JSON.stringify(
    {
      ok: true,
      dryRun: true,
      productId,
      revision,
      premiumChapterObjects: assets.length,
      freePreviewExcluded: [...FREE_PREVIEW],
      stagingRoot: stagingRoot.replace(repoRoot + "\\", "").replace(repoRoot + "/", ""),
      manifestPath: manifestPath.replace(repoRoot + "\\", "").replace(repoRoot + "/", ""),
      sampleStoragePath: assets[0]?.storagePath,
      uploadedToFirebase: false,
    },
    null,
    2,
  ),
);

void EbookStoragePathError;
