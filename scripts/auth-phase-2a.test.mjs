/**
 * Auth Phase 2A — privilege / ownership / consent field Rules tests
 * Run: npm run test:auth:phase2a
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
const PROJECT_ID = "sotongware-auth2a-rules";
const RULES = fs.readFileSync(path.join(__dirname, "..", "firestore.rules"), "utf8");

let testEnv;

async function seed() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.doc("users/user-a").set({
      uid: "user-a",
      email: "a@example.com",
      role: "member",
      status: "active",
      membershipGrade: "free",
      provisionedBy: "server",
      emailVerified: false,
      locale: "ko",
      consentAt: null,
      policyVersion: null,
      termsVersion: "2026-09-11",
      privacyVersion: "2026-09-11",
    });
    await db.doc("users/user-b").set({
      uid: "user-b",
      email: "b@example.com",
      role: "member",
      status: "active",
      membershipGrade: "free",
      provisionedBy: "server",
    });
  });
}

function db(uid) {
  return testEnv.authenticatedContext(uid).firestore();
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
    run("클라이언트 users create 거부", async () => {
      await assertFails(
        db("user-c").doc("users/user-c").set({
          uid: "user-c",
          email: "c@example.com",
          role: "member",
          status: "active",
        }),
      );
    }),
    run("create with email 거부", async () => {
      await assertFails(
        db("user-d").doc("users/user-d").set({
          uid: "user-d",
          email: "d@example.com",
        }),
      );
    }),
    run("클라이언트가 admin role로 create 거부", async () => {
      await assertFails(
        db("evil").doc("users/evil").set({
          uid: "evil",
          role: "admin",
          status: "active",
        }),
      );
    }),
    run("다른 사용자 프로필 읽기 거부", async () => {
      await assertFails(db("user-a").doc("users/user-b").get());
    }),
    run("본인 프로필 읽기 허용", async () => {
      await assertSucceeds(db("user-a").doc("users/user-a").get());
    }),
    run("role 상승 업데이트 거부", async () => {
      await assertFails(db("user-a").doc("users/user-a").update({ role: "admin" }));
    }),
    run("membershipGrade 변경 거부", async () => {
      await assertFails(db("user-a").doc("users/user-a").update({ membershipGrade: "basic" }));
    }),
    run("status 변경 거부", async () => {
      await assertFails(db("user-a").doc("users/user-a").update({ status: "suspended" }));
    }),
    run("email 업데이트 거부", async () => {
      await assertFails(db("user-a").doc("users/user-a").update({ email: "attacker@evil.com" }));
    }),
    run("emailVerified 업데이트 거부", async () => {
      await assertFails(db("user-a").doc("users/user-a").update({ emailVerified: true }));
    }),
    run("consentAt 업데이트 거부", async () => {
      await assertFails(
        db("user-a").doc("users/user-a").update({ consentAt: "1999-01-01T00:00:00.000Z" }),
      );
    }),
    run("policyVersion 업데이트 거부", async () => {
      await assertFails(db("user-a").doc("users/user-a").update({ policyVersion: "attacker" }));
    }),
    run("termsVersion merge 거부", async () => {
      await assertFails(
        db("user-a").doc("users/user-a").set({ termsVersion: "attacker" }, { merge: true }),
      );
    }),
    run("임의 paid 필드 삽입 거부", async () => {
      await assertFails(db("user-a").doc("users/user-a").set({ paid: true }, { merge: true }));
    }),
    run("안전한 locale 업데이트 허용", async () => {
      await assertSucceeds(db("user-a").doc("users/user-a").update({ locale: "en" }));
    }),
    run("locale+email partial 우회 거부", async () => {
      await assertFails(
        db("user-a").doc("users/user-a").update({ locale: "ko", email: "x@evil.com" }),
      );
    }),
    run("비로그인 프로필 읽기 거부", async () => {
      await assertFails(anon().doc("users/user-a").get());
    }),
    run("entitlement 클라이언트 쓰기 거부", async () => {
      await assertFails(
        db("user-a").doc("users/user-a/entitlements/knowledge").set({
          businessId: "knowledge",
          plan: "premium",
          status: "active",
        }),
      );
    }),
    run("claims 없는 사용자가 admin 위장해도 entitlement 쓰기 거부", async () => {
      await assertFails(
        db("user-a").doc("users/user-b/entitlements/knowledge").set({
          businessId: "knowledge",
          plan: "premium",
          status: "active",
        }),
      );
    }),
  ]);

  const safetyPath = path.join(__dirname, "..", "src", "lib", "auth-safety.ts");
  const profilePath = path.join(__dirname, "..", "src", "lib", "user-profile.ts");
  const safety = fs.readFileSync(safetyPath, "utf8");
  const profile = fs.readFileSync(profilePath, "utf8");
  results.push(
    await run("auth-safety fail-safe 존재", async () => {
      if (!safety.includes("assertAuthEnvironmentSafe")) throw new Error("missing assert");
      if (!safety.includes("CURRENT_TERMS_VERSION")) throw new Error("missing terms version");
    }),
  );
  results.push(
    await run("user-profile가 role을 setDoc하지 않음", async () => {
      if (/role:\s*[\"']member[\"']/.test(profile) && profile.includes("await setDoc(ref, profile)")) {
        throw new Error("client still creates privileged profile");
      }
      if (!profile.includes("ensureMyMemberProfile")) throw new Error("callable missing");
      if (profile.includes("emailVerified: user.emailVerified")) {
        throw new Error("client still writes emailVerified");
      }
    }),
  );

  await testEnv.cleanup();
  const passed = results.filter(Boolean).length;
  const total = results.length;
  console.log(`\nAuth Phase 2A tests: ${passed}/${total} passed`);
  if (passed !== total) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
