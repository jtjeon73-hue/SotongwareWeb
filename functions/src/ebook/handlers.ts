import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { FirestoreProductEntitlementLookup } from "./firestore-entitlements";
import { EbookChapterAccessError, handleGetEbookChapterBody } from "./get-chapter-body";
import { createEbookContentProvider } from "./provider-factory";
import { isFunctionsEmulatorRuntime } from "../commerce/emulator-runtime";

const runningInEmulator = isFunctionsEmulatorRuntime();
const allowInCloud = process.env.ALLOW_EBOOK_CHAPTER_FUNCTION === "true";

function getDb() {
  if (!getApps().length) initializeApp();
  return getFirestore();
}

function mapError(e: unknown): never {
  if (e instanceof EbookChapterAccessError) {
    throw new HttpsError(e.code, e.message);
  }
  // Do not log chapter bodies or storage paths.
  console.error("getEbookChapterBody_failed", e instanceof Error ? e.name : "unknown");
  throw new HttpsError("internal", "요청을 처리할 수 없습니다.");
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
