/**
 * Package Golden R2 PDF/EPUB into private binary staging (READ-ONLY source).
 * Never copies into public/ or next out/. Never uploads to Firebase.
 *
 * Usage:
 *   node scripts/ebook-private-binary-package.mjs --dry-run \
 *     --product ai-first-ebook-for-50s --revision 2
 */
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import {
  EXPECTED_EPUB_SHA,
  EXPECTED_GOLDEN_PRODUCT_ID,
  EXPECTED_GOLDEN_REVISION,
  EXPECTED_INSTRUCTION_ID,
  EXPECTED_PDF_SHA,
} from "./lib/ebook-private-upload-core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const require = createRequire(import.meta.url);

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : "";
}

const dryRun = !process.argv.includes("--upload");
const productId = argValue("--product") || EXPECTED_GOLDEN_PRODUCT_ID;
const revision = Number(argValue("--revision") || EXPECTED_GOLDEN_REVISION);
const goldenRoot =
  argValue("--golden-root") ||
  process.env.GOLDEN_EBOOK_ROOT ||
  join(
    "C:",
    "Users",
    "user",
    "Documents",
    "Sotong24Work",
    "EbookProjects",
    EXPECTED_INSTRUCTION_ID,
  );

if (!dryRun) {
  console.error(
    JSON.stringify({
      ok: false,
      code: "firebase_binary_upload_forbidden",
      message: "Binary Storage upload is forbidden in this phase. Use --dry-run only.",
    }),
  );
  process.exit(2);
}

if (productId !== EXPECTED_GOLDEN_PRODUCT_ID || revision !== EXPECTED_GOLDEN_REVISION) {
  console.error(
    JSON.stringify({
      ok: false,
      errors: [`wrong_product_or_revision:${productId}:r${revision}`],
    }),
  );
  process.exit(1);
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

const { canonicalEbookBinaryObjectPath } = require(
  join(repoRoot, "functions", "lib", "ebook", "storage-path.js"),
);

const r2Dir = join(goldenRoot, "publish", "revisions", `r${revision}`);
const pdfSrc = join(r2Dir, "book.pdf");
const epubSrc = join(r2Dir, "book.epub");

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

const errors = [];
if (!existsSync(pdfSrc)) errors.push(`pdf_missing:${pdfSrc}`);
if (!existsSync(epubSrc)) errors.push(`epub_missing:${epubSrc}`);
if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors }, null, 2));
  process.exit(1);
}

const pdfSha = sha256File(pdfSrc);
const epubSha = sha256File(epubSrc);
if (pdfSha !== EXPECTED_PDF_SHA) errors.push(`pdf_sha_mismatch:${pdfSha}`);
if (epubSha !== EXPECTED_EPUB_SHA) errors.push(`epub_sha_mismatch:${epubSha}`);

const pdfPath = canonicalEbookBinaryObjectPath(productId, revision, "book.pdf");
const epubPath = canonicalEbookBinaryObjectPath(productId, revision, "book.epub");
if (!pdfPath.includes("/binaries/") || !epubPath.includes("/binaries/")) {
  errors.push("canonical_path_not_binaries");
}
if (pdfPath.includes("..") || epubPath.includes("..")) errors.push("traversal");

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
  "binaries",
);
mkdirSync(stagingRoot, { recursive: true });
const pdfDest = join(stagingRoot, "book.pdf");
const epubDest = join(stagingRoot, "book.epub");
copyFileSync(pdfSrc, pdfDest);
copyFileSync(epubSrc, epubDest);

// Guard: never under public/ or out/
const publicHits = [pdfDest, epubDest].filter(
  (p) =>
    resolve(p).toLowerCase().includes(`${resolve(repoRoot, "public").toLowerCase()}`) ||
    resolve(p).toLowerCase().includes(`${resolve(repoRoot, "out").toLowerCase()}`),
);
if (publicHits.length) {
  console.error(JSON.stringify({ ok: false, errors: ["public_copy_forbidden"] }));
  process.exit(1);
}

const generatedAt = new Date().toISOString();
const assets = [
  {
    productId,
    revision,
    assetType: "ebook_pdf",
    storagePath: pdfPath,
    sha256: pdfSha,
    size: readFileSync(pdfDest).length,
    contentType: "application/pdf",
    generatedAt,
    visibility: "private",
    source: "golden_r2_readonly",
  },
  {
    productId,
    revision,
    assetType: "ebook_epub",
    storagePath: epubPath,
    sha256: epubSha,
    size: readFileSync(epubDest).length,
    contentType: "application/epub+zip",
    generatedAt,
    visibility: "private",
    source: "golden_r2_readonly",
  },
];

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
  goldenSource: {
    instructionId: EXPECTED_INSTRUCTION_ID,
    revision,
    pdfSha256: pdfSha,
    epubSha256: epubSha,
    readOnly: true,
  },
};
const manifestPath = join(manifestDir, "binaryAssets.manifest.json");
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(
  JSON.stringify(
    {
      ok: true,
      dryRun: true,
      productId,
      revision,
      pdfSha256: pdfSha,
      epubSha256: epubSha,
      pdfMatchesGolden: pdfSha === EXPECTED_PDF_SHA,
      epubMatchesGolden: epubSha === EXPECTED_EPUB_SHA,
      publicCopyCount: 0,
      stagingRoot: stagingRoot.replace(repoRoot + "\\", "").replace(repoRoot + "/", ""),
      manifestPath: manifestPath.replace(repoRoot + "\\", "").replace(repoRoot + "/", ""),
      storagePaths: { pdf: pdfPath, epub: epubPath },
      uploadedToFirebase: false,
    },
    null,
    2,
  ),
);
