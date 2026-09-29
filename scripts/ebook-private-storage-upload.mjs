/**
 * Private ebook Storage upload tooling.
 *
 * Default / --dry-run: package chapters locally, never touch Firebase.
 * --upload: production-intent path with fail-closed guards.
 *   Real Firebase upload requires ALL of:
 *     --upload --confirm-production-upload
 *     ALLOW_FIREBASE_STORAGE_UPLOAD=true
 *     GCLOUD_PROJECT / FIREBASE_PROJECT=sotongware
 *   This commercial-launch phase never sets that env — upload is refused.
 *
 * Usage:
 *   node scripts/ebook-private-storage-upload.mjs --dry-run \
 *     --product ai-first-ebook-for-50s --revision 2
 *   node scripts/ebook-private-storage-upload.mjs --upload \
 *     --confirm-production-upload --product ... --revision 2
 *     (fails closed without ALLOW_FIREBASE_STORAGE_UPLOAD)
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import {
  assertProductionUploadGuards,
  buildChapterObjects,
  EXPECTED_FIREBASE_PROJECT,
  FREE_PREVIEW_CHAPTER_IDS,
  loadPrivatePackage,
  MemoryStorageUploader,
  validatePrivateChapterPackage,
  writeStagingAndManifest,
  createGatedAdminStorageUploader,
} from "./lib/ebook-private-upload-core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const require = createRequire(import.meta.url);

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : "";
}

const wantsUpload = process.argv.includes("--upload");
const dryRun = process.argv.includes("--dry-run") || !wantsUpload;
const confirmProductionUpload = process.argv.includes("--confirm-production-upload");
const allowOverwrite = process.argv.includes("--allow-overwrite");
const productId = argValue("--product") || "ai-first-ebook-for-50s";
const revision = Number(argValue("--revision") || 2);
const firebaseProject =
  process.env.GCLOUD_PROJECT ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.FIREBASE_PROJECT ||
  "";
const allowFirebaseStorageUpload = process.env.ALLOW_FIREBASE_STORAGE_UPLOAD === "true";

const build = spawnSync("npm", ["run", "build"], {
  cwd: join(repoRoot, "functions"),
  encoding: "utf8",
  shell: true,
});
if (build.status !== 0) {
  console.error(build.stderr || build.stdout);
  process.exit(1);
}

const { canonicalEbookChapterObjectPath } = require(
  join(repoRoot, "functions", "lib", "ebook", "storage-path.js"),
);

const loaded = loadPrivatePackage(repoRoot, productId, revision);
if (!loaded.ok) {
  console.error(`FAIL: ${loaded.error}`);
  process.exit(1);
}

const validated = validatePrivateChapterPackage({
  productId,
  revision,
  pkg: loaded.pkg,
  canonicalPath: canonicalEbookChapterObjectPath,
});
if (!validated.ok) {
  console.error(JSON.stringify({ ok: false, errors: validated.errors }, null, 2));
  process.exit(1);
}

const { assets, objects, generatedAt } = buildChapterObjects({
  productId,
  revision,
  premium: validated.premium,
  canonicalPath: canonicalEbookChapterObjectPath,
});

const { stagingRoot, manifestPath, manifest } = writeStagingAndManifest({
  repoRoot,
  productId,
  revision,
  assets,
  objects,
  provenance: validated.provenance,
  dryRun,
  uploadedToFirebase: false,
});

if (dryRun) {
  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun: true,
        productId,
        revision,
        premiumChapterObjects: assets.length,
        freePreviewExcluded: [...FREE_PREVIEW_CHAPTER_IDS],
        stagingRoot: stagingRoot.replace(repoRoot + "\\", "").replace(repoRoot + "/", ""),
        manifestPath: manifestPath.replace(repoRoot + "\\", "").replace(repoRoot + "/", ""),
        sampleStoragePath: assets[0]?.storagePath,
        uploadedToFirebase: false,
        generatedAt,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

// --- Production-intent path (still fail-closed without env gate) ---
const guards = assertProductionUploadGuards({
  explicitUpload: wantsUpload,
  confirmProductionUpload,
  firebaseProject,
  productId,
  revision,
  allowFirebaseStorageUpload,
  overwrite: allowOverwrite,
  allowOverwrite,
});
if (!guards.ok) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        code: "production_upload_guards_failed",
        errors: guards.errors,
        note: "Real Firebase upload refused. Set ALLOW_FIREBASE_STORAGE_UPLOAD only for deliberate ops.",
      },
      null,
      2,
    ),
  );
  process.exit(2);
}

// Even when guards pass, prefer Memory uploader unless Admin SDK bucket factory is injected.
// This phase never enables ALLOW_FIREBASE_STORAGE_UPLOAD — unreachable, but structure ready.
const useMemoryOnly = process.env.EBOOK_UPLOAD_USE_MEMORY === "true" || !allowFirebaseStorageUpload;
/** @type {import("./lib/ebook-private-upload-core.mjs").MemoryStorageUploader | ReturnType<typeof createGatedAdminStorageUploader>} */
let uploader;
if (useMemoryOnly) {
  uploader = new MemoryStorageUploader();
} else {
  uploader = createGatedAdminStorageUploader({
    allowFirebaseStorageUpload,
    firebaseProject: EXPECTED_FIREBASE_PROJECT,
    getBucket: () => {
      throw Object.assign(new Error("production_upload_disabled_this_phase"), {
        code: "production_upload_disabled_this_phase",
      });
    },
  });
}

async function runUpload() {
  const uploaded = [];
  const failed = [];
  for (const obj of objects) {
    try {
      if (!allowOverwrite && (await uploader.exists(obj.storagePath))) {
        failed.push({ chapterId: obj.chapterId, code: "overwrite_forbidden" });
        continue;
      }
      await uploader.uploadObject({
        storagePath: obj.storagePath,
        bytes: obj.bytes,
        contentHash: obj.contentHash,
        contentType: "application/json; charset=utf-8",
        overwrite: allowOverwrite,
      });
      const verify = await uploader.verifyObject({
        storagePath: obj.storagePath,
        expectedHash: obj.contentHash,
      });
      if (!verify.ok) {
        failed.push({ chapterId: obj.chapterId, code: verify.code || "verify_failed" });
        continue;
      }
      uploaded.push(obj.chapterId);
    } catch (e) {
      failed.push({
        chapterId: obj.chapterId,
        code: e?.code || "upload_failed",
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  if (failed.length || uploaded.length !== objects.length) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          code: "partial_or_failed_upload",
          uploaded: uploaded.length,
          expected: objects.length,
          failed,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  manifest.dryRun = false;
  manifest.uploadedToFirebase = allowFirebaseStorageUpload && !useMemoryOnly;
  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun: false,
        productId,
        revision,
        premiumChapterObjects: uploaded.length,
        uploadedToFirebase: manifest.uploadedToFirebase,
        memoryOnly: useMemoryOnly,
        sampleStoragePath: objects[0]?.storagePath,
      },
      null,
      2,
    ),
  );
}

runUpload().catch((e) => {
  console.error(e);
  process.exit(1);
});
