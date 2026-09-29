/**
 * Golden ebook commerce policy + entitlement integration tests (local).
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  GOLDEN_EBOOK_PRODUCT,
  GOLDEN_EBOOK_PRODUCT_ID,
  MEMBERSHIP_MONTHLY_PRODUCT,
  MEMBERSHIP_YEARLY_PRODUCT,
  MEMBERSHIP_MONTHLY_PRODUCT_ID,
  MEMBERSHIP_YEARLY_PRODUCT_ID,
  assertMatchesCommercePolicy,
  ebookCommerceUiCopy,
} from "../src/lib/commerce-policy/catalog.mjs";
import { grantEntitlementForPaidOrder, CommerceDomainError } from "../src/lib/commerce-core/domain.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const require = createRequire(import.meta.url);

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

// --- Price SSOT ---
check("monthly price 2000", MEMBERSHIP_MONTHLY_PRODUCT.amount === 2000);
check("yearly price 20000", MEMBERSHIP_YEARLY_PRODUCT.amount === 20000);
check("ebook one-time 3000", GOLDEN_EBOOK_PRODUCT.amount === 3000);
check("ebook productId", GOLDEN_EBOOK_PRODUCT_ID === "ai-first-ebook-for-50s");
check("ebook one_time", GOLDEN_EBOOK_PRODUCT.pricingType === "one_time");
check("monthly billingCycle", MEMBERSHIP_MONTHLY_PRODUCT.billingCycle === "monthly");
check("yearly billingCycle annual", MEMBERSHIP_YEARLY_PRODUCT.billingCycle === "annual");

check(
  "price tamper DENY",
  assertMatchesCommercePolicy({ productId: GOLDEN_EBOOK_PRODUCT_ID, amount: 1 }).ok === false,
);
check(
  "price match OK",
  assertMatchesCommercePolicy({ productId: GOLDEN_EBOOK_PRODUCT_ID, amount: 3000 }).ok === true,
);
check(
  "productId mismatch DENY",
  assertMatchesCommercePolicy({
    productId: GOLDEN_EBOOK_PRODUCT_ID,
    expectedProductId: "other-book",
  }).ok === false,
);

const ui = ebookCommerceUiCopy("ko");
check("UI preparing notice present", /결제/.test(ui.preparingNotice));
check("UI no fake purchase-complete claim", !ui.ownedReader.includes("결제 완료"));

// --- Build functions for authz ---
const build = spawnSync("npm", ["run", "build"], {
  cwd: join(repoRoot, "functions"),
  encoding: "utf8",
  shell: true,
});
if (build.status !== 0) {
  console.error(build.stdout);
  console.error(build.stderr);
  console.error("FAIL functions build");
  process.exit(1);
}
check("functions tsc build", true);

const ebook = require(join(repoRoot, "functions", "lib", "ebook", "index.js"));
const commerce = require(join(repoRoot, "functions", "lib", "commerce", "service.js"));
const policy = require(join(repoRoot, "functions", "lib", "commerce", "product-policy.js"));

const {
  authorizeEbookChapterAccess,
  authorizeEbookDownloadAccess,
} = ebook;
const { CommerceCheckoutService, MemoryCommerceStore, FIXTURE_ONE_TIME_PRODUCT } = commerce;

const PRODUCT = GOLDEN_EBOOK_PRODUCT_ID;
const NOW = new Date("2026-09-29T12:00:00.000Z");
const guest = null;
const memberAuth = { uid: "u-member", token: {} };
const adminAuth = { uid: "u-admin", token: { role: "admin" } };
const forgedAdmin = { uid: "u-forged", token: { isAdmin: true, role: "member" } };

function row(productId, status = "active", expiresAt = null) {
  return { productId, status, expiresAt };
}

function reader(label, auth, entitlements, expectOk, reasonOrCode) {
  const r = authorizeEbookChapterAccess({
    auth,
    productId: PRODUCT,
    entitlements,
    now: NOW,
  });
  const ok = expectOk ? r.ok === true && r.reason === reasonOrCode : r.ok === false && r.code === reasonOrCode;
  check(label, ok, JSON.stringify(r));
}

function download(label, auth, entitlements, expectOk, reasonOrCode) {
  const r = authorizeEbookDownloadAccess({
    auth,
    productId: PRODUCT,
    entitlements,
    now: NOW,
  });
  const ok = expectOk ? r.ok === true && r.reason === reasonOrCode : r.ok === false && r.code === reasonOrCode;
  check(label, ok, JSON.stringify(r));
}

// Guest
reader("guest full reader DENY", guest, [], false, "unauthenticated");
download("guest download DENY", guest, [], false, "unauthenticated");

// Active monthly member
reader(
  "monthly member reader ALLOW",
  memberAuth,
  [row(MEMBERSHIP_MONTHLY_PRODUCT_ID, "active", new Date("2026-10-29T00:00:00.000Z"))],
  true,
  "membership",
);
download(
  "monthly member download DENY",
  memberAuth,
  [row(MEMBERSHIP_MONTHLY_PRODUCT_ID, "active", new Date("2026-10-29T00:00:00.000Z"))],
  false,
  "download_requires_owned",
);

// Active yearly member
reader(
  "yearly member reader ALLOW",
  memberAuth,
  [row(MEMBERSHIP_YEARLY_PRODUCT_ID, "active", new Date("2027-09-29T00:00:00.000Z"))],
  true,
  "membership",
);
download(
  "yearly member download DENY",
  memberAuth,
  [row(MEMBERSHIP_YEARLY_PRODUCT_ID, "active", new Date("2027-09-29T00:00:00.000Z"))],
  false,
  "download_requires_owned",
);

// Expired member
reader(
  "expired member reader DENY",
  memberAuth,
  [row(MEMBERSHIP_MONTHLY_PRODUCT_ID, "active", new Date("2026-08-01T00:00:00.000Z"))],
  false,
  "entitlement_missing",
);
download(
  "expired member download DENY",
  memberAuth,
  [row(MEMBERSHIP_MONTHLY_PRODUCT_ID, "active", new Date("2026-08-01T00:00:00.000Z"))],
  false,
  "entitlement_missing",
);

// Owned ebook
reader("owned reader ALLOW", memberAuth, [row(PRODUCT)], true, "product_entitlement");
download("owned download ALLOW", memberAuth, [row(PRODUCT)], true, "owned_entitlement");

// Expired membership + owned
reader(
  "expired membership + owned reader ALLOW",
  memberAuth,
  [
    row(MEMBERSHIP_MONTHLY_PRODUCT_ID, "active", new Date("2026-08-01T00:00:00.000Z")),
    row(PRODUCT),
  ],
  true,
  "product_entitlement",
);
download(
  "expired membership + owned download ALLOW",
  memberAuth,
  [
    row(MEMBERSHIP_MONTHLY_PRODUCT_ID, "active", new Date("2026-08-01T00:00:00.000Z")),
    row(PRODUCT),
  ],
  true,
  "owned_entitlement",
);

// Wrong product
reader("wrong product DENY", memberAuth, [row("other-ebook")], false, "wrong_product");
download("wrong product download DENY", memberAuth, [row("other-ebook")], false, "wrong_product");

// Forged client flags — auth token without role=admin
reader("forged client admin DENY", forgedAdmin, [], false, "entitlement_missing");
download("forged client admin download DENY", forgedAdmin, [], false, "entitlement_missing");

// Server admin
reader("server admin reader ALLOW", adminAuth, [], true, "admin");
download("server admin download ALLOW", adminAuth, [], true, "admin");

// Domain: unpaid order cannot grant
{
  let denied = false;
  try {
    grantEntitlementForPaidOrder({
      store: { entitlementsByOrder: new Map() },
      order: {
        id: "ord_x",
        userId: "u1",
        status: "pending",
        productSnapshot: { productId: PRODUCT, pricingType: "one_time" },
      },
      entitlementId: "ent_ord_x",
      clock: () => NOW.toISOString(),
    });
  } catch (e) {
    denied = e instanceof CommerceDomainError && e.code === "entitlement/not-paid";
  }
  check("payment not confirmed grant DENY", denied);
}

// Commerce prepare: price/product tamper + paid grant owned
{
  const store = new MemoryCommerceStore();
  store.users.set("u1", { uid: "u1", status: "active" });
  store.products.set(GOLDEN_EBOOK_PRODUCT.id, { ...GOLDEN_EBOOK_PRODUCT });
  const adapter = {
    confirm: async () => ({
      paymentKey: "pay_test_key",
      orderId: "will-replace",
      totalAmount: 3000,
      status: "DONE",
    }),
    retrieveByPaymentKey: async () => ({
      paymentKey: "pay_test_key",
      orderId: "x",
      totalAmount: 3000,
      status: "DONE",
    }),
    cancel: async () => ({ paymentKey: "x", orderId: "x", totalAmount: 3000, status: "CANCELED" }),
  };
  process.env.COMMERCE_PG_MODE = "mock";
  process.env.FUNCTIONS_EMULATOR = "true";
  const svc = new CommerceCheckoutService(store, adapter);

  let priceTamper = false;
  try {
    await svc.prepare("u1", {
      productId: GOLDEN_EBOOK_PRODUCT_ID,
      idempotencyKey: "idem_price_tamper_001",
      clientAmount: 1,
    });
  } catch (e) {
    priceTamper = e?.internalCode === "amount/mismatch" || String(e?.message || "").includes("금액");
  }
  check("prepare price tamper DENY", priceTamper);

  let badProduct = false;
  try {
    await svc.prepare("u1", {
      productId: "forged-product-id",
      idempotencyKey: "idem_bad_product_001",
      clientAmount: 3000,
    });
  } catch (e) {
    badProduct = e?.internalCode === "product/missing" || String(e?.httpLike || "") === "not-found";
  }
  check("prepare productId tamper DENY", badProduct);

  const prepared = await svc.prepare("u1", {
    productId: GOLDEN_EBOOK_PRODUCT_ID,
    idempotencyKey: "idem_golden_ok_001",
  });
  check("prepare golden amount 3000", prepared.amount === 3000);
  check("prepare golden productId", prepared.productId === GOLDEN_EBOOK_PRODUCT_ID);

  adapter.confirm = async ({ orderId, amount }) => ({
    paymentKey: "pay_test_key",
    orderId,
    totalAmount: amount,
    status: "DONE",
  });
  const confirmed = await svc.confirm("u1", {
    orderId: prepared.orderId,
    paymentKey: "pay_test_key",
    amount: 3000,
  });
  check("confirm grants entitlement", Boolean(confirmed.entitlementId));
  const ent = await store.getEntitlementByOrder("u1", prepared.orderId);
  check("owned accessLevel", ent?.accessLevel === "owned");
  check("owned productId", ent?.productId === GOLDEN_EBOOK_PRODUCT_ID);
  check("owned status active", ent?.status === "active");

  // Confirm again unpaid-style: already paid returns duplicate, not new grant without payment
  const dup = await svc.confirm("u1", {
    orderId: prepared.orderId,
    paymentKey: "pay_test_key",
    amount: 3000,
  });
  check("duplicate confirm no extra grant path", dup.duplicate === true);

  // Pending order without confirm — no entitlement for another order
  const pendingPrep = await svc.prepare("u1", {
    productId: GOLDEN_EBOOK_PRODUCT_ID,
    idempotencyKey: "idem_pending_only_001",
  });
  const pendingEnt = await store.getEntitlementByOrder("u1", pendingPrep.orderId);
  check("pending order no entitlement", pendingEnt == null);
}

// Policy mirror sync
check("functions policy monthly 2000", policy.MEMBERSHIP_MONTHLY_PRODUCT.amount === 2000);
check("functions policy yearly 20000", policy.MEMBERSHIP_YEARLY_PRODUCT.amount === 20000);
check("functions policy ebook 3000", policy.GOLDEN_EBOOK_PRODUCT.amount === 3000);

// Rights gate regression
{
  const recordPath = join(
    repoRoot,
    "scripts",
    "ebook-rights",
    "records",
    "ai-first-ebook-for-50s.r2.rights.json",
  );
  if (existsSync(recordPath)) {
    const man = JSON.parse(readFileSync(recordPath, "utf8"));
    check("rights reviewStatus cleared", man.reviewStatus === "cleared");
    check("rights gate ok", man.gate?.ok === true);
  } else {
    check("rights record present", false);
  }
}

// No public PDF/EPUB URLs in generated catalog
{
  const cat = join(
    repoRoot,
    "src",
    "data",
    "service-catalog",
    "generated",
    "ai-first-ebook-for-50s.catalog.ts",
  );
  const ts = readFileSync(cat, "utf8");
  check("catalog no pdfUrl", !ts.includes("pdfUrl") && !ts.includes(".pdf"));
  check("catalog no epubUrl", !ts.includes("epubUrl") && !/\.epub/.test(ts));
  check("catalog preparing", ts.includes('"status": "preparing"') || ts.includes('status: "preparing"'));
  check("catalog priceNote mentions 3,000 or 3000", /3[,.]?000/.test(ts));
}

console.log(failed === 0 ? "\nEBOOK COMMERCE POLICY ALL PASS" : `\nFAILED=${failed}`);
process.exit(failed === 0 ? 0 : 1);
