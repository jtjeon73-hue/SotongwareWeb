/**
 * Auth Phase 2A — environment fail-safe helpers.
 * Never print secrets. Emulator vs production must be explicit.
 */

/** @deprecated Prefer CURRENT_TERMS_VERSION / CURRENT_PRIVACY_VERSION — legacy display alias */
export const AUTH_POLICY_VERSION = "2026-09-11";

export const CURRENT_TERMS_VERSION = "2026-09-11";
export const CURRENT_PRIVACY_VERSION = "2026-09-11";

export function isAuthEmulatorEnabled(): boolean {
  return process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR === "true";
}

export function isGoogleAuthUiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true";
}

/** Real email signup against live Auth — off unless explicitly enabled or emulator. */
export function isEmailSignupEnabled(): boolean {
  if (isAuthEmulatorEnabled()) return true;
  return process.env.NEXT_PUBLIC_AUTH_SIGNUP_ENABLED === "true";
}

/**
 * Prevent accidental local auth against production.
 * Development builds require emulator unless NEXT_PUBLIC_AUTH_ALLOW_PROD=true.
 */
export function assertAuthEnvironmentSafe(): void {
  if (typeof window === "undefined") return;
  const allowProd = process.env.NEXT_PUBLIC_AUTH_ALLOW_PROD === "true";
  if (process.env.NODE_ENV === "development" && !isAuthEmulatorEnabled() && !allowProd) {
    throw new Error(
      "개발 모드에서는 Firebase Auth Emulator가 필요합니다. .env.local에 NEXT_PUBLIC_FIREBASE_USE_EMULATOR=true 를 설정하세요.",
    );
  }
}

export function getAuthTargetLabel(): string {
  if (isAuthEmulatorEnabled()) return "Firebase Emulator (로컬 테스트)";
  return "Firebase 운영 Auth";
}
