import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { join } from "node:path";
import { LocalPrivateArtifactProvider } from "./content-provider";
import { FirestoreProductEntitlementLookup } from "./firestore-entitlements";
import { EbookChapterAccessError, handleGetEbookChapterBody } from "./get-chapter-body";
import { isFunctionsEmulatorRuntime } from "../commerce/emulator-runtime";

const runningInEmulator = isFunctionsEmulatorRuntime();
const allowInCloud = process.env.ALLOW_EBOOK_CHAPTER_FUNCTION === "true";

function getDb() {
  if (!getApps().length) initializeApp();
  return getFirestore();
}

function resolvePrivateRoot(): string {
  if (process.env.EBOOK_PRIVATE_ROOT) return process.env.EBOOK_PRIVATE_ROOT;
  // functions/lib/ebook → repo artifacts/ebook-private
  return join(__dirname, "..", "..", "..", "artifacts", "ebook-private");
}

function mapError(e: unknown): never {
  if (e instanceof EbookChapterAccessError) {
    throw new HttpsError(e.code, e.message);
  }
  // Do not log chapter bodies.
  console.error("getEbookChapterBody_failed", e instanceof Error ? e.name : "unknown");
  throw new HttpsError("internal", "요청을 처리할 수 없습니다.");
}

/**
 * getEbookChapterBody — premium chapter body after server authz.
 * Omitted from cloud deploy unless ALLOW_EBOOK_CHAPTER_FUNCTION=true.
 * Emulator keeps it available for local verification.
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
        content: new LocalPrivateArtifactProvider(resolvePrivateRoot(), 2),
      });
    } catch (e) {
      mapError(e);
    }
  },
);
