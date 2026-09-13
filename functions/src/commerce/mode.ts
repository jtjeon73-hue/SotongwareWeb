import { randomBytes, createHash } from "node:crypto";
import { CommerceError } from "./errors";

export type PgMode = "mock" | "test" | "live";

/** Live is always refused in this phase. */
export function resolvePgMode(env: NodeJS.ProcessEnv = process.env): PgMode {
  const explicit = (env.COMMERCE_PG_MODE || "").toLowerCase();
  if (explicit === "live" || (env.TOSS_SECRET_KEY && /^live_/i.test(env.TOSS_SECRET_KEY))) {
    throw new CommerceError(
      "mode/live-forbidden",
      "운영 결제는 아직 열리지 않았습니다.",
      "failed-precondition",
    );
  }
  if (explicit === "mock" || explicit === "test") {
    return explicit;
  }
  // Emulator defaults to mock unless COMMERCE_PG_MODE=test is set explicitly above
  if (env.FUNCTIONS_EMULATOR === "true") return "mock";
  if (env.TOSS_SECRET_KEY) {
    if (/^test_/i.test(env.TOSS_SECRET_KEY)) return "test";
  }
  return "mock";
}

export function assertSecretMatchesMode(secret: string, mode: PgMode): void {
  if (!secret && mode === "test") {
    throw new CommerceError("keys/missing-secret", "결제 서비스 준비 중입니다.", "failed-precondition");
  }
  if (!secret) return;
  if (/^live_/i.test(secret)) {
    throw new CommerceError("keys/live-forbidden", "운영 결제는 아직 열리지 않았습니다.", "failed-precondition");
  }
  if (mode === "test" && !/^test_/i.test(secret)) {
    throw new CommerceError("keys/secret-not-test", "결제 서비스 설정 오류가 있습니다.", "failed-precondition");
  }
  if (mode === "mock" && secret) {
    // mock ignores secret; ok
  }
}

/** Toss customerKey: 2–50 chars, must include at least one special among -_=.@ */
export function createTossCustomerKey(): string {
  const raw = randomBytes(16).toString("base64url").replace(/[^A-Za-z0-9]/g, "x");
  const key = `ck_${raw}`.slice(0, 50);
  if (!/[-_=.@]/.test(key)) {
    return `${key.slice(0, 48)}_x`;
  }
  return key;
}

export function assertValidCustomerKey(key: string): void {
  if (typeof key !== "string" || key.length < 2 || key.length > 50) {
    throw new CommerceError("customerKey/invalid", "결제 식별자가 올바르지 않습니다.", "internal");
  }
  if (!/[-_=.@]/.test(key)) {
    throw new CommerceError("customerKey/invalid", "결제 식별자가 올바르지 않습니다.", "internal");
  }
  if (/@/.test(key) && key.includes(".")) {
    // could be email-like — still reject if looks like email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) {
      throw new CommerceError("customerKey/pii", "결제 식별자가 올바르지 않습니다.", "internal");
    }
  }
}

export function hashUidForAudit(uid: string): string {
  return createHash("sha256").update(uid).digest("hex").slice(0, 12);
}

export function isAllowedRedirectOrigin(origin: string, env: NodeJS.ProcessEnv = process.env): boolean {
  try {
    const u = new URL(origin);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return true;
    if (u.hostname === "sotongware.web.app" || u.hostname === "sotongware.firebaseapp.com") return true;
    if (u.hostname.endsWith(".web.app") && u.hostname.includes("sotongware")) return true;
    const extra = (env.COMMERCE_ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    return extra.includes(u.origin);
  } catch {
    return false;
  }
}
