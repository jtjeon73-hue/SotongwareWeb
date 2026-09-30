/**
 * Knowledge Phase 2 — member rail Callable + client contract tests.
 * Run: node scripts/knowledge-phase2-member-rail.test.mjs
 * Builds functions/ then loads compiled modules (no deploy, no Firebase network).
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

function read(rel) {
  return readFileSync(join(repoRoot, rel), "utf8");
}

let failed = 0;
const pending = [];
function run(name, fn) {
  pending.push(
    (async () => {
      try {
        await fn();
        console.log(`PASS: ${name}`);
      } catch (e) {
        failed += 1;
        console.error(`FAIL: ${name}`);
        console.error(e);
      }
    })(),
  );
}

const build = spawnSync("npm", ["run", "build"], {
  cwd: join(repoRoot, "functions"),
  encoding: "utf8",
  shell: true,
});
if (build.status !== 0) {
  console.error(build.stdout);
  console.error(build.stderr);
  console.error("FAIL: functions build");
  process.exit(1);
}
console.log("PASS: functions tsc build");

const knowledge = require(join(repoRoot, "functions", "lib", "knowledge", "index.js"));
const ebook = require(join(repoRoot, "functions", "lib", "ebook", "index.js"));
const policy = require(join(repoRoot, "functions", "lib", "commerce", "product-policy.js"));
const {
  authorizeKnowledgeMemberAccess,
  handleGetKnowledgeMemberBody,
  KnowledgeMemberAccessError,
  getKnowledgeMemberRailBody,
  isKnowledgeMemberCallableEnabled,
} = knowledge;
const { MemoryProductEntitlementLookup } = ebook;

const NOW = new Date("2026-09-30T12:00:00.000Z");
const FUTURE = new Date("2026-10-30T12:00:00.000Z");
const PAST = new Date("2026-09-01T12:00:00.000Z");
const GUIDE = "unified-learning-rail";
const MEMBER_PHRASE = "열두 개 허브를 하나의 순서로 엮는 회원 전용 안내서";

const user = (uid, token = {}) => ({ uid, token });
const mem = (rows) => new MemoryProductEntitlementLookup(new Map([["u1", rows]]));
const row = (productId, status, expiresAt) => ({ productId, status, expiresAt });

function authz(auth, rows) {
  return authorizeKnowledgeMemberAccess({ auth, entitlements: rows, now: NOW });
}

// ── Authz matrix ────────────────────────────────────────────────────────────
run("authz: guest denied (unauthenticated)", () => {
  const r = authz(null, []);
  assert.equal(r.ok, false);
  assert.equal(r.code, "unauthenticated");
});

run("authz: free user (no entitlements) denied", () => {
  const r = authz(user("u1"), []);
  assert.equal(r.ok, false);
  assert.equal(r.code, "membership_missing");
});

run("authz: monthly active allowed", () => {
  const r = authz(user("u1"), [row("membership_basic_monthly", "active", FUTURE)]);
  assert.deepEqual(r, { ok: true, reason: "membership" });
});

run("authz: yearly active allowed", () => {
  const r = authz(user("u1"), [row("membership_basic_yearly", "active", FUTURE)]);
  assert.deepEqual(r, { ok: true, reason: "membership" });
});

run("authz: expired membership denied", () => {
  const r = authz(user("u1"), [row("membership_basic_monthly", "active", PAST)]);
  assert.equal(r.ok, false);
  assert.equal(r.code, "membership_expired");
});

run("authz: revoked membership denied", () => {
  const r = authz(user("u1"), [row("membership_basic_yearly", "revoked", FUTURE)]);
  assert.equal(r.ok, false);
  assert.equal(r.code, "membership_inactive");
});

run("authz: admin token allowed without entitlements", () => {
  const r = authz(user("u1", { role: "admin" }), []);
  assert.deepEqual(r, { ok: true, reason: "admin" });
});

run("authz: non-admin role claim denied", () => {
  const r = authz(user("u1", { role: "member" }), []);
  assert.equal(r.ok, false);
});

run("authz: owned ebook alone does not unlock member rail", () => {
  const r = authz(user("u1"), [row("ai-first-ebook-for-50s", "active", null)]);
  assert.equal(r.ok, false);
});

// ── Handler ────────────────────────────────────────────────────────────────
async function call(auth, data, rows) {
  return handleGetKnowledgeMemberBody({ auth, data, entitlements: mem(rows), now: NOW });
}

async function expectCode(promise, code) {
  await assert.rejects(promise, (e) => {
    assert.ok(e instanceof KnowledgeMemberAccessError, "KnowledgeMemberAccessError");
    assert.equal(e.code, code);
    return true;
  });
}

run("handler: guest → unauthenticated", async () => {
  await expectCode(call(null, { guideId: GUIDE }, []), "unauthenticated");
});

run("handler: missing guideId → invalid-argument", async () => {
  await expectCode(call(user("u1"), {}, []), "invalid-argument");
});

run("handler: free → permission-denied", async () => {
  await expectCode(call(user("u1"), { guideId: GUIDE }, []), "permission-denied");
});

run("handler: client-forged privilege fields ignored", async () => {
  await expectCode(
    call(
      user("u1"),
      { guideId: GUIDE, isAdmin: true, userTier: "premium", previewAccess: true, role: "admin", uid: "x" },
      [],
    ),
    "permission-denied",
  );
});

run("handler: expired / revoked → permission-denied", async () => {
  await expectCode(
    call(user("u1"), { guideId: GUIDE }, [row("membership_basic_monthly", "active", PAST)]),
    "permission-denied",
  );
  await expectCode(
    call(user("u1"), { guideId: GUIDE }, [row("membership_basic_yearly", "revoked", FUTURE)]),
    "permission-denied",
  );
});

run("handler: monthly/yearly/admin receive body", async () => {
  for (const [auth, rows] of [
    [user("u1"), [row("membership_basic_monthly", "active", FUTURE)]],
    [user("u1"), [row("membership_basic_yearly", "active", FUTURE)]],
    [user("u1", { role: "admin" }), []],
  ]) {
    const body = await call(auth, { guideId: GUIDE }, rows);
    assert.equal(body.guideId, GUIDE);
    assert.equal(body.accessTier, "member");
    assert.ok(body.sections.length >= 10);
  }
});

run("handler: unknown guide → not-found (after authz)", async () => {
  await expectCode(
    call(user("u1"), { guideId: "nope" }, [row("membership_basic_monthly", "active", FUTURE)]),
    "not-found",
  );
  // free user must still get permission-denied, not not-found (no guide-existence oracle)
  await expectCode(call(user("u1"), { guideId: "nope" }, []), "permission-denied");
});

run("handler: injected memory lookup is used", async () => {
  const fake = {
    guideId: "memory-guide",
    title: { ko: "m", en: "m" },
    summary: { ko: "m", en: "m" },
    sections: [],
  };
  const body = await handleGetKnowledgeMemberBody({
    auth: user("u1"),
    data: { guideId: "memory-guide" },
    entitlements: mem([row("membership_basic_monthly", "active", FUTURE)]),
    lookupBody: (id) => (id === "memory-guide" ? fake : null),
    now: NOW,
  });
  assert.equal(body.guideId, "memory-guide");
});

run("content: rail has ten substantive ko/en sections with related slugs", () => {
  const body = getKnowledgeMemberRailBody(GUIDE);
  assert.ok(body);
  assert.equal(body.sections.length, 10);
  const ids = body.sections.map((s) => s.id);
  for (const id of [
    "start",
    "how-to-use-12-hubs",
    "path-ai-to-dev",
    "path-elec-plc-farm",
    "path-english-ai",
    "path-car",
    "path-life-save-live",
    "health-ymyl",
    "finance-ymyl",
    "checklist",
  ]) {
    assert.ok(ids.includes(id), `section ${id}`);
  }
  for (const s of body.sections) {
    assert.ok(s.relatedSiteSlugs.length > 0, `${s.id} relatedSiteSlugs`);
    assert.ok(s.paragraphs.length >= 3, `${s.id} paragraphs`);
    for (const p of s.paragraphs) {
      assert.ok(p.ko.length > 40 && p.en.length > 40, `${s.id} substantive ko/en`);
    }
  }
  assert.equal(body.sections.find((s) => s.id === "health-ymyl").disclaimerType, "ymyl_health");
  assert.equal(body.sections.find((s) => s.id === "finance-ymyl").disclaimerType, "ymyl_finance");
  assert.ok(JSON.stringify(body).includes(MEMBER_PHRASE));
  assert.equal(getKnowledgeMemberRailBody("__proto__"), null);
});

run("handlers.ts: always discoverable, env-gated at runtime", () => {
  const src = read("functions/src/knowledge/handlers.ts");
  assert.doesNotMatch(src, /\bomit\s*:/);
  assert.match(src, /region: "us-central1"/);
  assert.match(src, /cors: true/);
  assert.match(src, /ALLOW_KNOWLEDGE_MEMBER_FUNCTION === "true"/);
  assert.match(src, /isFunctionsEmulatorRuntime/);
  assert.match(src, /failed-precondition/);
  assert.match(src, /ensureFirebaseAdminApp/);
  assert.match(src, /FirestoreProductEntitlementLookup/);
  assert.equal(isKnowledgeMemberCallableEnabled({}), false);
  assert.equal(isKnowledgeMemberCallableEnabled({ ALLOW_KNOWLEDGE_MEMBER_FUNCTION: "true" }), true);
  assert.equal(isKnowledgeMemberCallableEnabled({ ALLOW_KNOWLEDGE_MEMBER_FUNCTION: "1" }), false);
  assert.equal(isKnowledgeMemberCallableEnabled({ FUNCTIONS_EMULATOR: "true" }), true);
  assert.match(read("functions/src/index.ts"), /export \{ getKnowledgeMemberBody \} from "\.\/knowledge"/);
  const compiled = require(join(repoRoot, "functions", "lib", "index.js"));
  assert.equal(typeof compiled.getKnowledgeMemberBody, "function");
});

// ── Client catalog: body must not ship ────────────────────────────────────
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

run("client: member body text is not in src/ (public catalog or components)", () => {
  for (const file of walk(join(repoRoot, "src"))) {
    if (!/\.(ts|tsx|mjs|js|json)$/.test(file)) continue;
    const text = readFileSync(file, "utf8");
    assert.ok(!text.includes(MEMBER_PHRASE), `leak in ${file}`);
    assert.ok(!text.includes("path-ai-to-dev"), `section id leak in ${file}`);
  }
});

run("client: knowledge-member-rail.ts is public meta only", () => {
  const src = read("src/data/service-catalog/knowledge-member-rail.ts");
  assert.match(src, /KNOWLEDGE_MEMBER_GUIDE_ID = "unified-learning-rail"/);
  assert.doesNotMatch(src, /paragraphs/);
  assert.doesNotMatch(src, /sections\s*:/);
  assert.match(src, /MEMBERSHIP_MONTHLY_PRODUCT/);
  assert.match(src, /MEMBERSHIP_YEARLY_PRODUCT/);
  assert.doesNotMatch(src, /\b(2000|20000)\b/, "prices must come from SSOT");
});

run("client: rail component fetches on login, gates, honest checkout", () => {
  const src = read("src/components/knowledge/KnowledgeMemberRail.tsx");
  assert.match(src, /^"use client"/);
  assert.match(src, /fetchKnowledgeMemberBody/);
  assert.match(src, /MembershipGate/);
  assert.match(src, /ymylBanner/);
  assert.match(src, /자동갱신/);
  assert.match(src, /결제 준비 중/);
  assert.doesNotMatch(src, /dangerouslySetInnerHTML/);
  assert.doesNotMatch(src, /mockCheckout|prepareCommerceCheckout|confirmCommercePayment/);
  const api = read("src/lib/knowledge-member-api.ts");
  assert.match(api, /getKnowledgeMemberBody/);
  assert.doesNotMatch(api, /isAdmin|userTier|previewAccess/);
});

run("hub: public vs member sections + rail + 12 free cards kept", () => {
  const hub = read("src/components/knowledge/KnowledgeHubView.tsx");
  assert.match(hub, /\[공개 전문관\]/);
  assert.match(hub, /\[Basic 회원 혜택\]/);
  assert.match(hub, /<KnowledgeMemberRail/);
  assert.match(hub, /<KnowledgeSiteVisual/);
  assert.match(hub, /getKnowledgeSites\(\)/);
  assert.match(hub, /Site details|상세 보기/);
  const k = read("src/data/service-catalog/knowledge.ts");
  assert.match(k, /통합 학습 레일/);
});

run("hosting out/: member body phrase absent from knowledge.html (when built)", () => {
  for (const rel of ["out/ko/knowledge.html", "out/en/knowledge.html"]) {
    const p = join(repoRoot, rel);
    if (!existsSync(p)) {
      console.log(`SKIP: ${rel} not built`);
      continue;
    }
    const html = readFileSync(p, "utf8");
    assert.ok(!html.includes(MEMBER_PHRASE), `${rel} leaks member body`);
    assert.ok(!html.includes("path-ai-to-dev"), `${rel} leaks section ids`);
  }
});

// ── Commerce SSOT unchanged ────────────────────────────────────────────────
run("commerce prices 2000 / 20000 / 3000 unchanged", async () => {
  const catalog = await import(pathToFileURL(join(repoRoot, "src/lib/commerce-policy/catalog.mjs")).href);
  assert.equal(catalog.MEMBERSHIP_MONTHLY_PRODUCT.amount, 2000);
  assert.equal(catalog.MEMBERSHIP_YEARLY_PRODUCT.amount, 20000);
  assert.equal(catalog.GOLDEN_EBOOK_PRODUCT.amount, 3000);
  assert.equal(policy.MEMBERSHIP_MONTHLY_PRODUCT.amount, 2000);
  assert.equal(policy.MEMBERSHIP_YEARLY_PRODUCT.amount, 20000);
  assert.equal(policy.GOLDEN_EBOOK_PRODUCT.amount, 3000);
  assert.equal(policy.MEMBERSHIP_TERM_DAYS.monthly, 30);
  assert.equal(policy.MEMBERSHIP_TERM_DAYS.annual, 365);
  assert.equal(policy.RECURRING_BILLING_IMPLEMENTED, false);
  const meta = read("src/data/service-catalog/knowledge-member-rail.ts");
  assert.match(meta, /monthly: 30, annual: 365/);
});

// ── Phase 1 invariants ─────────────────────────────────────────────────────
const EXPECTED_SLUGS = [
  "ai-story",
  "electric",
  "car",
  "finance",
  "language",
  "health",
  "plc",
  "smart-farm",
  "development",
  "web-app-dev",
  "country-ai",
  "save-live",
];

run("phase1: 12 free hubs still in catalog", () => {
  const k = read("src/data/service-catalog/knowledge.ts");
  const start = k.indexOf("export const knowledgeSites");
  const end = k.indexOf("export const knowledgeContents");
  const block = k.slice(start, end);
  const slugs = [...block.matchAll(/\n    slug: "([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(slugs.sort(), [...EXPECTED_SLUGS].sort());
  assert.equal([...block.matchAll(/accessTier: "free"/g)].length, 12);
  assert.doesNotMatch(block, /accessTier: "(member|premium)"/);
});

// ── Icon mapping ───────────────────────────────────────────────────────────
run("visual: 12 slug → icon mapping (tones + switch cases + list)", () => {
  const src = read("src/components/knowledge/KnowledgeSiteVisual.tsx");
  const listBlock = src.slice(src.indexOf("KNOWLEDGE_SITE_VISUAL_SLUGS = ["), src.indexOf("] as const"));
  const tonesBlock = src.slice(src.indexOf("const TONES"), src.indexOf("export function isKnowledgeSiteVisualSlug"));
  for (const slug of EXPECTED_SLUGS) {
    assert.match(listBlock, new RegExp(`"${slug}"`), `list ${slug}`);
    assert.match(tonesBlock, new RegExp(`"?${slug}"?: \\{`), `tone ${slug}`);
    assert.match(src, new RegExp(`case "${slug}":`), `case ${slug}`);
  }
  assert.equal([...listBlock.matchAll(/"([^"]+)"/g)].length, 12);
  assert.match(src, /aria-hidden="true"/);
  assert.match(src, /shrink-0/);
  assert.match(src, /h-16 w-16/);
  const hub = read("src/components/knowledge/KnowledgeHubView.tsx");
  assert.match(hub, /min-w-0/);
});

// ── authorize.ts untouched contract ────────────────────────────────────────
run("ebook authorize.ts: download_requires_owned still present", () => {
  const src = read("functions/src/ebook/authorize.ts");
  assert.match(src, /download_requires_owned/);
  assert.match(src, /Membership alone → DENY/);
  assert.match(src, /return \{ ok: false, code: "download_requires_owned" \}/);
  assert.equal(existsSync(join(repoRoot, "functions/src/knowledge/authorize-knowledge-member.ts")), true);
  const diff = spawnSync("git", ["diff", "--quiet", "--", "functions/src/ebook/authorize.ts"], {
    cwd: repoRoot,
  });
  assert.equal(diff.status, 0, "authorize.ts must not be modified");
  // behavior: membership-only download still denied
  const r = ebook.authorizeEbookDownloadAccess({
    auth: user("u1"),
    productId: "ai-first-ebook-for-50s",
    entitlements: [row("membership_basic_monthly", "active", FUTURE)],
    now: NOW,
  });
  assert.deepEqual(r, { ok: false, code: "download_requires_owned" });
});

await Promise.all(pending);

if (failed) {
  console.error(`${failed} test(s) failed.`);
  process.exit(1);
}
console.log("All knowledge phase 2 member rail tests passed.");
