import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { ensureFirebaseAdminApp } from "../firebase-admin-app";
import { isFunctionsEmulatorRuntime } from "../commerce/emulator-runtime";
import { FirestoreProductEntitlementLookup } from "../ebook/firestore-entitlements";
import {
  EBOOK_CLIENT_INTERNAL_MESSAGE,
  logEbookCallableFailure,
} from "../ebook/diagnostic-log";
import { KnowledgeMemberAccessError, handleGetKnowledgeMemberBody } from "./get-member-body";

/**
 * Runtime enablement only — never use for Firebase deploy `omit`.
 * CLI discovery subprocess does not receive ALLOW_* / functions/.env.
 */
export function isKnowledgeMemberCallableEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return isFunctionsEmulatorRuntime(env) || env.ALLOW_KNOWLEDGE_MEMBER_FUNCTION === "true";
}

function assertKnowledgeMemberCallableEnabled(): void {
  if (!isKnowledgeMemberCallableEnabled()) {
    throw new HttpsError("failed-precondition", EBOOK_CLIENT_INTERNAL_MESSAGE);
  }
}

function getDb() {
  ensureFirebaseAdminApp();
  return getFirestore();
}

function mapError(e: unknown, stage: string): never {
  if (e instanceof KnowledgeMemberAccessError) {
    throw new HttpsError(e.code, e.message);
  }
  logEbookCallableFailure(e, { stage, providerMode: "knowledge-member" });
  throw new HttpsError("internal", EBOOK_CLIENT_INTERNAL_MESSAGE);
}

/**
 * getKnowledgeMemberBody — Basic member unified learning rail body after server authz.
 * Always discovered for deploy (omit never tied to ALLOW_*).
 * Cloud requests fail-closed unless ALLOW_KNOWLEDGE_MEMBER_FUNCTION=true (or emulator).
 */
export const getKnowledgeMemberBody = onCall(
  {
    cors: true,
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 30,
    minInstances: 0,
    maxInstances: 5,
  },
  async (request) => {
    assertKnowledgeMemberCallableEnabled();
    // Before any Admin SDK service — discovery-safe (not at module load).
    ensureFirebaseAdminApp();
    let stage = "entry";
    try {
      stage = "db_init";
      const entitlements = new FirestoreProductEntitlementLookup(getDb());
      stage = "auth_context";
      const auth = request.auth
        ? { uid: request.auth.uid, token: (request.auth.token || {}) as Record<string, unknown> }
        : null;
      const data = (request.data || {}) as Record<string, unknown>;
      stage = "handle_member_body";
      return await handleGetKnowledgeMemberBody({ auth, data, entitlements });
    } catch (e) {
      mapError(e, stage);
    }
  },
);
