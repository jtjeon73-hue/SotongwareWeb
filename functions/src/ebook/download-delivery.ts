/**
 * Authenticated short-lived ebook PDF/EPUB download delivery (server-only).
 * Never returns permanent Storage URLs or private object paths to clients.
 */
import { createHash, randomBytes } from "crypto";
import { getStorage } from "firebase-admin/storage";
import { ensureFirebaseAdminApp } from "../firebase-admin-app";
import { authorizeEbookDownloadAccess } from "./authorize";
import {
  canonicalEbookBinaryObjectPath,
  EbookStoragePathError,
  assertSafeRevision,
} from "./storage-path";
import type { AuthContext, ProductEntitlementLookup } from "./types";
import { EbookChapterAccessError } from "./get-chapter-body";

export const DOWNLOAD_URL_TTL_SECONDS = 300;
export const DEFAULT_EBOOK_REVISION = 2;
export type EbookDownloadAsset = "pdf" | "epub";

/** Server-only: must match canonicalEbookBinaryObjectPath layout. */
export const PRIVATE_BINARY_OBJECT_PATH_RE =
  /^private\/ebooks\/[a-z0-9][a-z0-9-]{0,120}\/r[1-9][0-9]{0,3}\/binaries\/book\.(pdf|epub)$/;

export type SignedDownloadDelivery = {
  productId: string;
  assetType: EbookDownloadAsset;
  contentType: string;
  expiresAt: string;
  downloadUrl: string;
  delivery: "signed_url";
  ttlSeconds: number;
  /** Never expose storagePath / bucket to clients */
};

export type SignedUrlProvider = {
  mint(input: {
    storagePath: string;
    contentType: string;
    ttlSeconds: number;
    now: Date;
  }): Promise<{ downloadUrl: string; expiresAt: Date }>;
};

export type GcsSignedFile = {
  getSignedUrl: (cfg: {
    action: "read";
    expires: number;
    responseDisposition?: string;
    contentType?: string;
  }) => Promise<[string]>;
};

export function clampDownloadTtlSeconds(ttlSeconds: number): number {
  if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) return DOWNLOAD_URL_TTL_SECONDS;
  return Math.min(Math.floor(ttlSeconds), DOWNLOAD_URL_TTL_SECONDS);
}

export function assertCanonicalPrivateBinaryPath(storagePath: string): string {
  const p = (storagePath || "").trim();
  if (!p || p.includes("..") || p.includes("\\") || p.includes("\0")) {
    throw new EbookChapterAccessError("invalid-argument", "경로가 올바르지 않습니다.");
  }
  if (!PRIVATE_BINARY_OBJECT_PATH_RE.test(p)) {
    throw new EbookChapterAccessError("invalid-argument", "경로가 올바르지 않습니다.");
  }
  return p;
}

/** Emulator/local fake — opaque token URLs, not real GCS. */
export class MemorySignedUrlProvider implements SignedUrlProvider {
  readonly tokens = new Map<
    string,
    { storagePath: string; expiresAt: Date; contentType: string }
  >();

  async mint(input: {
    storagePath: string;
    contentType: string;
    ttlSeconds: number;
    now: Date;
  }) {
    const storagePath = assertCanonicalPrivateBinaryPath(input.storagePath);
    const ttlSeconds = clampDownloadTtlSeconds(input.ttlSeconds);
    const token = randomBytes(24).toString("hex");
    const expiresAt = new Date(input.now.getTime() + ttlSeconds * 1000);
    this.tokens.set(token, {
      storagePath,
      expiresAt,
      contentType: input.contentType,
    });
    // Opaque delivery URL — not a permanent Storage URL and does not embed the object path.
    const sig = createHash("sha256").update(token).digest("hex").slice(0, 16);
    return {
      downloadUrl: `https://download.local/ebook/v1/${token}?s=${sig}`,
      expiresAt,
    };
  }

  resolve(token: string, now: Date = new Date()) {
    const row = this.tokens.get(token);
    if (!row) return { ok: false as const, code: "invalid_token" };
    if (row.expiresAt.getTime() <= now.getTime()) return { ok: false as const, code: "expired" };
    return { ok: true as const, ...row };
  }
}

/**
 * Production GCS V4 signed URL mint — gated by allow flag.
 * Uses Admin SDK File#getSignedUrl (temporary signed URL, not Firebase download tokens).
 * Does not call makePublic / does not set firebaseStorageDownloadTokens.
 */
export function createGatedGcsSignedUrlProvider(input: {
  allow: boolean;
  getFile: (storagePath: string) => GcsSignedFile;
}): SignedUrlProvider {
  return {
    async mint({ storagePath, contentType, ttlSeconds, now }) {
      if (!input.allow) {
        throw new EbookChapterAccessError(
          "failed-precondition",
          "Signed URL minting is disabled.",
        );
      }
      const safePath = assertCanonicalPrivateBinaryPath(storagePath);
      const ttl = clampDownloadTtlSeconds(ttlSeconds);
      const expires = now.getTime() + ttl * 1000;
      const [downloadUrl] = await input.getFile(safePath).getSignedUrl({
        action: "read",
        expires,
        responseDisposition: "attachment",
        contentType,
      });
      if (!downloadUrl || typeof downloadUrl !== "string") {
        throw new EbookChapterAccessError("internal", "다운로드 URL을 발급할 수 없습니다.");
      }
      // Reject accidental permanent token-style Firebase media URLs if ever returned.
      if (
        /[?&]token=/.test(downloadUrl) &&
        !/[?&]X-Goog-Signature=/.test(downloadUrl) &&
        !/[?&]Signature=/.test(downloadUrl)
      ) {
        throw new EbookChapterAccessError("internal", "다운로드 URL을 발급할 수 없습니다.");
      }
      return { downloadUrl, expiresAt: new Date(expires) };
    },
  };
}

/**
 * Wire Admin SDK Storage file accessor for production signed URL mint.
 * Bucket comes from env/default; object path is always caller-supplied canonical path.
 */
export function createAdminSdkStorageFileAccessor(
  bucketName?: string,
): (storagePath: string) => GcsSignedFile {
  return (storagePath: string) => {
    ensureFirebaseAdminApp();
    const safePath = assertCanonicalPrivateBinaryPath(storagePath);
    const bucket = bucketName ? getStorage().bucket(bucketName) : getStorage().bucket();
    return bucket.file(safePath);
  };
}

export function createProductionFirebaseSignedUrlProvider(input: {
  allow: boolean;
  bucketName?: string;
}): SignedUrlProvider {
  return createGatedGcsSignedUrlProvider({
    allow: input.allow,
    getFile: createAdminSdkStorageFileAccessor(input.bucketName),
  });
}

export function assertEbookDownloadAsset(raw: unknown): EbookDownloadAsset {
  if (raw === "pdf" || raw === "epub") return raw;
  throw new EbookChapterAccessError("invalid-argument", "assetType must be pdf or epub.");
}

function contentTypeFor(asset: EbookDownloadAsset): string {
  return asset === "pdf" ? "application/pdf" : "application/epub+zip";
}

function fileNameFor(asset: EbookDownloadAsset): "book.pdf" | "book.epub" {
  return asset === "pdf" ? "book.pdf" : "book.epub";
}

/**
 * Server-mediated download URL after entitlement check.
 * Response never includes storagePath, bucket, or permanent URLs.
 */
export async function handleGetEbookDownloadUrl(input: {
  auth: AuthContext | null;
  data: Record<string, unknown>;
  entitlements: ProductEntitlementLookup;
  signedUrls: SignedUrlProvider;
  now?: Date;
  ttlSeconds?: number;
  defaultRevision?: number;
}): Promise<SignedDownloadDelivery> {
  const productId = typeof input.data.productId === "string" ? input.data.productId.trim() : "";
  if (!productId) {
    throw new EbookChapterAccessError("invalid-argument", "productId required.");
  }
  if (productId.includes("..") || productId.includes("/") || productId.includes("\\")) {
    throw new EbookChapterAccessError("invalid-argument", "productId invalid.");
  }

  let asset: EbookDownloadAsset;
  try {
    asset = assertEbookDownloadAsset(input.data.assetType ?? input.data.asset);
  } catch (e) {
    throw e;
  }

  const revisionRaw = input.data.revision ?? input.defaultRevision ?? DEFAULT_EBOOK_REVISION;
  let revision: number;
  try {
    revision = assertSafeRevision(Number(revisionRaw));
  } catch (e) {
    if (e instanceof EbookStoragePathError) {
      throw new EbookChapterAccessError("invalid-argument", "revision invalid.");
    }
    throw e;
  }

  const now = input.now ?? new Date();
  const rows = input.auth?.uid
    ? await input.entitlements.listProductEntitlements(input.auth.uid)
    : [];
  const authz = authorizeEbookDownloadAccess({
    auth: input.auth,
    productId,
    entitlements: rows,
    now,
  });
  if (!authz.ok) {
    const map: Record<
      string,
      { code: "unauthenticated" | "permission-denied" | "failed-precondition"; msg: string }
    > = {
      unauthenticated: { code: "unauthenticated", msg: "로그인이 필요합니다." },
      download_requires_owned: {
        code: "permission-denied",
        msg: "PDF/EPUB 다운로드는 단품 구매가 필요합니다.",
      },
      entitlement_missing: { code: "permission-denied", msg: "이용 권한이 없습니다." },
      entitlement_inactive: { code: "permission-denied", msg: "이용 권한이 없습니다." },
      entitlement_expired: { code: "permission-denied", msg: "이용 권한이 만료되었습니다." },
      wrong_product: { code: "permission-denied", msg: "이용 권한이 없습니다." },
      forbidden: { code: "permission-denied", msg: "이용 권한이 없습니다." },
      membership_inactive: { code: "permission-denied", msg: "이용 권한이 없습니다." },
    };
    const m = map[authz.code] || map.forbidden;
    throw new EbookChapterAccessError(m.code, m.msg);
  }

  let storagePath: string;
  try {
    storagePath = canonicalEbookBinaryObjectPath(productId, revision, fileNameFor(asset));
  } catch (e) {
    if (e instanceof EbookStoragePathError) {
      throw new EbookChapterAccessError("invalid-argument", "경로가 올바르지 않습니다.");
    }
    throw e;
  }
  // Defense in depth — only binaries under private/ebooks/.../binaries/
  assertCanonicalPrivateBinaryPath(storagePath);

  const ttlSeconds = clampDownloadTtlSeconds(input.ttlSeconds ?? DOWNLOAD_URL_TTL_SECONDS);
  const minted = await input.signedUrls.mint({
    storagePath,
    contentType: contentTypeFor(asset),
    ttlSeconds,
    now,
  });

  // Leakage guard: response must not include storagePath.
  const response: SignedDownloadDelivery = {
    productId,
    assetType: asset,
    contentType: contentTypeFor(asset),
    expiresAt: minted.expiresAt.toISOString(),
    downloadUrl: minted.downloadUrl,
    delivery: "signed_url",
    ttlSeconds,
  };
  const serialized = JSON.stringify(response);
  if (serialized.includes("private/ebooks") || serialized.includes("storagePath")) {
    throw new EbookChapterAccessError("internal", "다운로드 URL을 발급할 수 없습니다.");
  }
  return response;
}
