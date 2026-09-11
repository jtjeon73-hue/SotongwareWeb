import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import type { User } from "firebase/auth";
import { getFirestoreDb, getFirebaseFunctions } from "@/lib/firebase";
import { AUTH_POLICY_VERSION } from "@/lib/auth-safety";
import type { Entitlement, UserProfile } from "@/types/membership";

export interface EnsureProfileOptions {
  locale?: "ko" | "en";
  consentAt?: string;
  policyVersion?: string;
}

function timestampToIso(value: Timestamp | string | undefined): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
}

function mapProfile(uid: string, data: Record<string, unknown>, emailVerifiedFallback: boolean): UserProfile {
  return {
    uid,
    email: typeof data.email === "string" ? data.email : "",
    displayName: typeof data.displayName === "string" ? data.displayName : "",
    role: data.role === "admin" ? "admin" : "member",
    status: data.status === "suspended" ? "suspended" : "active",
    membershipGrade: data.membershipGrade === "basic" ? "basic" : "free",
    locale: data.locale === "en" ? "en" : "ko",
    consentAt: typeof data.consentAt === "string" ? data.consentAt : null,
    policyVersion: typeof data.policyVersion === "string" ? data.policyVersion : null,
    createdAt: timestampToIso(data.createdAt as Timestamp | string | undefined),
    lastLoginAt: timestampToIso(data.lastLoginAt as Timestamp | string | undefined),
    emailVerified: typeof data.emailVerified === "boolean" ? data.emailVerified : emailVerifiedFallback,
  };
}

/**
 * Load or recover membership profile.
 * Privilege fields are created only by server (Auth trigger / callable).
 * Client never writes role / status / membershipGrade / entitlements.
 */
export async function ensureUserProfile(
  user: User,
  options: EnsureProfileOptions = {},
): Promise<UserProfile> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firebase가 설정되지 않았습니다.");
  }

  const ref = doc(db, "users", user.uid);
  let snap = await getDoc(ref);

  if (!snap.exists()) {
    const functions = getFirebaseFunctions();
    if (!functions) {
      throw new Error("회원 프로필 서버 함수를 사용할 수 없습니다.");
    }
    const ensure = httpsCallable(functions, "ensureMyMemberProfile");
    await ensure({
      locale: options.locale ?? "ko",
      consentAt: options.consentAt ?? null,
      policyVersion: options.policyVersion ?? AUTH_POLICY_VERSION,
    });
    snap = await getDoc(ref);
    if (!snap.exists()) {
      throw new Error("회원 프로필을 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  } else {
    // Safe client fields only — Rules must also enforce
    await setDoc(
      ref,
      {
        lastLoginAt: serverTimestamp(),
        emailVerified: user.emailVerified,
        ...(options.locale ? { locale: options.locale } : {}),
        ...(options.consentAt ? { consentAt: options.consentAt } : {}),
        ...(options.policyVersion ? { policyVersion: options.policyVersion } : {}),
      },
      { merge: true },
    );
    snap = await getDoc(ref);
  }

  return mapProfile(user.uid, snap.data() as Record<string, unknown>, user.emailVerified);
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
      grantedAt: timestampToIso(data.grantedAt),
      expiresAt: data.expiresAt ? timestampToIso(data.expiresAt) : null,
    } as Entitlement;
  });
}
