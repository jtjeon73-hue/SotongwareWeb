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
 * Live Email/Password login & reset — off by default until providers are intentionally enabled.
 * Emulator always allows. Signup enable also opens email/password for the same soft-launch gate.
 */
export function isEmailPasswordAuthEnabled(): boolean {
  if (isAuthEmulatorEnabled()) return true;
  return (
    process.env.NEXT_PUBLIC_AUTH_EMAIL_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_AUTH_SIGNUP_ENABLED === "true"
  );
}

/**
 * Prevent accidental local auth against production.
 * Development builds require emulator unless NEXT_PUBLIC_AUTH_ALLOW_PROD=true.
 */
export function assertAuthEnvironmentSafe(): void {
  if (typeof window === "undefined") return;
  const allowProd = process.env.NEXT_PUBLIC_AUTH_ALLOW_PROD === "true";
  if (process.env.NODE_ENV === "development" && !isAuthEmulatorEnabled() && !allowProd) {
    const err = new Error("Auth environment not ready");
    (err as Error & { code: string }).code = "sw/auth-env-unsafe";
    throw err;
  }
}

export function getAuthTargetLabel(): string {
  if (isAuthEmulatorEnabled()) return "Firebase Emulator (로컬 테스트)";
  return "Firebase 운영 Auth";
}

export function makeAuthCodedError(code: string, message = "auth"): Error {
  const err = new Error(message);
  (err as Error & { code: string }).code = code;
  return err;
}
