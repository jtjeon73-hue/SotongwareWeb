/**
 * Membership security negative tests (Firestore Rules emulator).
 * Run via: npm run test:membership:security
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
const PROJECT_ID = "sotongware-membership-security";
const RULES = fs.readFileSync(path.join(__dirname, "..", "firestore.rules"), "utf8");

let testEnv;

async function seed() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.doc("users/alice").set({
      uid: "alice",
      email: "alice@example.com",
      role: "member",
      status: "active",
      locale: "ko",
      displayName: "Alice",
    });
    await db.doc("users/bob").set({
      uid: "bob",
      email: "bob@example.com",
      role: "member",
      status: "active",
      locale: "en",
      displayName: "Bob",
    });
    await db.doc("users/fake-admin-doc").set({
      uid: "fake-admin-doc",
      email: "fakeadmin@example.com",
      role: "admin",
      status: "active",
    });
  });
}

function db(uid, claims = {}) {
  return testEnv.authenticatedContext(uid, claims).firestore();
}

function anon() {
  return testEnv.unauthenticatedContext().firestore();
}

async function run(name, fn) {
  try {
    await fn();
    console.log(`PASS: ${name}`);
    return true;
  } catch (e) {
    console.error(`FAIL: ${name}`);
    console.error(e);
    return false;
  }
}

async function main() {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: RULES },
  });
  await seed();

  const results = await Promise.all([
    run("비로그인 회원 문서 read 거부", async () => {
      await assertFails(anon().doc("users/alice").get());
    }),
    run("비로그인 회원 문서 write 거부", async () => {
      await assertFails(anon().doc("users/alice").update({ locale: "en" }));
    }),
    run("타인 회원 문서 read 거부", async () => {
      await assertFails(db("alice").doc("users/bob").get());
    }),
    run("타인 회원 문서 write 거부", async () => {
      await assertFails(db("alice").doc("users/bob").update({ locale: "ko" }));
    }),
    run("본인 locale 수정 허용", async () => {
      await assertSucceeds(db("alice").doc("users/alice").update({ locale: "en" }));
    }),
    run("본인 displayName 수정 허용", async () => {
      await assertSucceeds(db("alice").doc("users/alice").update({ displayName: "Alice2" }));
    }),
    run("본인 role 변경 거부", async () => {
      await assertFails(db("alice").doc("users/alice").update({ role: "admin" }));
    }),
    run("본인 status 변경 거부", async () => {
      await assertFails(db("alice").doc("users/alice").update({ status: "suspended" }));
    }),
    run("본인 uid 변경 거부", async () => {
      await assertFails(db("alice").doc("users/alice").update({ uid: "other" }));
    }),
    run("본인 plan 변경 거부", async () => {
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await ctx.firestore().doc("users/alice").set({ plan: "free" }, { merge: true });
      });
      await assertFails(db("alice").doc("users/alice").update({ plan: "premium" }));
    }),
    run("문서 role=admin만으로는 관리자 권한 없음", async () => {
      await assertFails(
        db("fake-admin-doc").doc("memberContents/x").set({
          businessId: "knowledge",
          accessLevel: "member",
          publicationStatus: "published",
          body: "nope",
        }),
      );
    }),
    run("admin claim으로 memberContents write 허용", async () => {
      await assertSucceeds(
        db("ops-admin", { role: "admin" }).doc("memberContents/admin-ok").set({
          businessId: "knowledge",
          accessLevel: "member",
          publicationStatus: "published",
          body: "ok",
        }),
      );
    }),
    run("클라이언트 users create 거부", async () => {
      await assertFails(
        db("newbie").doc("users/newbie").set({
          uid: "newbie",
          email: "n@example.com",
          role: "member",
          status: "active",
        }),
      );
    }),
  ]);

  await testEnv.cleanup();
  const passed = results.filter(Boolean).length;
  console.log(`\nMembership security tests: ${passed}/${results.length} passed`);
  if (passed !== results.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
