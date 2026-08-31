import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator, type Functions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let functions: Functions | undefined;
let emulatorsConnected = false;

function connectEmulatorsIfNeeded(firebaseApp: FirebaseApp): void {
  if (emulatorsConnected || process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR !== "true") return;
  const authInstance = getAuth(firebaseApp);
  const dbInstance = getFirestore(firebaseApp);
  const functionsInstance = getFunctions(
    firebaseApp,
    process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION ?? "us-central1",
  );
  connectAuthEmulator(authInstance, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(dbInstance, "127.0.0.1", 8080);
  connectFunctionsEmulator(functionsInstance, "127.0.0.1", 5001);
  emulatorsConnected = true;
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);
    connectEmulatorsIfNeeded(app);
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

export function getFirebaseFunctions(): Functions | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!functions) {
    const region = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION ?? "us-central1";
    functions = getFunctions(firebaseApp, region);
  }
  return functions;
}
