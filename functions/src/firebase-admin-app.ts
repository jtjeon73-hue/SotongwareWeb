import { getApp, initializeApp, type App } from "firebase-admin/app";

/**
 * Idempotent Firebase Admin default-app bootstrap.
 * Call before getFirestore()/getStorage() — safe under concurrent callers.
 * Do not invoke at module load (Firebase CLI discovery must not require ADC).
 *
 * Uses getApp() (default) rather than getApps().length — named-only apps must
 * not skip default initialization (root cause of db_init failures).
 */
export function ensureFirebaseAdminApp(): App {
  try {
    return getApp();
  } catch {
    // Default app missing (zero apps, or only named apps).
  }
  try {
    return initializeApp();
  } catch (err) {
    // Concurrent caller may have finished initializing the default app.
    try {
      return getApp();
    } catch {
      throw err;
    }
  }
}
