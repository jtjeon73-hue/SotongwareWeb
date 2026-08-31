/**
 * Firestore Security Rules emulator tests
 * Run: npm run test:firestore:rules
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ID = "sotongware-rules-test";
const RULES = fs.readFileSync(path.join(__dirname, "..", "firestore.rules"), "utf8");

const CONTENT = {
  memberPublished: "member-published",
  premiumPublished: "premium-published",
  memberDraft: "member-draft",
  memberComingSoon: "member-coming-soon",
};

let testEnv;

async function seedData() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();

    await db.doc("users/active-user").set({
      uid: "active-user",
      email: "active@example.com",
      role: "member",
      status: "active",
    });
    await db.doc("users/suspended-user").set({
      uid: "suspended-user",
      email: "suspended@example.com",
      role: "member",
      status: "suspended",
    });
    await db.doc("users/premium-user").set({
      uid: "premium-user",
      email: "premium@example.com",
      role: "member",
      status: "active",
    });
    await db.doc("users/member-only-user").set({
      uid: "member-only-user",
      email: "memberonly@example.com",
      role: "member",
      status: "active",
    });
    await db.doc("users/expired-user").set({
      uid: "expired-user",
      email: "expired@example.com",
      role: "member",
      status: "active",
    });
    await db.doc("users/revoked-user").set({
      uid: "revoked-user",
      email: "revoked@example.com",
      role: "member",
      status: "active",
    });

    const past = new Date("2020-01-01T00:00:00Z");
    const future = new Date("2099-01-01T00:00:00Z");

    await db.doc("users/premium-user/entitlements/knowledge").set({
      businessId: "knowledge",
      plan: "premium",
      status: "active",
      grantedAt: past,
      expiresAt: future,
    });
    await db.doc("users/member-only-user/entitlements/knowledge").set({
      businessId: "knowledge",
      plan: "member",
      status: "active",
      grantedAt: past,
    });
    await db.doc("users/expired-user/entitlements/knowledge").set({
      businessId: "knowledge",
      plan: "premium",
      status: "active",
      grantedAt: past,
      expiresAt: past,
    });
    await db.doc("users/revoked-user/entitlements/knowledge").set({
      businessId: "knowledge",
      plan: "premium",
      status: "revoked",
      grantedAt: past,
    });

    await db.doc(`memberContents/${CONTENT.memberPublished}`).set({
      businessId: "knowledge",
      accessLevel: "member",
      publicationStatus: "published",
      body: "member secret",
    });
    await db.doc(`memberContents/${CONTENT.premiumPublished}`).set({
      businessId: "knowledge",
      accessLevel: "premium",
      publicationStatus: "published",
      body: "premium secret",
    });
    await db.doc(`memberContents/${CONTENT.memberDraft}`).set({
      businessId: "knowledge",
      accessLevel: "member",
      publicationStatus: "draft",
      body: "draft secret",
    });
    await db.doc(`memberContents/${CONTENT.memberComingSoon}`).set({
      businessId: "knowledge",
      accessLevel: "member",
      publicationStatus: "comingSoon",
      body: "soon secret",
    });
  });
}

function authedDb(uid) {
  return testEnv.authenticatedContext(uid).firestore();
}

function anonDb() {
  return testEnv.unauthenticatedContext().firestore();
}

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`PASS: ${name}`);
    return true;
  } catch (error) {
    console.error(`FAIL: ${name}`);
    console.error(error);
    return false;
  }
}

async function main() {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: RULES },
  });

  await seedData();

  const results = await Promise.all([
    runTest("비로그인 member 읽기 거부", async () => {
      await assertFails(
        anonDb().doc(`memberContents/${CONTENT.memberPublished}`).get(),
      );
    }),
    runTest("로그인 active 회원 member 읽기 허용", async () => {
      await assertSucceeds(
        authedDb("active-user").doc(`memberContents/${CONTENT.memberPublished}`).get(),
      );
    }),
    runTest("suspended 회원 읽기 거부", async () => {
      await assertFails(
        authedDb("suspended-user").doc(`memberContents/${CONTENT.memberPublished}`).get(),
      );
    }),
    runTest("entitlement 없음 premium 거부", async () => {
      await assertFails(
        authedDb("active-user").doc(`memberContents/${CONTENT.premiumPublished}`).get(),
      );
    }),
    runTest("member/free entitlement로 premium 거부", async () => {
      await assertFails(
        authedDb("member-only-user").doc(`memberContents/${CONTENT.premiumPublished}`).get(),
      );
    }),
    runTest("active premium entitlement 허용", async () => {
      await assertSucceeds(
        authedDb("premium-user").doc(`memberContents/${CONTENT.premiumPublished}`).get(),
      );
    }),
    runTest("expired entitlement 거부", async () => {
      await assertFails(
        authedDb("expired-user").doc(`memberContents/${CONTENT.premiumPublished}`).get(),
      );
    }),
    runTest("revoked entitlement 거부", async () => {
      await assertFails(
        authedDb("revoked-user").doc(`memberContents/${CONTENT.premiumPublished}`).get(),
      );
    }),
    runTest("draft 읽기 거부", async () => {
      await assertFails(
        authedDb("active-user").doc(`memberContents/${CONTENT.memberDraft}`).get(),
      );
    }),
    runTest("comingSoon 읽기 거부", async () => {
      await assertFails(
        authedDb("active-user").doc(`memberContents/${CONTENT.memberComingSoon}`).get(),
      );
    }),
  ]);

  await testEnv.cleanup();

  const passed = results.filter(Boolean).length;
  const total = results.length;
  console.log(`\nRules tests: ${passed}/${total} passed`);

  if (passed !== total) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
