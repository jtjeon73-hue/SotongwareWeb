import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { ensureFirebaseAdminApp } from "../firebase-admin-app";
import { FirestoreProductEntitlementLookup } from "./firestore-entitlements";
import { EbookChapterAccessError, handleGetEbookChapterBody } from "./get-chapter-body";
import {
  createEbookContentProvider,
  resolveEbookContentProviderMode,
} from "./provider-factory";
import {
  EBOOK_CLIENT_INTERNAL_MESSAGE,
  logEbookCallableFailure,
  type EbookCallableFailureContext,
} from "./diagnostic-log";
import { isFunctionsEmulatorRuntime } from "../commerce/emulator-runtime";
import {
  handleGetEbookDownloadUrl,
  MemorySignedUrlProvider,
  createProductionFirebaseSignedUrlProvider,
} from "./download-delivery";

/**
 * Runtime enablement only — never use these for Firebase deploy `omit`.
 * CLI discovery subprocess does not receive ALLOW_* / functions/.env.
 */
export function isEbookChapterCallableEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return isFunctionsEmulatorRuntime(env) || env.ALLOW_EBOOK_CHAPTER_FUNCTION === "true";
}

export function isEbookDownloadCallableEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return isFunctionsEmulatorRuntime(env) || env.ALLOW_EBOOK_DOWNLOAD_FUNCTION === "true";
}

function assertEbookChapterCallableEnabled(): void {
  if (!isEbookChapterCallableEnabled()) {
    throw new HttpsError("failed-precondition", EBOOK_CLIENT_INTERNAL_MESSAGE);
  }
}

function assertEbookDownloadCallableEnabled(): void {
  if (!isEbookDownloadCallableEnabled()) {
    throw new HttpsError("failed-precondition", EBOOK_CLIENT_INTERNAL_MESSAGE);
  }
}

const allowSignedUrl = process.env.ALLOW_FIREBASE_STORAGE_SIGNED_URL === "true";

function getDb() {
  ensureFirebaseAdminApp();
  return getFirestore();
}

/**
 * Map domain denials to HttpsError; unexpected errors → generic internal for clients.
 * Diagnostic details go to server logs only (never HttpsError details).
 */
function mapError(e: unknown, ctx: EbookCallableFailureContext = {}): never {
  if (e instanceof EbookChapterAccessError) {
    throw new HttpsError(e.code, e.message);
  }
  logEbookCallableFailure(e, ctx);
  throw new HttpsError("internal", EBOOK_CLIENT_INTERNAL_MESSAGE);
}

function createSignedUrlProvider() {
  if (isFunctionsEmulatorRuntime() || process.env.EBOOK_DOWNLOAD_FAKE_SIGNED_URL === "true") {
    return new MemorySignedUrlProvider();
  }
  // Production: Admin SDK / GCS V4 signed URL (gated by ALLOW_FIREBASE_STORAGE_SIGNED_URL).
  // Prefer EBOOK_STORAGE_BUCKET (same as chapter provider); else default app bucket.
  const bucketName =
    process.env.EBOOK_STORAGE_BUCKET ||
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.GCLOUD_STORAGE_BUCKET ||
    undefined;
  return createProductionFirebaseSignedUrlProvider({
    allow: allowSignedUrl,
    bucketName,
  });
}

/**
 * getEbookChapterBody — premium chapter body after server authz.
 * Always discovered for deploy (omit never tied to ALLOW_*).
 * Cloud requests fail-closed unless ALLOW_EBOOK_CHAPTER_FUNCTION=true (or emulator).
 */
export const getEbookChapterBody = onCall(
  {
    cors: true,
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 30,
    minInstances: 0,
    maxInstances: 5,
  },
  async (request) => {
    assertEbookChapterCallableEnabled();
    // Before any Admin SDK service (Firestore/Storage) — discovery-safe (not at module load).
    ensureFirebaseAdminApp();
    let stage = "entry";
    let providerMode = "unknown";
    try {
      stage = "provider_init";
      providerMode = resolveEbookContentProviderMode();
      const content = createEbookContentProvider();
      stage = "db_init";
      const entitlements = new FirestoreProductEntitlementLookup(getDb());
      stage = "auth_context";
      const auth = request.auth
        ? { uid: request.auth.uid, token: (request.auth.token || {}) as Record<string, unknown> }
        : null;
      const data = (request.data || {}) as Record<string, unknown>;
      stage = "handle_chapter";
      return await handleGetEbookChapterBody({
        auth,
        data,
        entitlements,
        content,
      });
    } catch (e) {
      mapError(e, { stage, providerMode });
    }
  },
);

/**
 * getEbookDownloadUrl — short-lived authenticated PDF/EPUB delivery.
 * Owned entitlement or admin only. Membership alone DENY.
 * Always discovered for deploy (omit never tied to ALLOW_*).
 * Cloud requests fail-closed unless ALLOW_EBOOK_DOWNLOAD_FUNCTION=true (or emulator).
 * Production signed URL mint also requires ALLOW_FIREBASE_STORAGE_SIGNED_URL.
 */
export const getEbookDownloadUrl = onCall(
  {
    cors: true,
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 30,
    minInstances: 0,
    maxInstances: 5,
  },
  async (request) => {
    assertEbookDownloadCallableEnabled();
    ensureFirebaseAdminApp();
    let stage = "entry";
    let providerMode = "unknown";
    try {
      stage = "provider_init";
      providerMode = resolveEbookContentProviderMode();
      stage = "signed_url_provider";
      const signedUrls = createSignedUrlProvider();
      stage = "db_init";
      const entitlements = new FirestoreProductEntitlementLookup(getDb());
      stage = "auth_context";
      const auth = request.auth
        ? { uid: request.auth.uid, token: (request.auth.token || {}) as Record<string, unknown> }
        : null;
      const data = (request.data || {}) as Record<string, unknown>;
      stage = "handle_download";
      return await handleGetEbookDownloadUrl({
        auth,
        data,
        entitlements,
        signedUrls,
      });
    } catch (e) {
      mapError(e, { stage, providerMode });
    }
  },
);
