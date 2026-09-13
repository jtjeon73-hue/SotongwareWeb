/**
 * Client-side PG mode — never reads or embeds secrets.
 * Emulator ≠ mock: only NEXT_PUBLIC_COMMERCE_PG_MODE (and prepare.mockCheckout) decides.
 */
import { isAuthEmulatorEnabled } from "@/lib/auth-safety";

export type ClientPgMode = "mock" | "test";

export function isLiveClientKey(key: string): boolean {
  return /^live_/i.test(key);
}

export function isTestClientKey(key: string): boolean {
  return /^test_/i.test(key);
}

/** Hosting/production must not expose mock or Toss test checkout UI. */
export function isCommerceTestSurfaceBlocked(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Resolve intended client checkout mode.
 * Prefer prepareCommerceCheckout.mockCheckout / pgMode at runtime.
 */
export function resolveClientPgMode(): ClientPgMode | null {
  if (isCommerceTestSurfaceBlocked()) {
    return null;
  }
  const explicit = (process.env.NEXT_PUBLIC_COMMERCE_PG_MODE || "").toLowerCase();
  if (explicit === "live") return null;
  if (explicit === "mock" || explicit === "test") return explicit;
  if (process.env.NEXT_PUBLIC_COMMERCE_MOCK_CHECKOUT === "true") return "mock";
  if (isAuthEmulatorEnabled() && !process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY) return "mock";
  if (process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY) return "test";
  return null;
}

export function isAllowedCheckoutOrigin(origin: string): boolean {
  try {
    const u = new URL(origin);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return true;
    if (u.hostname === "sotongware.web.app" || u.hostname === "sotongware.firebaseapp.com") {
      return true;
    }
    if (u.hostname.endsWith(".web.app") && u.hostname.includes("sotongware")) return true;
    return false;
  } catch {
    return false;
  }
}

export function buildCheckoutRedirectUrls(orderId: string): {
  successUrl: string;
  failUrl: string;
} {
  if (typeof window === "undefined") {
    throw new Error("결제 리다이렉트를 준비할 수 없습니다.");
  }
  const origin = window.location.origin;
  if (!isAllowedCheckoutOrigin(origin)) {
    throw new Error("허용되지 않은 결제 복귀 주소입니다.");
  }
  const q = encodeURIComponent(orderId);
  return {
    successUrl: `${origin}/checkout/result?orderId=${q}`,
    failUrl: `${origin}/checkout/fail?orderId=${q}`,
  };
}
