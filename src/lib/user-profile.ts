import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  type Timestamp,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import type { User } from "firebase/auth";
import { getFirestoreDb, getFirebaseFunctions } from "@/lib/firebase";
import { CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION } from "@/lib/auth-safety";
import type { Entitlement, UserProfile } from "@/types/membership";

export interface EnsureProfileOptions {
  locale?: "ko" | "en";
  /** Must exactly match server CURRENT_TERMS_VERSION when accepting consent */
  termsVersion?: string;
  /** Must exactly match server CURRENT_PRIVACY_VERSION when accepting consent */
  privacyVersion?: string;
}

function timestampToIso(value: Timestamp | string | undefined | null): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
}

function timestampToIsoRequired(value: Timestamp | string | undefined): string {
  return timestampToIso(value) ?? new Date().toISOString();
}

function mapProfile(uid: string, data: Record<string, unknown>, emailVerifiedFallback: boolean): UserProfile {
  const statusRaw = data.status;
  const status =
    statusRaw === "suspended" ? "suspended" : statusRaw === "pending" ? "pending" : "active";

  return {
    uid,
    email: typeof data.email === "string" ? data.email : "",
    displayName: typeof data.displayName === "string" ? data.displayName : "",
    role: data.role === "admin" ? "admin" : "member",
    status,
    membershipGrade: data.membershipGrade === "basic" ? "basic" : "free",
    locale: data.locale === "en" ? "en" : "ko",
    termsVersion: typeof data.termsVersion === "string" ? data.termsVersion : null,
    termsAcceptedAt: timestampToIso(data.termsAcceptedAt as Timestamp | string | null | undefined),
    privacyVersion: typeof data.privacyVersion === "string" ? data.privacyVersion : null,
    privacyAcceptedAt: timestampToIso(
      data.privacyAcceptedAt as Timestamp | string | null | undefined,
    ),
    consentAt: timestampToIso(data.consentAt as Timestamp | string | null | undefined),
    policyVersion: typeof data.policyVersion === "string" ? data.policyVersion : null,
    createdAt: timestampToIsoRequired(data.createdAt as Timestamp | string | undefined),
    lastLoginAt: timestampToIsoRequired(data.lastLoginAt as Timestamp | string | undefined),
    emailVerified: typeof data.emailVerified === "boolean" ? data.emailVerified : emailVerifiedFallback,
  };
}

/**
 * Load/recover membership via server callable only for identity/consent/privilege.
 * Client may only patch locale (Rules allowlist).
 */
export async function ensureUserProfile(
  user: User,
  options: EnsureProfileOptions = {},
): Promise<UserProfile> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firebase가 설정되지 않았습니다.");
  }

  const functions = getFirebaseFunctions();
  if (!functions) {
    throw new Error("회원 프로필 서버 함수를 사용할 수 없습니다.");
  }

  const ensure = httpsCallable(functions, "ensureMyMemberProfile");
  const payload: Record<string, string> = {
    locale: options.locale ?? "ko",
  };
  if (options.termsVersion && options.privacyVersion) {
    payload.termsVersion = options.termsVersion;
    payload.privacyVersion = options.privacyVersion;
  }
  await ensure(payload);

  const ref = doc(db, "users", user.uid);
  let snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error("회원 프로필을 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }

  // Optional locale-only client write (Rules-enforced allowlist)
  if (options.locale === "en" || options.locale === "ko") {
    const current = snap.data()?.locale;
    if (current !== options.locale) {
      await setDoc(ref, { locale: options.locale }, { merge: true });
      snap = await getDoc(ref);
    }
  }

  return mapProfile(user.uid, snap.data() as Record<string, unknown>, user.emailVerified);
}

export async function acceptCurrentPolicies(
  user: User,
  locale: "ko" | "en" = "ko",
): Promise<UserProfile> {
  return ensureUserProfile(user, {
    locale,
    termsVersion: CURRENT_TERMS_VERSION,
    privacyVersion: CURRENT_PRIVACY_VERSION,
  });
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;

  return mapProfile(uid, snap.data() as Record<string, unknown>, Boolean(snap.data().emailVerified));
}

export async function fetchUserEntitlements(uid: string): Promise<Entitlement[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  const snap = await getDocs(collection(db, "users", uid, "entitlements"));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      businessId: data.businessId,
      plan: data.plan ?? "member",
      status: data.status ?? "active",
      grantedAt: timestampToIsoRequired(data.grantedAt),
      expiresAt: data.expiresAt ? timestampToIsoRequired(data.expiresAt) : null,
    } as Entitlement;
  });
}
