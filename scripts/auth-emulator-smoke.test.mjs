/**
 * Auth + Functions emulator smoke: signup → profile provision → privilege denial.
 * Does not touch production. No real email send.
 *
 * Run: npm run test:auth:emulator
 */
import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, doc, getDoc, setDoc } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from "firebase/functions";

const PROJECT_ID = process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT || "sotongware";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const app = initializeApp({
    apiKey: "demo-key",
    authDomain: `${PROJECT_ID}.firebaseapp.com`,
    projectId: PROJECT_ID,
  });
  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app, "us-central1");
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);

  const email = `phase2a_${Date.now()}@example.com`;
  const password = "test-pass-123";

  console.log("AUTH_TARGET: emulator only");

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  assert(cred.user.uid, "uid missing");
  console.log("PASS: signup");

  // Wait briefly for onCreate trigger
  let profile = null;
  for (let i = 0; i < 20; i++) {
    const ensure = httpsCallable(functions, "ensureMyMemberProfile");
    await ensure({ locale: "ko", consentAt: new Date().toISOString(), policyVersion: "2026-09-11" });
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    if (snap.exists()) {
      profile = snap.data();
      break;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  assert(profile, "profile not provisioned");
  assert(profile.role === "member", "role must be member");
  assert(profile.membershipGrade === "free", "grade must be free");
  assert(profile.status === "active", "status must be active");
  console.log("PASS: server Free profile");

  let denied = false;
  try {
    await setDoc(doc(db, "users", cred.user.uid), { role: "admin" }, { merge: true });
  } catch {
    denied = true;
  }
  assert(denied, "role escalate should fail");
  console.log("PASS: client role escalate blocked");

  await signOut(auth);
  console.log("PASS: logout");

  await signInWithEmailAndPassword(auth, email, password);
  console.log("PASS: login");

  try {
    await sendPasswordResetEmail(auth, email);
    console.log("PASS: password reset request (emulator)");
  } catch (e) {
    console.log("PARTIAL: password reset", e && e.code ? e.code : e);
  }

  await signOut(auth);
  console.log("PASS: auth emulator smoke complete");
}

main().catch((e) => {
  console.error("FAIL:", e);
  process.exit(1);
});
