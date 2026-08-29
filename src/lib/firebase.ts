import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
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
let functions: Functions | undefined;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseFunctions(): Functions | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!functions) {
    const region = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION ?? "us-central1";
    functions = getFunctions(firebaseApp, region);
    if (process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR === "true") {
      connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    }
  }
  return functions;
}
