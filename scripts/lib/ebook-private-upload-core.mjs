/**
 * Shared private chapter packaging + production upload guards (no Firebase I/O here).
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const FREE_PREVIEW_CHAPTER_IDS = Object.freeze(["fm-01", "fm-02", "ch-01"]);
export const EXPECTED_GOLDEN_PRODUCT_ID = "ai-first-ebook-for-50s";
export const EXPECTED_GOLDEN_REVISION = 2;
export const EXPECTED_PREMIUM_COUNT = 15;
export const EXPECTED_FIREBASE_PROJECT = "sotongware";
export const EXPECTED_PDF_SHA =
  "ca2ecebe8667ccb67f5b6cd5515358781406b0ce65d157a01e3abc9adda28336";
export const EXPECTED_EPUB_SHA =
  "147d9ccc15bea8c5917296498a5dc8cbc30f85c9df9210f3730abe09c5fde3e6";
export const EXPECTED_INSTRUCTION_ID = "wi_plan_1789914868666";

/**
 * @param {object} input
 * @param {string} input.productId
 * @param {number} input.revision
 * @param {object} input.pkg
 * @param {(productId:string, revision:number, chapterId:string)=>string} input.canonicalPath
 */
export function validatePrivateChapterPackage(input) {
  const errors = [];
  const { productId, revision, pkg, canonicalPath } = input;
  const freeSet = new Set(FREE_PREVIEW_CHAPTER_IDS);

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
    if (freeSet.has(ch.id)) {
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
      canonicalPath(productId, revision, ch.id);
    } catch (e) {
      errors.push(`path_invalid:${ch.id}:${e instanceof Error ? e.message : e}`);
    }
    if (String(ch.id).includes("..") || String(ch.id).includes("/") || String(ch.id).includes("\\")) {
      errors.push(`traversal:${ch.id}`);
    }
    premium.push(ch);
  }

  if (productId === EXPECTED_GOLDEN_PRODUCT_ID && premium.length !== EXPECTED_PREMIUM_COUNT) {
    errors.push(`premium_count:${premium.length}!=${EXPECTED_PREMIUM_COUNT}`);
  }

  const prov = pkg.provenance || {};
  if (productId === EXPECTED_GOLDEN_PRODUCT_ID) {
    if (prov.sourcePdfSha256 !== EXPECTED_PDF_SHA) errors.push("pdf_sha_mismatch");
    if (prov.sourceEpubSha256 !== EXPECTED_EPUB_SHA) errors.push("epub_sha_mismatch");
    if (prov.instructionId !== EXPECTED_INSTRUCTION_ID) errors.push("instructionId_mismatch");
  }

  return { ok: errors.length === 0, errors, premium, provenance: prov };
}

/**
 * Production upload intent guards (does not touch Firebase).
 */
export function assertProductionUploadGuards(input) {
  const errors = [];
  if (!input.explicitUpload) errors.push("missing_explicit_upload_flag");
  if (!input.confirmProductionUpload) errors.push("missing_confirm_production_upload");
  if (input.firebaseProject !== EXPECTED_FIREBASE_PROJECT) {
    errors.push(`wrong_project:${input.firebaseProject || "missing"}`);
  }
  if (input.productId !== EXPECTED_GOLDEN_PRODUCT_ID) {
    errors.push(`wrong_productId:${input.productId}`);
  }
  if (Number(input.revision) !== EXPECTED_GOLDEN_REVISION) {
    errors.push(`wrong_revision:${input.revision}`);
  }
  if (input.allowFirebaseStorageUpload !== true) {
    errors.push("ALLOW_FIREBASE_STORAGE_UPLOAD_not_set");
  }
  if (input.overwrite === true && input.allowOverwrite !== true) {
    errors.push("overwrite_forbidden");
  }
  return { ok: errors.length === 0, errors };
}

export function buildChapterObjects(input) {
  const { productId, revision, premium, canonicalPath, generatedAt = new Date().toISOString() } =
    input;
  const assets = [];
  const objects = [];
  for (const ch of premium) {
    const storagePath = canonicalPath(productId, revision, ch.id);
    const objectBody = {
      id: ch.id,
      title: ch.title,
      accessTier: "premium",
      pages: ch.pages,
    };
    const json = JSON.stringify(objectBody);
    const contentHash = createHash("sha256").update(json).digest("hex");
    const bytes = Buffer.from(json + "\n", "utf8");
    objects.push({ chapterId: ch.id, storagePath, contentHash, bytes, objectBody });
    assets.push({
      productId,
      revision,
      assetType: "ebook_chapter_json",
      chapterId: ch.id,
      storagePath,
      contentHash,
      size: Buffer.byteLength(json, "utf8"),
      generatedAt,
      visibility: "private",
    });
  }
  return { assets, objects, generatedAt };
}

export function writeStagingAndManifest(input) {
  const {
    repoRoot,
    productId,
    revision,
    assets,
    objects,
    provenance,
    dryRun,
    uploadedToFirebase,
  } = input;
  const stagingRoot = join(
    repoRoot,
    "artifacts",
    "ebook-private-staging",
    productId,
    `r${revision}`,
    "chapters",
  );
  mkdirSync(stagingRoot, { recursive: true });
  for (const obj of objects) {
    writeFileSync(join(stagingRoot, `${obj.chapterId}.json`), obj.bytes);
  }
  const manifestDir = join(
    repoRoot,
    "artifacts",
    "ebook-content-assets",
    productId,
    `r${revision}`,
  );
  mkdirSync(manifestDir, { recursive: true });
  const manifest = {
    schemaVersion: 1,
    productId,
    revision,
    generatedAt: assets[0]?.generatedAt || new Date().toISOString(),
    dryRun: Boolean(dryRun),
    uploadedToFirebase: Boolean(uploadedToFirebase),
    assetCount: assets.length,
    assets,
    provenance: {
      instructionId: provenance.instructionId,
      finalRevision: provenance.finalRevision ?? revision,
      sourcePdfSha256: provenance.sourcePdfSha256,
      sourceEpubSha256: provenance.sourceEpubSha256,
    },
    binaries: {
      pdf: `private/ebooks/${productId}/r${revision}/binaries/book.pdf`,
      epub: `private/ebooks/${productId}/r${revision}/binaries/book.epub`,
      note: "Packaged separately; public URL forbidden.",
    },
  };
  const manifestPath = join(manifestDir, "contentAssets.manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  return { stagingRoot, manifestPath, manifest };
}

export function loadPrivatePackage(repoRoot, productId, revision) {
  const pkgPath = join(
    repoRoot,
    "artifacts",
    "ebook-private",
    productId,
    `r${revision}`,
    "private-content.json",
  );
  if (!existsSync(pkgPath)) {
    return { ok: false, error: `private_package_missing:${pkgPath}`, pkgPath, pkg: null };
  }
  return { ok: true, pkgPath, pkg: JSON.parse(readFileSync(pkgPath, "utf8")) };
}

/**
 * Fake/memory Storage uploader for local tests — never talks to Firebase.
 */
export class MemoryStorageUploader {
  constructor() {
    this.objects = new Map();
  }

  async exists(storagePath) {
    return this.objects.has(storagePath);
  }

  async uploadObject({ storagePath, bytes, contentHash, contentType, overwrite = false }) {
    if (!overwrite && this.objects.has(storagePath)) {
      const err = new Error("overwrite_forbidden");
      err.code = "overwrite_forbidden";
      throw err;
    }
    this.objects.set(storagePath, { bytes, contentHash, contentType });
    return { storagePath, contentHash, size: bytes.length };
  }

  async verifyObject({ storagePath, expectedHash }) {
    const obj = this.objects.get(storagePath);
    if (!obj) return { ok: false, code: "missing" };
    if (obj.contentHash !== expectedHash) return { ok: false, code: "hash_mismatch" };
    return { ok: true };
  }
}

/**
 * Production Admin SDK uploader — gated; this phase never enables ALLOW_FIREBASE_STORAGE_UPLOAD.
 * Implemented for ops readiness; calling without env throws.
 */
export function createGatedAdminStorageUploader(input) {
  const { allowFirebaseStorageUpload, firebaseProject, getBucket } = input;
  return {
    async exists(storagePath) {
      if (!allowFirebaseStorageUpload || firebaseProject !== EXPECTED_FIREBASE_PROJECT) {
        throw Object.assign(new Error("production_upload_disabled"), {
          code: "production_upload_disabled",
        });
      }
      const bucket = getBucket();
      const [exists] = await bucket.file(storagePath).exists();
      return exists;
    },
    async uploadObject({ storagePath, bytes, contentType, contentHash, overwrite = false }) {
      if (!allowFirebaseStorageUpload || firebaseProject !== EXPECTED_FIREBASE_PROJECT) {
        throw Object.assign(new Error("production_upload_disabled"), {
          code: "production_upload_disabled",
        });
      }
      const bucket = getBucket();
      const file = bucket.file(storagePath);
      if (!overwrite) {
        const [exists] = await file.exists();
        if (exists) {
          throw Object.assign(new Error("overwrite_forbidden"), { code: "overwrite_forbidden" });
        }
      }
      await file.save(bytes, {
        resumable: false,
        metadata: {
          contentType,
          metadata: { contentHash, visibility: "private" },
        },
      });
      return { storagePath, contentHash, size: bytes.length };
    },
    async verifyObject({ storagePath, expectedHash }) {
      if (!allowFirebaseStorageUpload || firebaseProject !== EXPECTED_FIREBASE_PROJECT) {
        throw Object.assign(new Error("production_upload_disabled"), {
          code: "production_upload_disabled",
        });
      }
      const bucket = getBucket();
      const file = bucket.file(storagePath);
      const [exists] = await file.exists();
      if (!exists) return { ok: false, code: "missing" };
      const [meta] = await file.getMetadata();
      const hash = meta?.metadata?.contentHash;
      if (hash !== expectedHash) return { ok: false, code: "hash_mismatch" };
      return { ok: true };
    },
  };
}
