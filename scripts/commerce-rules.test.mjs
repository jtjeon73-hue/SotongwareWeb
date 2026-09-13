/**
 * Commerce Firestore Rules negative tests.
 * Run via: npm run test:commerce:rules
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
const PROJECT_ID = "sotongware-commerce-rules";
const RULES = fs.readFileSync(path.join(__dirname, "..", "firestore.rules"), "utf8");

let testEnv;

async function seed() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.doc("users/buyer").set({
      uid: "buyer",
      email: "buyer@example.com",
      role: "member",
      status: "active",
    });
    await db.doc("users/other").set({
      uid: "other",
      email: "other@example.com",
      role: "member",
      status: "active",
    });
    await db.doc("commerceProducts/pub1").set({
      status: "published",
      title: "Public Product",
      amount: 1000,
      currency: "KRW",
    });
    await db.doc("commerceProducts/draft1").set({
      status: "draft",
      title: "Draft Product",
      amount: 1000,
      currency: "KRW",
    });
    await db.doc("commerceProductInternal/pub1").set({
      costBasis: 100,
      notes: "internal only",
    });
    await db.doc("commerceOrders/ord1").set({
      userId: "buyer",
      amount: 1000,
      currency: "KRW",
      status: "pending",
    });
    await db.doc("users/buyer/productEntitlements/ent1").set({
      userId: "buyer",
      productId: "pub1",
      orderId: "ord1",
      status: "active",
    });
    await db.doc("commercePaymentAttempts/pay1").set({
      userId: "buyer",
      orderId: "ord1",
      amount: 1000,
      status: "initiated",
    });
    await db.doc("commercePaymentWebhookEvents/wh1").set({
      providerEventId: "evt_1",
      processStatus: "received",
      summary: "ok",
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
    run("공개 published 상품 read 허용", async () => {
      await assertSucceeds(anon().doc("commerceProducts/pub1").get());
    }),
    run("draft 상품 read 거부", async () => {
      await assertFails(db("buyer").doc("commerceProducts/draft1").get());
    }),
    run("internal 상품 read 거부", async () => {
      await assertFails(db("buyer").doc("commerceProductInternal/pub1").get());
    }),
    run("비로그인 주문 read 거부", async () => {
      await assertFails(anon().doc("commerceOrders/ord1").get());
    }),
    run("비로그인 이용권 read 거부", async () => {
      await assertFails(anon().doc("users/buyer/productEntitlements/ent1").get());
    }),
    run("본인 주문 read 허용", async () => {
      await assertSucceeds(db("buyer").doc("commerceOrders/ord1").get());
    }),
    run("본인 이용권 read 허용", async () => {
      await assertSucceeds(db("buyer").doc("users/buyer/productEntitlements/ent1").get());
    }),
    run("타인 주문 read 거부", async () => {
      await assertFails(db("other").doc("commerceOrders/ord1").get());
    }),
    run("타인 이용권 read 거부", async () => {
      await assertFails(db("other").doc("users/buyer/productEntitlements/ent1").get());
    }),
    run("주문 가격/status 위조 update 거부", async () => {
      await assertFails(
        db("buyer").doc("commerceOrders/ord1").update({ amount: 1, status: "paid" }),
      );
    }),
    run("payment write 거부", async () => {
      await assertFails(
        db("buyer").doc("commercePaymentAttempts/pay1").update({ status: "paid" }),
      );
    }),
    run("entitlement write 거부", async () => {
      await assertFails(
        db("buyer").doc("users/buyer/productEntitlements/ent1").update({ status: "active" }),
      );
    }),
    run("webhook write 거부", async () => {
      await assertFails(
        db("buyer").doc("commercePaymentWebhookEvents/wh2").set({
          providerEventId: "evt_2",
          processStatus: "received",
          summary: "x",
        }),
      );
    }),
    run("webhook read 일반 사용자 거부", async () => {
      await assertFails(db("buyer").doc("commercePaymentWebhookEvents/wh1").get());
    }),
    run("admin claim으로 published 상품 write 허용", async () => {
      await assertSucceeds(
        db("ops", { role: "admin" }).doc("commerceProducts/new1").set({
          status: "published",
          title: "New",
          amount: 500,
          currency: "KRW",
        }),
      );
    }),
    run("문서 role=admin만으로는 commerce write 불가", async () => {
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await ctx.firestore().doc("users/role-only").set({
          uid: "role-only",
          role: "admin",
          status: "active",
        });
      });
      await assertFails(
        db("role-only").doc("commerceProducts/hack").set({
          status: "published",
          title: "Hack",
          amount: 1,
          currency: "KRW",
        }),
      );
    }),
  ]);

  await testEnv.cleanup();
  const passed = results.filter(Boolean).length;
  console.log(`\nCommerce rules tests: ${passed}/${results.length} passed`);
  if (passed !== results.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
