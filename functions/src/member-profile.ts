import { onCall, HttpsError } from "firebase-functions/v2/https";
import { auth } from "firebase-functions/v1";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps } from "firebase-admin/app";

/** Server-authoritative policy versions — client must match exactly to accept. */
export const CURRENT_TERMS_VERSION = "2026-09-11";
export const CURRENT_PRIVACY_VERSION = "2026-09-11";

type ProfileData = Record<string, unknown>;

function getDb() {
  if (!getApps().length) {
    initializeApp();
  }
  return getFirestore();
}

function authEmail(token: Record<string, unknown>): string {
  return typeof token.email === "string" ? token.email : "";
}

function authEmailVerified(token: Record<string, unknown>): boolean {
  return Boolean(token.email_verified);
}

/**
 * Pending profile after Auth create — NO fabricated consent.
 * status=pending keeps member features fail-closed (Rules isActiveUser).
 */
export function buildPendingMemberDoc(input: {
  uid: string;
  email: string;
  emailVerified: boolean;
  locale?: string;
}) {
  return {
    uid: input.uid,
    email: input.email,
    displayName: "",
    role: "member",
    status: "pending",
    membershipGrade: "free",
    emailVerified: input.emailVerified,
    locale: input.locale === "en" ? "en" : "ko",
    termsVersion: null,
    termsAcceptedAt: null,
    privacyVersion: null,
    privacyAcceptedAt: null,
    // Legacy compat — server-owned, null until consent
    consentAt: null,
    policyVersion: null,
    createdAt: FieldValue.serverTimestamp(),
    lastLoginAt: FieldValue.serverTimestamp(),
    provisionedBy: "server",
  };
}

function hasCurrentConsent(data: ProfileData | undefined): boolean {
  if (!data) return false;
  return (
    data.termsVersion === CURRENT_TERMS_VERSION &&
    data.privacyVersion === CURRENT_PRIVACY_VERSION &&
    data.termsAcceptedAt != null &&
    data.privacyAcceptedAt != null
  );
}

function parseLocale(value: unknown): "ko" | "en" {
  return value === "en" ? "en" : "ko";
}

function validateConsentRequest(data: {
  termsVersion?: unknown;
  privacyVersion?: unknown;
}): { termsVersion: string; privacyVersion: string } | null {
  const hasTerms = data.termsVersion !== undefined && data.termsVersion !== null && data.termsVersion !== "";
  const hasPrivacy =
    data.privacyVersion !== undefined && data.privacyVersion !== null && data.privacyVersion !== "";

  if (!hasTerms && !hasPrivacy) {
    return null;
  }
  if (!hasTerms || !hasPrivacy) {
    throw new HttpsError(
      "invalid-argument",
      "이용약관과 개인정보처리방침 버전을 모두 보내야 합니다.",
    );
  }
  if (typeof data.termsVersion !== "string" || typeof data.privacyVersion !== "string") {
    throw new HttpsError("invalid-argument", "정책 버전 형식이 올바르지 않습니다.");
  }
  if (data.termsVersion !== CURRENT_TERMS_VERSION) {
    throw new HttpsError("failed-precondition", "이용약관 버전이 유효하지 않습니다.");
  }
  if (data.privacyVersion !== CURRENT_PRIVACY_VERSION) {
    throw new HttpsError("failed-precondition", "개인정보처리방침 버전이 유효하지 않습니다.");
  }
  return { termsVersion: data.termsVersion, privacyVersion: data.privacyVersion };
}

function profileResponse(uid: string, d: ProfileData) {
  return {
    uid,
    email: d.email ?? "",
    displayName: d.displayName ?? "",
    role: d.role ?? "member",
    status: d.status ?? "pending",
    membershipGrade: d.membershipGrade ?? "free",
    emailVerified: Boolean(d.emailVerified),
    locale: d.locale ?? "ko",
    termsVersion: d.termsVersion ?? null,
    privacyVersion: d.privacyVersion ?? null,
    consentAt: d.consentAt ?? null,
    policyVersion: d.policyVersion ?? null,
    currentTermsVersion: CURRENT_TERMS_VERSION,
    currentPrivacyVersion: CURRENT_PRIVACY_VERSION,
  };
}

/**
 * Auth user created → pending profile only (idempotent).
 * Does not invent consent. Does not set Admin claims.
 */
export const provisionMemberProfile = auth.user().onCreate(async (user) => {
  const db = getDb();
  const ref = db.collection("users").doc(user.uid);
  const snap = await ref.get();
  if (snap.exists) {
    return;
  }
  await ref.set(
    buildPendingMemberDoc({
      uid: user.uid,
      email: user.email ?? "",
      emailVerified: Boolean(user.emailVerified),
    }),
    { merge: false },
  );
});

/**
 * Authenticated provisioning + consent acceptance.
 * Writes only to users/{request.auth.uid}.
 */
export const ensureMyMemberProfile = onCall({ cors: true, maxInstances: 20 }, async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
  }

  const uid = request.auth.uid;
  const token = request.auth.token as Record<string, unknown>;

  const data = (request.data ?? {}) as {
    locale?: string;
    termsVersion?: string;
    privacyVersion?: string;
    targetUid?: string;
    uid?: string;
  };

  if (
    (typeof data.targetUid === "string" && data.targetUid !== uid) ||
    (typeof data.uid === "string" && data.uid !== uid)
  ) {
    throw new HttpsError("permission-denied", "다른 사용자의 프로필을 처리할 수 없습니다.");
  }

  const consent = validateConsentRequest(data);
  const locale = parseLocale(data.locale);
  const email = authEmail(token);
  const emailVerified = authEmailVerified(token);

  const db = getDb();
  const ref = db.collection("users").doc(uid);
  const snap = await ref.get();

  if (!snap.exists) {
    if (consent) {
      await ref.set({
        ...buildPendingMemberDoc({ uid, email, emailVerified, locale }),
        status: "active",
        termsVersion: consent.termsVersion,
        termsAcceptedAt: FieldValue.serverTimestamp(),
        privacyVersion: consent.privacyVersion,
        privacyAcceptedAt: FieldValue.serverTimestamp(),
        consentAt: FieldValue.serverTimestamp(),
        policyVersion: consent.privacyVersion,
      });
    } else {
      await ref.set(buildPendingMemberDoc({ uid, email, emailVerified, locale }));
    }
  } else {
    const existing = (snap.data() ?? {}) as ProfileData;
    const patch: ProfileData = {
      lastLoginAt: FieldValue.serverTimestamp(),
      email,
      emailVerified,
    };
    if (data.locale === "en" || data.locale === "ko") {
      patch.locale = locale;
    }

    if (consent) {
      if (!(hasCurrentConsent(existing) && existing.status === "active")) {
        patch.termsVersion = consent.termsVersion;
        patch.termsAcceptedAt = FieldValue.serverTimestamp();
        patch.privacyVersion = consent.privacyVersion;
        patch.privacyAcceptedAt = FieldValue.serverTimestamp();
        patch.consentAt = FieldValue.serverTimestamp();
        patch.policyVersion = consent.privacyVersion;
        if (existing.status === "pending" || existing.status === undefined) {
          patch.status = "active";
        }
        if (existing.role !== "admin" && !existing.membershipGrade) {
          patch.membershipGrade = "free";
        }
      }
    }

    await ref.set(patch, { merge: true });
  }

  const fresh = await ref.get();
  return profileResponse(uid, (fresh.data() ?? {}) as ProfileData);
});
