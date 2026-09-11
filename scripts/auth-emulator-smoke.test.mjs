/**
 * Auth + Functions emulator smoke + consent negative/positive.
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
const TERMS = "2026-09-11";
const PRIVACY = "2026-09-11";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function expectReject(fn, label) {
  try {
    await fn();
    throw new Error(`expected reject: ${label}`);
  } catch (e) {
    if (e && e.message && String(e.message).startsWith("expected reject")) throw e;
    console.log(`PASS: reject ${label} (${e.code || e.message})`);
  }
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

  const ensure = httpsCallable(functions, "ensureMyMemberProfile");
  console.log("AUTH_TARGET: emulator only");

  await expectReject(() => ensure({ termsVersion: TERMS, privacyVersion: PRIVACY }), "unauthenticated callable");

  const email = `phase2a_${Date.now()}@example.com`;
  const password = "test-pass-123";
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;
  console.log("PASS: signup");

  // Bad policy versions
  await expectReject(
    () => ensure({ termsVersion: "attacker", privacyVersion: PRIVACY }),
    "arbitrary terms version",
  );
  await expectReject(
    () => ensure({ termsVersion: "2020-01-01", privacyVersion: PRIVACY }),
    "previous terms version",
  );
  await expectReject(
    () => ensure({ termsVersion: TERMS, privacyVersion: "" }),
    "empty privacy version",
  );
  await expectReject(
    () => ensure({ termsVersion: TERMS, privacyVersion: PRIVACY, targetUid: "other-user" }),
    "other uid target",
  );

  let profile = null;
  for (let i = 0; i < 25; i++) {
    await ensure({ locale: "ko", termsVersion: TERMS, privacyVersion: PRIVACY });
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      profile = snap.data();
      break;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  assert(profile, "profile not provisioned");
  assert(profile.role === "member", "role must be member");
  assert(profile.membershipGrade === "free", "grade must be free");
  assert(profile.status === "active", "status must be active after consent");
  assert(profile.termsVersion === TERMS, "termsVersion server");
  assert(profile.privacyVersion === PRIVACY, "privacyVersion server");
  assert(profile.termsAcceptedAt, "termsAcceptedAt server timestamp");
  assert(profile.privacyAcceptedAt, "privacyAcceptedAt server timestamp");
  assert(profile.email === email, "email from Auth");
  // Client clock must not be stored as ISO string we sent — FieldValue server timestamp object/Timestamp
  assert(typeof profile.consentAt !== "string" || !profile.consentAt.startsWith("1999"), "no client clock");
  console.log("PASS: server Free profile + consent");

  // Idempotent re-accept
  await ensure({ locale: "ko", termsVersion: TERMS, privacyVersion: PRIVACY });
  const again = (await getDoc(doc(db, "users", uid))).data();
  assert(again.status === "active" && again.role === "member", "idempotent");
  console.log("PASS: idempotent consent");

  // Negative client field writes
  const denies = [
    ["email", { email: "x@evil.com" }],
    ["emailVerified", { emailVerified: true }],
    ["consentAt", { consentAt: "1999-01-01T00:00:00.000Z" }],
    ["policyVersion", { policyVersion: "x" }],
    ["role", { role: "admin" }],
    ["paid", { paid: true }],
  ];
  for (const [name, patch] of denies) {
    let denied = false;
    try {
      await setDoc(doc(db, "users", uid), patch, { merge: true });
    } catch {
      denied = true;
    }
    assert(denied, `${name} should deny`);
    console.log(`PASS: client ${name} blocked`);
  }

  // locale allow
  await setDoc(doc(db, "users", uid), { locale: "en" }, { merge: true });
  assert((await getDoc(doc(db, "users", uid))).data().locale === "en", "locale allow");
  console.log("PASS: locale allow");

  const token = await cred.user.getIdTokenResult();
  assert(token.claims.role !== "admin", "no admin claim");
  console.log("PASS: Admin claim preserved (unset)");

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
