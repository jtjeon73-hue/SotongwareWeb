import { onCall, HttpsError } from "firebase-functions/v2/https";
import { auth } from "firebase-functions/v1";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps } from "firebase-admin/app";

const POLICY_VERSION = "2026-09-11";

function getDb() {
  if (!getApps().length) {
    initializeApp();
  }
  return getFirestore();
}

/** Server-owned Free membership document — never elevates privileges. */
export function buildFreeMemberDoc(input: {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
  locale?: string;
  consentAt?: string | null;
  policyVersion?: string | null;
}) {
  return {
    uid: input.uid,
    email: input.email,
    displayName: input.displayName ?? "",
    role: "member",
    status: "active",
    membershipGrade: "free",
    emailVerified: input.emailVerified,
    locale: input.locale ?? "ko",
    consentAt: input.consentAt ?? null,
    policyVersion: input.policyVersion ?? POLICY_VERSION,
    createdAt: FieldValue.serverTimestamp(),
    lastLoginAt: FieldValue.serverTimestamp(),
    provisionedBy: "server",
  };
}

/**
 * Auth user created → provision Free profile (idempotent).
 * Does not set Admin claims. Does not grant paid entitlements.
 */
export const provisionMemberProfile = auth.user().onCreate(async (user) => {
  const db = getDb();
  const ref = db.collection("users").doc(user.uid);
  const snap = await ref.get();
  if (snap.exists) {
    return;
  }
  await ref.set(
    buildFreeMemberDoc({
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? "",
      emailVerified: Boolean(user.emailVerified),
    }),
    { merge: false },
  );
});

/**
 * Authenticated recovery if trigger lagged or client needs profile.
 * Idempotent: creates Free profile only when missing; never upgrades role/grade.
 */
export const ensureMyMemberProfile = onCall({ cors: true, maxInstances: 20 }, async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
  }

  const uid = request.auth.uid;
  const token = request.auth.token;
  const data = (request.data ?? {}) as {
    locale?: string;
    consentAt?: string;
    policyVersion?: string;
    displayName?: string;
  };

  const db = getDb();
  const ref = db.collection("users").doc(uid);
  const snap = await ref.get();

  if (!snap.exists) {
    await ref.set(
      buildFreeMemberDoc({
        uid,
        email: typeof token.email === "string" ? token.email : "",
        displayName: typeof data.displayName === "string" ? data.displayName.slice(0, 80) : "",
        emailVerified: Boolean(token.email_verified),
        locale: data.locale === "en" ? "en" : "ko",
        consentAt: typeof data.consentAt === "string" ? data.consentAt : null,
        policyVersion:
          typeof data.policyVersion === "string" ? data.policyVersion.slice(0, 32) : POLICY_VERSION,
      }),
    );
  } else {
    // Touch only safe client-visible sync fields; never role/status/grade
    await ref.set(
      {
        lastLoginAt: FieldValue.serverTimestamp(),
        emailVerified: Boolean(token.email_verified),
        email: typeof token.email === "string" ? token.email : snap.get("email") ?? "",
      },
      { merge: true },
    );
  }

  const fresh = await ref.get();
  const d = fresh.data() ?? {};
  return {
    uid,
    email: d.email ?? "",
    displayName: d.displayName ?? "",
    role: d.role ?? "member",
    status: d.status ?? "active",
    membershipGrade: d.membershipGrade ?? "free",
    emailVerified: Boolean(d.emailVerified),
    locale: d.locale ?? "ko",
    policyVersion: d.policyVersion ?? POLICY_VERSION,
  };
});
