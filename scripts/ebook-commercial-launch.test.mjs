/**
 * Commercial launch local contract tests:
 * upload guards, membership term checkout, binary package, download delivery.
 * Never touches Firebase production / Toss live / signed URL production mint.
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  GOLDEN_EBOOK_PRODUCT,
  GOLDEN_EBOOK_PRODUCT_ID,
  MEMBERSHIP_MONTHLY_PRODUCT,
  MEMBERSHIP_YEARLY_PRODUCT,
  MEMBERSHIP_MONTHLY_PRODUCT_ID,
  MEMBERSHIP_YEARLY_PRODUCT_ID,
  ebookCommerceUiCopy,
} from "../src/lib/commerce-policy/catalog.mjs";
import {
  assertProductionUploadGuards,
  EXPECTED_EPUB_SHA,
  EXPECTED_PDF_SHA,
  EXPECTED_PREMIUM_COUNT,
  FREE_PREVIEW_CHAPTER_IDS,
  MemoryStorageUploader,
  validatePrivateChapterPackage,
} from "./lib/ebook-private-upload-core.mjs";

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

function runNode(args, env = {}) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, ...env },
    shell: false,
  });
}

function parseLastJson(text) {
  const s = String(text || "");
  const start = s.lastIndexOf("\n{") >= 0 ? s.lastIndexOf("\n{") + 1 : s.indexOf("{") === 0 ? 0 : s.lastIndexOf("{");
  if (start < 0) return null;
  try {
    return JSON.parse(s.slice(start).trim());
  } catch {
    return null;
  }
}

// --- functions build ---
{
  const build = spawnSync("npm", ["run", "build"], {
    cwd: join(repoRoot, "functions"),
    encoding: "utf8",
    shell: true,
  });
  check("functions build", build.status === 0, build.status !== 0 ? build.stderr : "");
  if (build.status !== 0) {
    console.error(build.stdout);
    process.exit(1);
  }
}

const ebook = require(join(repoRoot, "functions", "lib", "ebook", "index.js"));
const commerce = require(join(repoRoot, "functions", "lib", "commerce", "service.js"));
const policy = require(join(repoRoot, "functions", "lib", "commerce", "product-policy.js"));
const {
  authorizeEbookDownloadAccess,
  authorizeEbookChapterAccess,
  handleGetEbookDownloadUrl,
  MemorySignedUrlProvider,
  MemoryProductEntitlementLookup,
  DOWNLOAD_URL_TTL_SECONDS,
  canonicalEbookBinaryObjectPath,
  PRIVATE_EBOOK_STORAGE_LAYOUT,
  createGatedGcsSignedUrlProvider,
  clampDownloadTtlSeconds,
  assertCanonicalPrivateBinaryPath,
  PRIVATE_BINARY_OBJECT_PATH_RE,
} = ebook;
const { CommerceCheckoutService, MemoryCommerceStore } = commerce;

const PRODUCT = GOLDEN_EBOOK_PRODUCT_ID;
const NOW = new Date("2026-09-29T12:00:00.000Z");

// ============================================================
// [upload] dry-run + guards
// ============================================================
{
  const dry = runNode([
    "scripts/ebook-private-storage-upload.mjs",
    "--dry-run",
    "--product",
    PRODUCT,
    "--revision",
    "2",
  ]);
  check("upload dry-run exit 0", dry.status === 0, dry.stderr?.slice(0, 200));
  let dryJson = parseLastJson(dry.stdout);
  check("upload dry-run ok", dryJson?.ok === true);
  check("upload 15 premium only", dryJson?.premiumChapterObjects === EXPECTED_PREMIUM_COUNT);
  check(
    "upload free excluded",
    Array.isArray(dryJson?.freePreviewExcluded) &&
      FREE_PREVIEW_CHAPTER_IDS.every((id) => dryJson.freePreviewExcluded.includes(id)),
  );
  check("upload no firebase write", dryJson?.uploadedToFirebase === false);

  const wrongProject = assertProductionUploadGuards({
    explicitUpload: true,
    confirmProductionUpload: true,
    firebaseProject: "wrong-project",
    productId: PRODUCT,
    revision: 2,
    allowFirebaseStorageUpload: true,
    overwrite: false,
    allowOverwrite: false,
  });
  check("upload wrong project DENY", wrongProject.ok === false);

  const wrongRev = assertProductionUploadGuards({
    explicitUpload: true,
    confirmProductionUpload: true,
    firebaseProject: "sotongware",
    productId: PRODUCT,
    revision: 1,
    allowFirebaseStorageUpload: true,
    overwrite: false,
    allowOverwrite: false,
  });
  check("upload wrong revision DENY", wrongRev.ok === false);

  const noFlag = assertProductionUploadGuards({
    explicitUpload: false,
    confirmProductionUpload: false,
    firebaseProject: "sotongware",
    productId: PRODUCT,
    revision: 2,
    allowFirebaseStorageUpload: false,
    overwrite: false,
    allowOverwrite: false,
  });
  check("upload missing flags DENY", noFlag.ok === false);

  const uploadRefuse = runNode([
    "scripts/ebook-private-storage-upload.mjs",
    "--upload",
    "--confirm-production-upload",
    "--product",
    PRODUCT,
    "--revision",
    "2",
  ]);
  check(
    "upload without ALLOW env DENY non-zero",
    uploadRefuse.status !== 0,
    `status=${uploadRefuse.status}`,
  );

  // hash / traversal / overwrite via core + memory uploader
  const pkgPath = join(
    repoRoot,
    "artifacts",
    "ebook-private",
    PRODUCT,
    "r2",
    "private-content.json",
  );
  check("private package present", existsSync(pkgPath));
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const badHashPkg = {
    ...pkg,
    provenance: { ...pkg.provenance, sourcePdfSha256: "0".repeat(64) },
  };
  const hashDeny = validatePrivateChapterPackage({
    productId: PRODUCT,
    revision: 2,
    pkg: badHashPkg,
    canonicalPath: ebook.canonicalEbookChapterObjectPath,
  });
  check("upload hash mismatch DENY", hashDeny.ok === false && hashDeny.errors.some((e) => e.includes("pdf_sha")));

  const travPkg = {
    ...pkg,
    chapters: [
      ...pkg.chapters.filter((c) => !FREE_PREVIEW_CHAPTER_IDS.includes(c.id)).slice(0, 14),
      {
        id: "../evil",
        title: "x",
        accessTier: "premium",
        pages: [{ paragraphs: ["a"] }],
      },
    ],
  };
  const trav = validatePrivateChapterPackage({
    productId: PRODUCT,
    revision: 2,
    pkg: travPkg,
    canonicalPath: ebook.canonicalEbookChapterObjectPath,
  });
  check("upload traversal DENY", trav.ok === false);

  const mem = new MemoryStorageUploader();
  const path = ebook.canonicalEbookChapterObjectPath(PRODUCT, 2, "ch-02");
  await mem.uploadObject({
    storagePath: path,
    bytes: Buffer.from("{}"),
    contentHash: "abc",
    contentType: "application/json",
  });
  let overwriteDenied = false;
  try {
    await mem.uploadObject({
      storagePath: path,
      bytes: Buffer.from("{}"),
      contentHash: "abc",
      contentType: "application/json",
      overwrite: false,
    });
  } catch (e) {
    overwriteDenied = e?.code === "overwrite_forbidden";
  }
  check("upload overwrite DENY", overwriteDenied);
}

// ============================================================
// [membership] term checkout
// ============================================================
{
  check("policy recurring billing OFF", policy.RECURRING_BILLING_IMPLEMENTED === false);
  check("monthly amount 2000", MEMBERSHIP_MONTHLY_PRODUCT.amount === 2000);
  check("yearly amount 20000", MEMBERSHIP_YEARLY_PRODUCT.amount === 20000);
  check(
    "monthly term 30d",
    policy.computeMembershipTerm(MEMBERSHIP_MONTHLY_PRODUCT_ID, "monthly", NOW).termDays === 30,
  );
  check(
    "yearly term 365d",
    policy.computeMembershipTerm(MEMBERSHIP_YEARLY_PRODUCT_ID, "annual", NOW).termDays === 365,
  );
  check(
    "no autoRenew flag",
    policy.computeMembershipTerm(MEMBERSHIP_MONTHLY_PRODUCT_ID, "monthly", NOW).autoRenew === false,
  );

  const store = new MemoryCommerceStore();
  store.users.set("u-m", { uid: "u-m", status: "active" });
  const adapter = {
    confirm: async ({ orderId, amount }) => ({
      paymentKey: "pay_m",
      orderId,
      totalAmount: amount,
      status: "DONE",
    }),
    retrieveByPaymentKey: async () => ({
      paymentKey: "pay_m",
      orderId: "x",
      totalAmount: 2000,
      status: "DONE",
    }),
    cancel: async () => ({ paymentKey: "x", orderId: "x", totalAmount: 2000, status: "CANCELED" }),
  };
  process.env.COMMERCE_PG_MODE = "mock";
  process.env.FUNCTIONS_EMULATOR = "true";
  const svc = new CommerceCheckoutService(store, adapter);

  let priceTamper = false;
  try {
    await svc.prepare("u-m", {
      productId: MEMBERSHIP_MONTHLY_PRODUCT_ID,
      idempotencyKey: "m_price_tamper",
      clientAmount: 1,
    });
  } catch (e) {
    priceTamper = e?.internalCode === "amount/mismatch" || /금액/.test(String(e?.message || ""));
  }
  check("membership price tamper DENY", priceTamper);

  let productTamper = false;
  try {
    await svc.prepare("u-m", {
      productId: "forged_membership",
      idempotencyKey: "m_prod_tamper",
      clientAmount: 2000,
    });
  } catch (e) {
    productTamper = e?.internalCode === "product/missing" || String(e?.httpLike) === "not-found";
  }
  check("membership product tamper DENY", productTamper);

  // Unconfirmed pending — no entitlement
  const pendingPrep = await svc.prepare("u-m", {
    productId: MEMBERSHIP_MONTHLY_PRODUCT_ID,
    idempotencyKey: "m_pending_only",
  });
  check("monthly prepare amount 2000", pendingPrep.amount === 2000);
  const pendingEnt = await store.getEntitlementByOrder("u-m", pendingPrep.orderId);
  check("unconfirmed payment DENY entitlement", pendingEnt == null);

  const monthlyPrep = await svc.prepare("u-m", {
    productId: MEMBERSHIP_MONTHLY_PRODUCT_ID,
    idempotencyKey: "m_monthly_ok",
  });
  const monthlyConf = await svc.confirm("u-m", {
    orderId: monthlyPrep.orderId,
    paymentKey: "pay_m",
    amount: 2000,
  });
  check("monthly confirm entitlement", Boolean(monthlyConf.entitlementId));
  const monthlyEnt = await store.getEntitlementByOrder("u-m", monthlyPrep.orderId);
  check("monthly accessLevel subscribed", monthlyEnt?.accessLevel === "subscribed");
  check("monthly expiresAt set", monthlyEnt?.expiresAt instanceof Date);
  if (monthlyEnt?.expiresAt instanceof Date && monthlyEnt?.startsAt instanceof Date) {
    const days =
      (monthlyEnt.expiresAt.getTime() - monthlyEnt.startsAt.getTime()) / (24 * 60 * 60 * 1000);
    check("monthly term ~30d", Math.round(days) === 30, `days=${days}`);
  } else {
    check("monthly term ~30d", false);
  }

  const yearlyPrep = await svc.prepare("u-m", {
    productId: MEMBERSHIP_YEARLY_PRODUCT_ID,
    idempotencyKey: "m_yearly_ok",
  });
  check("yearly prepare amount 20000", yearlyPrep.amount === 20000);
  const yearlyConf = await svc.confirm("u-m", {
    orderId: yearlyPrep.orderId,
    paymentKey: "pay_m",
    amount: 20000,
  });
  check("yearly confirm entitlement", Boolean(yearlyConf.entitlementId));
  const yearlyEnt = await store.getEntitlementByOrder("u-m", yearlyPrep.orderId);
  if (yearlyEnt?.expiresAt instanceof Date && yearlyEnt?.startsAt instanceof Date) {
    const days =
      (yearlyEnt.expiresAt.getTime() - yearlyEnt.startsAt.getTime()) / (24 * 60 * 60 * 1000);
    check("yearly term ~365d", Math.round(days) === 365, `days=${days}`);
  } else {
    check("yearly term ~365d", false);
  }

  // Expired membership reader DENY; owned independent
  const memberAuth = { uid: "u-m", token: {} };
  const expiredReader = authorizeEbookChapterAccess({
    auth: memberAuth,
    productId: PRODUCT,
    entitlements: [
      {
        productId: MEMBERSHIP_MONTHLY_PRODUCT_ID,
        status: "active",
        expiresAt: new Date("2026-08-01T00:00:00.000Z"),
      },
    ],
    now: NOW,
  });
  check("expired membership Reader DENY", expiredReader.ok === false);

  const ownedIndep = authorizeEbookChapterAccess({
    auth: memberAuth,
    productId: PRODUCT,
    entitlements: [
      {
        productId: MEMBERSHIP_MONTHLY_PRODUCT_ID,
        status: "active",
        expiresAt: new Date("2026-08-01T00:00:00.000Z"),
      },
      { productId: PRODUCT, status: "active", expiresAt: null },
    ],
    now: NOW,
  });
  check("owned independent of expired membership", ownedIndep.ok === true && ownedIndep.reason === "product_entitlement");
}

// ============================================================
// [binaries] package + SHA
// ============================================================
{
  const bin = runNode([
    "scripts/ebook-private-binary-package.mjs",
    "--dry-run",
    "--product",
    PRODUCT,
    "--revision",
    "2",
  ]);
  check("binary package exit 0", bin.status === 0, bin.stderr?.slice(0, 300));
  let binJson = parseLastJson(bin.stdout);
  check("PDF SHA == Golden R2", binJson?.pdfSha256 === EXPECTED_PDF_SHA);
  check("EPUB SHA == Golden R2", binJson?.epubSha256 === EXPECTED_EPUB_SHA);
  check("public copy count = 0", binJson?.publicCopyCount === 0);
  check("binary not uploaded", binJson?.uploadedToFirebase === false);
  check(
    "canonical binaries path",
    PRIVATE_EBOOK_STORAGE_LAYOUT.pdfObject.includes("binaries/book.pdf"),
  );
  const stagingPdf = join(
    repoRoot,
    "artifacts",
    "ebook-private-staging",
    PRODUCT,
    "r2",
    "binaries",
    "book.pdf",
  );
  const publicDir = join(repoRoot, "public");
  let publicPdf = 0;
  if (existsSync(publicDir)) {
    const walk = (d) => {
      for (const name of readdirSync(d, { withFileTypes: true })) {
        const p = join(d, name.name);
        if (name.isDirectory()) walk(p);
        else if (name.name === "book.pdf" || name.name === "book.epub") publicPdf += 1;
      }
    };
    walk(publicDir);
  }
  check("no public book.pdf/epub", publicPdf === 0);
  check("staging binary exists", existsSync(stagingPdf));
}

// ============================================================
// [download] authz + short-lived delivery
// ============================================================
{
  const guest = null;
  const user = { uid: "u1", token: {} };
  const admin = { uid: "admin", token: { role: "admin" } };
  const forged = { uid: "f", token: { isAdmin: true, owned: true } };
  const signed = new MemorySignedUrlProvider();

  async function dl(auth, entitlements, data) {
    const lookup = new MemoryProductEntitlementLookup(
      new Map([[auth?.uid || "_", entitlements]]),
    );
    return handleGetEbookDownloadUrl({
      auth,
      data,
      entitlements: lookup,
      signedUrls: signed,
      now: NOW,
    });
  }

  async function expectDeny(label, fn, codeHint) {
    let denied = false;
    try {
      await fn();
    } catch (e) {
      denied =
        e?.name === "EbookChapterAccessError" ||
        /권한|로그인|assetType|invalid/.test(String(e?.message || ""));
      if (codeHint && e?.code) denied = denied && String(e.code).includes(codeHint) || denied;
    }
    check(label, denied);
  }

  await expectDeny("guest download DENY", () =>
    dl(guest, [], { productId: PRODUCT, assetType: "pdf" }),
  );

  await expectDeny("member-only download DENY", () =>
    dl(
      user,
      [
        {
          productId: MEMBERSHIP_MONTHLY_PRODUCT_ID,
          status: "active",
          expiresAt: new Date("2026-10-29T00:00:00.000Z"),
        },
      ],
      { productId: PRODUCT, assetType: "pdf" },
    ),
  );

  const ownedPdf = await dl(
    user,
    [{ productId: PRODUCT, status: "active", expiresAt: null }],
    { productId: PRODUCT, assetType: "pdf" },
  );
  check("owned PDF ALLOW", ownedPdf.assetType === "pdf" && ownedPdf.delivery === "signed_url");
  check(
    "short-lived TTL",
    ownedPdf.ttlSeconds === DOWNLOAD_URL_TTL_SECONDS &&
      new Date(ownedPdf.expiresAt).getTime() === NOW.getTime() + DOWNLOAD_URL_TTL_SECONDS * 1000,
  );
  check(
    "no storage path leak",
    !JSON.stringify(ownedPdf).includes("private/ebooks") &&
      !ownedPdf.downloadUrl.includes("private/ebooks"),
  );

  const ownedEpub = await dl(
    user,
    [{ productId: PRODUCT, status: "active", expiresAt: null }],
    { productId: PRODUCT, assetType: "epub" },
  );
  check("owned EPUB ALLOW", ownedEpub.assetType === "epub");

  const adminDl = await dl(admin, [], { productId: PRODUCT, assetType: "pdf" });
  check("admin download ALLOW", adminDl.delivery === "signed_url");

  await expectDeny("wrong product DENY", () =>
    dl(user, [{ productId: "other-ebook", status: "active", expiresAt: null }], {
      productId: PRODUCT,
      assetType: "pdf",
    }),
  );

  await expectDeny("revoked owned DENY", () =>
    dl(user, [{ productId: PRODUCT, status: "revoked", expiresAt: null }], {
      productId: PRODUCT,
      assetType: "pdf",
    }),
  );

  await expectDeny("expired owned DENY", () =>
    dl(
      user,
      [{ productId: PRODUCT, status: "active", expiresAt: new Date("2026-01-01T00:00:00.000Z") }],
      { productId: PRODUCT, assetType: "pdf" },
    ),
  );

  await expectDeny("forged owned DENY", () =>
    dl(forged, [], { productId: PRODUCT, assetType: "pdf" }),
  );

  await expectDeny("invalid asset DENY", () =>
    dl(user, [{ productId: PRODUCT, status: "active", expiresAt: null }], {
      productId: PRODUCT,
      assetType: "zip",
    }),
  );

  await expectDeny("traversal product DENY", () =>
    dl(user, [{ productId: PRODUCT, status: "active", expiresAt: null }], {
      productId: "../evil",
      assetType: "pdf",
    }),
  );

  // Authz contract alone
  check(
    "member-only authz DENY",
    authorizeEbookDownloadAccess({
      auth: user,
      productId: PRODUCT,
      entitlements: [
        {
          productId: MEMBERSHIP_MONTHLY_PRODUCT_ID,
          status: "active",
          expiresAt: new Date("2026-10-29"),
        },
      ],
      now: NOW,
    }).ok === false,
  );

  let pathOk = false;
  try {
    canonicalEbookBinaryObjectPath(PRODUCT, 2, "book.pdf");
    pathOk = true;
  } catch {
    pathOk = false;
  }
  check("binary path ok", pathOk);

  // --- production signed URL provider (fake GCS File, no real mint) ---
  check("TTL clamp 300", clampDownloadTtlSeconds(999) === 300);
  check("TTL clamp default", clampDownloadTtlSeconds(-1) === DOWNLOAD_URL_TTL_SECONDS);
  check(
    "canonical path regex pdf",
    PRIVATE_BINARY_OBJECT_PATH_RE.test(
      `private/ebooks/${PRODUCT}/r2/binaries/book.pdf`,
    ),
  );
  check(
    "canonical path regex reject traversal",
    !PRIVATE_BINARY_OBJECT_PATH_RE.test(
      "private/ebooks/../evil/r2/binaries/book.pdf",
    ),
  );
  let travDeny = false;
  try {
    assertCanonicalPrivateBinaryPath("private/ebooks/x/r2/binaries/../book.pdf");
  } catch {
    travDeny = true;
  }
  check("assertCanonical traversal DENY", travDeny);

  const canonPdf = canonicalEbookBinaryObjectPath(PRODUCT, 2, "book.pdf");
  const canonEpub = canonicalEbookBinaryObjectPath(PRODUCT, 2, "book.epub");
  check(
    "canonical objects",
    canonPdf === `private/ebooks/${PRODUCT}/r2/binaries/book.pdf` &&
      canonEpub === `private/ebooks/${PRODUCT}/r2/binaries/book.epub`,
  );

  const disabled = createGatedGcsSignedUrlProvider({
    allow: false,
    getFile: () => {
      throw new Error("should not call getFile when disabled");
    },
  });
  let gateDeny = false;
  try {
    await disabled.mint({
      storagePath: canonPdf,
      contentType: "application/pdf",
      ttlSeconds: 300,
      now: NOW,
    });
  } catch (e) {
    gateDeny =
      e?.name === "EbookChapterAccessError" &&
      /disabled|Signed URL/i.test(String(e?.message || ""));
  }
  check("signed URL gate DENY when allow=false", gateDeny);

  let mintedPath = null;
  let mintedCfg = null;
  const fakeGcs = createGatedGcsSignedUrlProvider({
    allow: true,
    getFile: (storagePath) => {
      mintedPath = storagePath;
      return {
        getSignedUrl: async (cfg) => {
          mintedCfg = cfg;
          const exp = Math.floor(cfg.expires / 1000);
          return [
            `https://storage.googleapis.com/fake-bucket/${storagePath}?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Expires=300&X-Goog-Signature=abc&Expires=${exp}`,
          ];
        },
      };
    },
  });
  const gcsMint = await fakeGcs.mint({
    storagePath: canonPdf,
    contentType: "application/pdf",
    ttlSeconds: 999,
    now: NOW,
  });
  check("GCS provider uses canonical path only", mintedPath === canonPdf);
  check(
    "GCS TTL clamped <=300",
    mintedCfg?.action === "read" &&
      mintedCfg.expires === NOW.getTime() + 300 * 1000 &&
      gcsMint.expiresAt.getTime() === NOW.getTime() + 300 * 1000,
  );
  check(
    "GCS URL is V4 signed style (no permanent token)",
    /X-Goog-Signature=/.test(gcsMint.downloadUrl) &&
      !/[?&]token=/.test(gcsMint.downloadUrl),
  );

  const tokenReject = createGatedGcsSignedUrlProvider({
    allow: true,
    getFile: () => ({
      getSignedUrl: async () => [
        "https://firebasestorage.googleapis.com/v0/b/x/o/y?alt=media&token=permanent-uuid",
      ],
    }),
  });
  let permDeny = false;
  try {
    await tokenReject.mint({
      storagePath: canonPdf,
      contentType: "application/pdf",
      ttlSeconds: 300,
      now: NOW,
    });
  } catch (e) {
    permDeny = e?.name === "EbookChapterAccessError";
  }
  check("permanent Firebase download token REJECT", permDeny);

  const ownedIgnorePath = await dl(
    user,
    [{ productId: PRODUCT, status: "active", expiresAt: null }],
    {
      productId: PRODUCT,
      assetType: "pdf",
      storagePath: "private/ebooks/evil/r2/binaries/book.pdf",
    },
  );
  check(
    "client storagePath ignored",
    ownedIgnorePath.delivery === "signed_url" &&
      !JSON.stringify(ownedIgnorePath).includes("evil"),
  );

  const handlersSrc = readFileSync(
    join(repoRoot, "functions", "src", "ebook", "handlers.ts"),
    "utf8",
  );
  check(
    "handlers use createProductionFirebaseSignedUrlProvider",
    handlersSrc.includes("createProductionFirebaseSignedUrlProvider") &&
      !handlersSrc.includes("Production signed URL provider is not enabled"),
  );
  const deliverySrc = readFileSync(
    join(repoRoot, "functions", "src", "ebook", "download-delivery.ts"),
    "utf8",
  );
  check(
    "Admin SDK getStorage wired",
    deliverySrc.includes('from "firebase-admin/storage"') &&
      deliverySrc.includes("createAdminSdkStorageFileAccessor") &&
      deliverySrc.includes("getSignedUrl"),
  );
  check(
    "no makePublic / no firebaseStorageDownloadTokens",
    !/\bmakePublic\s*\(/.test(deliverySrc) &&
      !/firebaseStorageDownloadTokens\s*[:=]/.test(deliverySrc),
  );
}

// ============================================================
// [UI] preparing + no auto-renew claim
// ============================================================
{
  const ui = ebookCommerceUiCopy("ko");
  check("UI preparing", /준비/.test(ui.preparingNotice));
  check("UI no auto-renew claim", /자동갱신/.test(ui.noAutoRenew) && !/자동 갱신됩니다/.test(ui.noAutoRenew));
  check("UI no live download claim", !/지금 다운로드/.test(ui.ownedDownload));
  check("UI guest preview", /미리보기/.test(ui.guest));
}

if (failed) {
  console.error(`\nFAILED ${failed}`);
  process.exit(1);
}
console.log("\nALL commercial-launch local checks PASS");
