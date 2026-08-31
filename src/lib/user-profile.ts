import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { getFirestoreDb } from "@/lib/firebase";
import type { Entitlement, UserProfile } from "@/types/membership";

function timestampToIso(value: Timestamp | string | undefined): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
}

export async function ensureUserProfile(user: User, displayName?: string): Promise<UserProfile> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firebase가 설정되지 않았습니다.");
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const now = new Date().toISOString();

  if (snap.exists()) {
    const data = snap.data();
    await setDoc(
      ref,
      {
        lastLoginAt: serverTimestamp(),
        emailVerified: user.emailVerified,
        displayName: displayName ?? data.displayName ?? user.displayName ?? "",
      },
      { merge: true },
    );
    return {
      uid: user.uid,
      email: user.email ?? data.email ?? "",
      displayName: displayName ?? data.displayName ?? user.displayName ?? "",
      role: data.role ?? "member",
      status: data.status ?? "active",
      createdAt: timestampToIso(data.createdAt),
      lastLoginAt: now,
      emailVerified: user.emailVerified,
    };
  }

  const profile: Omit<UserProfile, "createdAt" | "lastLoginAt"> & {
    createdAt: ReturnType<typeof serverTimestamp>;
    lastLoginAt: ReturnType<typeof serverTimestamp>;
  } = {
    uid: user.uid,
    email: user.email ?? "",
    displayName: displayName ?? user.displayName ?? "",
    role: "member",
    status: "active",
    emailVerified: user.emailVerified,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  await setDoc(ref, profile);

  return {
    uid: user.uid,
    email: profile.email,
    displayName: profile.displayName,
    role: profile.role,
    status: profile.status,
    createdAt: now,
    lastLoginAt: now,
    emailVerified: user.emailVerified,
  };
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    uid,
    email: data.email ?? "",
    displayName: data.displayName ?? "",
    role: data.role ?? "member",
    status: data.status ?? "active",
    createdAt: timestampToIso(data.createdAt),
    lastLoginAt: timestampToIso(data.lastLoginAt),
    emailVerified: Boolean(data.emailVerified),
  };
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
