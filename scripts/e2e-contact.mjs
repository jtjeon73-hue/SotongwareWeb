/**
 * Contact inquiry E2E — Firebase Emulator (functions + firestore)
 * Usage: firebase emulators:exec --only functions,firestore --project sotongware "node scripts/e2e-contact.mjs"
 */
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore, collection, addDoc } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions, httpsCallable } from "firebase/functions";
import { initializeApp as initAdmin, getApps } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "sotongware.firebaseapp.com",
  projectId: "sotongware",
};

const app = initializeApp(firebaseConfig);
const clientDb = getFirestore(app);
const functions = getFunctions(app, "us-central1");

connectFirestoreEmulator(clientDb, "127.0.0.1", 8080);
connectFunctionsEmulator(functions, "127.0.0.1", 5001);

process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
if (!getApps().length) {
  initAdmin({ projectId: "sotongware" });
}
const adminDb = getAdminFirestore();

const TEST_PAYLOAD = {
  name: "SotongWare Test",
  email: "e2e-test@sotongware.local",
  phone: "010-0000-0000",
  company: "E2E Test",
  inquiryType: "app",
  subject: "[TEST] SotongWare Contact E2E",
  message: "[TEST] Firebase Functions 및 Firestore 문의 저장 검증용입니다.",
  source: "sotongware-web",
  sourcePage: "/contact",
  productSlug: "electrical-inspection-check",
};

async function waitForFunctionsReady() {
  const submit = httpsCallable(functions, "submitContactInquiry");
  for (let i = 0; i < 30; i++) {
    try {
      await submit({ website: "probe" });
      return submit;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error("Functions emulator not ready");
}

async function run() {
  console.log("0) waiting for functions emulator...");
  const submit = await waitForFunctionsReady();

  console.log("1) client direct Firestore write (expect PERMISSION_DENIED)...");
  let clientWriteBlocked = false;
  try {
    await addDoc(collection(clientDb, "contactInquiries"), { test: true });
  } catch {
    clientWriteBlocked = true;
  }
  if (!clientWriteBlocked) throw new Error("Client direct write was not blocked");
  console.log("   PASS client direct write blocked");

  console.log("2) submitContactInquiry first call...");
  const first = await submit(TEST_PAYLOAD);
  if (!first.data?.success) throw new Error("First submit failed");
  console.log("   PASS id:", first.data.id);

  console.log("3) duplicate submit (expect error)...");
  let duplicateBlocked = false;
  try {
    await submit(TEST_PAYLOAD);
  } catch (err) {
    duplicateBlocked = true;
    const code = err && typeof err === "object" && "code" in err ? String(err.code) : String(err);
    console.log("   PASS duplicate blocked:", code);
  }
  if (!duplicateBlocked) throw new Error("Duplicate was not blocked");

  console.log("4) honeypot submit (expect ignored success)...");
  const honeypot = await submit({ ...TEST_PAYLOAD, subject: "[TEST] honeypot", website: "spam-bot" });
  if (!honeypot.data?.success || honeypot.data.id !== "ignored") {
    throw new Error("Honeypot handling failed");
  }
  console.log("   PASS honeypot ignored");

  console.log("5) Admin SDK Firestore document check...");
  const snap = await adminDb
    .collection("contactInquiries")
    .where("subject", "==", TEST_PAYLOAD.subject)
    .limit(1)
    .get();
  if (snap.empty) throw new Error("Document not found in Firestore");
  const doc = snap.docs[0].data();
  if (doc.inquiryType !== "app") throw new Error("inquiryType mismatch");
  if (doc.status !== "new") throw new Error("status mismatch");
  if (doc.source !== "sotongware-web") throw new Error("source mismatch");
  if (!doc.createdAt) throw new Error("createdAt missing");
  console.log("   PASS inquiryType=app status=new source=sotongware-web createdAt=present");

  console.log("\nE2E EMULATOR: ALL PASS");
}

run().catch((err) => {
  console.error("\nE2E EMULATOR: FAIL", err);
  process.exit(1);
});
