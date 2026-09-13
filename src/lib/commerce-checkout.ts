/**
 * Client-side commerce checkout helpers (no secrets).
 */
import { httpsCallable } from "firebase/functions";
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { getFirebaseFunctions, getFirestoreDb } from "@/lib/firebase";
import {
  isAuthEmulatorEnabled,
  isEmailPasswordAuthEnabled,
  isEmailSignupEnabled,
  isGoogleAuthUiEnabled,
} from "@/lib/auth-safety";

export function isCommerceCheckoutAvailable(): boolean {
  // Production Hosting must not expose mock/test checkout this phase
  if (process.env.NODE_ENV === "production") return false;
  if (isAuthEmulatorEnabled()) return true;
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";
  const mock = process.env.NEXT_PUBLIC_COMMERCE_MOCK_CHECKOUT === "true";
  const mode = (process.env.NEXT_PUBLIC_COMMERCE_PG_MODE || "").toLowerCase();
  if (mode === "live") return false;
  return Boolean(clientKey) || mock || mode === "mock" || mode === "test";
}

export function isAuthReadyForCheckout(): boolean {
  if (isAuthEmulatorEnabled()) return true;
  return (
    isEmailPasswordAuthEnabled() ||
    isEmailSignupEnabled() ||
    isGoogleAuthUiEnabled()
  );
}

export function getTossClientKey(): string | null {
  const key = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";
  if (!key) return null;
  if (/^live_/i.test(key)) return null;
  if (process.env.NODE_ENV === "production") return null;
  if (!/^test_/i.test(key)) return null;
  return key;
}

export function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `idem_${crypto.randomUUID().replace(/-/g, "")}`;
  }
  return `idem_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

export type PrepareCheckoutResult = {
  orderId: string;
  amount: number;
  currency: "KRW";
  orderName: string;
  productId: string;
  status: string;
  provider: string;
  customerKey?: string;
  pgMode?: "mock" | "test";
  mockCheckout?: boolean;
};

function requireFunctions() {
  const functions = getFirebaseFunctions();
  if (!functions) {
    const err = new Error("결제 서비스 준비 중입니다.");
    (err as Error & { code: string }).code = "sw/commerce-unavailable";
    throw err;
  }
  return functions;
}

export async function prepareCheckout(input: {
  productId: string;
  idempotencyKey: string;
}): Promise<PrepareCheckoutResult> {
  const fn = httpsCallable(requireFunctions(), "prepareCommerceCheckout");
  const res = await fn(input);
  return res.data as PrepareCheckoutResult;
}

export async function confirmPayment(input: {
  orderId: string;
  paymentKey: string;
  amount: number;
}): Promise<{ orderId: string; status: string; entitlementId: string | null; duplicate?: boolean }> {
  const fn = httpsCallable(requireFunctions(), "confirmCommercePayment");
  const res = await fn(input);
  return res.data as {
    orderId: string;
    status: string;
    entitlementId: string | null;
    duplicate?: boolean;
  };
}

export type CommerceOrderPublic = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  productTitle: string;
  productId: string;
  createdAt?: unknown;
  paidAt?: unknown;
};

function mapOrder(id: string, data: Record<string, unknown>): CommerceOrderPublic {
  const snap = (data.productSnapshot || {}) as Record<string, unknown>;
  return {
    id,
    amount: Number(data.amount || 0),
    currency: String(data.currency || "KRW"),
    status: String(data.status || ""),
    productTitle: String(snap.title || ""),
    productId: String(snap.productId || ""),
    createdAt: data.createdAt,
    paidAt: data.paidAt,
  };
}

export async function fetchMyOrders(uid: string): Promise<CommerceOrderPublic[]> {
  const db = getFirestoreDb();
  if (!db) return [];
  try {
    const q = query(
      collection(db, "commerceOrders"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc"),
      limit(50),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapOrder(d.id, d.data() as Record<string, unknown>));
  } catch {
    const snap = await getDocs(
      query(collection(db, "commerceOrders"), where("userId", "==", uid), limit(50)),
    );
    return snap.docs.map((d) => mapOrder(d.id, d.data() as Record<string, unknown>));
  }
}

export async function fetchMyOrder(uid: string, orderId: string): Promise<CommerceOrderPublic | null> {
  const db = getFirestoreDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, "commerceOrders", orderId));
  if (!snap.exists()) return null;
  const data = snap.data() as Record<string, unknown>;
  if (data.userId !== uid) return null;
  return mapOrder(snap.id, data);
}

export async function fetchPublishedProduct(productId: string): Promise<{
  id: string;
  title: string;
  summary: string;
  amount: number;
  currency: string;
  status: string;
  pricingType: string;
} | null> {
  const db = getFirestoreDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, "commerceProducts", productId));
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.status !== "published") return null;
  return {
    id: snap.id,
    title: String(data.title || ""),
    summary: String(data.summary || ""),
    amount: Number(data.amount || 0),
    currency: String(data.currency || "KRW"),
    status: String(data.status || ""),
    pricingType: String(data.pricingType || ""),
  };
}

/** Fixture catalog for emulator/mock UI only — never written to production by client */
export const MOCK_CHECKOUT_PRODUCT = {
  id: "fixture_one_time_ebook",
  title: "단건 전자책 (테스트 픽스처)",
  titleEn: "One-time ebook (test fixture)",
  summary: "Emulator/mock 전용. 운영 Firestore에 자동 생성되지 않습니다.",
  summaryEn: "Emulator/mock only. Not auto-created in production Firestore.",
  amount: 12000,
  currency: "KRW" as const,
  pricingType: "one_time" as const,
};
