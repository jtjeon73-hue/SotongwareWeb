import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { FirestoreProductEntitlementLookup } from "./firestore-entitlements";
import { EbookChapterAccessError, handleGetEbookChapterBody } from "./get-chapter-body";
import { createEbookContentProvider } from "./provider-factory";
import { isFunctionsEmulatorRuntime } from "../commerce/emulator-runtime";
import {
  handleGetEbookDownloadUrl,
  MemorySignedUrlProvider,
  createProductionFirebaseSignedUrlProvider,
} from "./download-delivery";

const runningInEmulator = isFunctionsEmulatorRuntime();
const allowInCloud = process.env.ALLOW_EBOOK_CHAPTER_FUNCTION === "true";
const allowDownloadInCloud = process.env.ALLOW_EBOOK_DOWNLOAD_FUNCTION === "true";
const allowSignedUrl = process.env.ALLOW_FIREBASE_STORAGE_SIGNED_URL === "true";

function getDb() {
  if (!getApps().length) initializeApp();
  return getFirestore();
}

function mapError(e: unknown): never {
  if (e instanceof EbookChapterAccessError) {
    throw new HttpsError(e.code, e.message);
  }
  // Do not log chapter bodies or storage paths.
  console.error("ebook_callable_failed", e instanceof Error ? e.name : "unknown");
  throw new HttpsError("internal", "요청을 처리할 수 없습니다.");
}

function createSignedUrlProvider() {
  if (runningInEmulator || process.env.EBOOK_DOWNLOAD_FAKE_SIGNED_URL === "true") {
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
 * Content source: Storage in production cloud; local artifact in emulator/dev only.
 * Omitted from cloud deploy unless ALLOW_EBOOK_CHAPTER_FUNCTION=true.
 */
export const getEbookChapterBody = onCall(
  {
    omit: !(runningInEmulator || allowInCloud),
    cors: true,
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 30,
    minInstances: 0,
    maxInstances: 5,
  },
  async (request) => {
    try {
      const auth = request.auth
        ? { uid: request.auth.uid, token: (request.auth.token || {}) as Record<string, unknown> }
        : null;
      const data = (request.data || {}) as Record<string, unknown>;
      return await handleGetEbookChapterBody({
        auth,
        data,
        entitlements: new FirestoreProductEntitlementLookup(getDb()),
        content: createEbookContentProvider(),
      });
    } catch (e) {
      mapError(e);
    }
  },
);

/**
 * getEbookDownloadUrl — short-lived authenticated PDF/EPUB delivery.
 * Owned entitlement or admin only. Membership alone DENY.
 * Omitted unless emulator or ALLOW_EBOOK_DOWNLOAD_FUNCTION=true.
 * Production signed URL mint also requires ALLOW_FIREBASE_STORAGE_SIGNED_URL.
 */
export const getEbookDownloadUrl = onCall(
  {
    omit: !(runningInEmulator || allowDownloadInCloud),
    cors: true,
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 30,
    minInstances: 0,
    maxInstances: 5,
  },
  async (request) => {
    try {
      const auth = request.auth
        ? { uid: request.auth.uid, token: (request.auth.token || {}) as Record<string, unknown> }
        : null;
      const data = (request.data || {}) as Record<string, unknown>;
      return await handleGetEbookDownloadUrl({
        auth,
        data,
        entitlements: new FirestoreProductEntitlementLookup(getDb()),
        signedUrls: createSignedUrlProvider(),
      });
    } catch (e) {
      mapError(e);
    }
  },
);
