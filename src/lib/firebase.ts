import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator, type Functions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const FUNCTIONS_REGION = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION ?? "us-central1";
/** Emulator host — keep 127.0.0.1 consistent with firebase.json emulator bind. */
const EMULATOR_HOST = "127.0.0.1";

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

export function isFirebaseEmulatorClient(): boolean {
  return process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR === "true";
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let functions: Functions | undefined;
let authEmulatorConnected = false;
let firestoreEmulatorConnected = false;
let functionsEmulatorConnected = false;

function connectAuthAndFirestoreEmulators(firebaseApp: FirebaseApp): void {
  if (!isFirebaseEmulatorClient()) return;
  if (!authEmulatorConnected) {
    connectAuthEmulator(getAuth(firebaseApp), `http://${EMULATOR_HOST}:9099`, {
      disableWarnings: true,
    });
    authEmulatorConnected = true;
  }
  if (!firestoreEmulatorConnected) {
    connectFirestoreEmulator(getFirestore(firebaseApp), EMULATOR_HOST, 8080);
    firestoreEmulatorConnected = true;
  }
}

function connectFunctionsEmulatorIfNeeded(functionsInstance: Functions): void {
  if (!isFirebaseEmulatorClient() || functionsEmulatorConnected) return;
  connectFunctionsEmulator(functionsInstance, EMULATOR_HOST, 5001);
  functionsEmulatorConnected = true;
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);
    connectAuthAndFirestoreEmulators(app);
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!auth) {
    auth = getAuth(firebaseApp);
  }
  return auth;
}

export function getFirestoreDb(): Firestore | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!db) {
    db = getFirestore(firebaseApp);
  }
  return db;
}

/**
 * Always return the same Functions instance that was connected to the emulator.
 * Connecting on a throwaway getFunctions() handle previously risked racing HMR.
 */
export function getFirebaseFunctions(): Functions | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!functions) {
    functions = getFunctions(firebaseApp, FUNCTIONS_REGION);
    connectFunctionsEmulatorIfNeeded(functions);
  }
  return functions;
}
