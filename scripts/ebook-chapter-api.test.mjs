/**
 * Phase 2 — getEbookChapterBody authorization + content provider tests.
 * Builds functions/ then loads compiled modules (no Firebase deploy).
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
const {
  authorizeEbookChapterAccess,
  handleGetEbookChapterBody,
  EbookChapterAccessError,
  LocalPrivateArtifactProvider,
  MemoryEbookContentProvider,
  MemoryProductEntitlementLookup,
  FUTURE_PRIVATE_STORAGE_LAYOUT,
} = ebook;

const PRODUCT = "ai-test-ebook";
const CHAPTER = "ch-prem-01";
const NOW = new Date("2026-09-29T12:00:00.000Z");

const miniRoot = join(repoRoot, "scripts", "ebook-ingest", "fixtures", "private-mini");
const content = new LocalPrivateArtifactProvider(miniRoot, 2);

function memEnt(uid, rows) {
  return new MemoryProductEntitlementLookup(new Map([[uid, rows]]));
}

async function call(auth, data, entitlements) {
  return handleGetEbookChapterBody({
    auth,
    data,
    entitlements,
    content,
    now: NOW,
  });
}

async function expectDeny(label, auth, data, entitlements) {
  try {
    await call(auth, data, entitlements);
    check(label, false, "expected deny");
  } catch (e) {
    const ok =
      e instanceof EbookChapterAccessError &&
      (e.code === "permission-denied" || e.code === "unauthenticated" || e.code === "not-found");
    check(label, ok, e instanceof Error ? `${e.code}:${e.message}` : String(e));
  }
}

// 1 guest
await expectDeny("1 guest premium DENY", null, { productId: PRODUCT, chapterId: CHAPTER }, memEnt("x", []));

// 2 member only (auth, no entitlement)
await expectDeny(
  "2 member only DENY",
  { uid: "member1", token: { role: "member" } },
  { productId: PRODUCT, chapterId: CHAPTER },
  memEnt("member1", []),
);

// 3 forged client premium flags
await expectDeny(
  "3 forged client premium DENY",
  { uid: "member1", token: { role: "member" } },
  {
    productId: PRODUCT,
    chapterId: CHAPTER,
    userTier: "premium",
    previewAccess: "premium",
    accessLevel: "premium",
  },
  memEnt("member1", []),
);

// 4 wrong product entitlement
await expectDeny(
  "4 wrong product entitlement DENY",
  { uid: "buyer", token: { role: "member" } },
  { productId: PRODUCT, chapterId: CHAPTER },
  memEnt("buyer", [
    { productId: "other-ebook", status: "active", expiresAt: null },
  ]),
);

// 5 revoked
await expectDeny(
  "5 revoked entitlement DENY",
  { uid: "buyer", token: { role: "member" } },
  { productId: PRODUCT, chapterId: CHAPTER },
  memEnt("buyer", [
    { productId: PRODUCT, status: "revoked", expiresAt: null },
  ]),
);

// 6 expired
await expectDeny(
  "6 expired entitlement DENY",
  { uid: "buyer", token: { role: "member" } },
  { productId: PRODUCT, chapterId: CHAPTER },
  memEnt("buyer", [
    {
      productId: PRODUCT,
      status: "active",
      expiresAt: new Date("2020-01-01T00:00:00.000Z"),
    },
  ]),
);

// 7 valid product entitlement
{
  try {
    const body = await call(
      { uid: "buyer", token: { role: "member" } },
      { productId: PRODUCT, chapterId: CHAPTER, isAdmin: false },
      memEnt("buyer", [{ productId: PRODUCT, status: "active", expiresAt: null }]),
    );
    check(
      "7 valid product entitlement ALLOW",
      body.chapterId === CHAPTER &&
        body.pages[0].paragraphs[0].ko.includes("PRIVATE_MARKER_PHASE2"),
    );
    check(
      "7 response has no provenance/SHA/path",
      !("provenance" in body) &&
        !JSON.stringify(body).includes("sourcePdfSha256") &&
        !JSON.stringify(body).includes("EbookProjects") &&
        !JSON.stringify(body).includes("private-content.json"),
    );
  } catch (e) {
    check("7 valid product entitlement ALLOW", false, String(e));
  }
}

// 8 server verified admin
{
  try {
    const body = await call(
      { uid: "admin1", token: { role: "admin" } },
      { productId: PRODUCT, chapterId: CHAPTER },
      memEnt("admin1", []),
    );
    check("8 server verified admin ALLOW", body.chapterId === CHAPTER && body.pages.length === 1);
  } catch (e) {
    check("8 server verified admin ALLOW", false, String(e));
  }
}

// 9 forged admin client flag (token not admin)
await expectDeny(
  "9 forged admin client flag DENY",
  { uid: "member1", token: { role: "member", isAdmin: true } },
  { productId: PRODUCT, chapterId: CHAPTER, isAdmin: true },
  memEnt("member1", []),
);

// 10 wrong chapterId
await expectDeny(
  "10 wrong chapterId DENY/not-found",
  { uid: "buyer", token: { role: "member" } },
  { productId: PRODUCT, chapterId: "ch-does-not-exist" },
  memEnt("buyer", [{ productId: PRODUCT, status: "active", expiresAt: null }]),
);

// authorize unit: client fields never consulted
{
  const r = authorizeEbookChapterAccess({
    auth: { uid: "u", token: { role: "member" } },
    productId: PRODUCT,
    entitlements: [],
  });
  check("authz member empty DENY", r.ok === false);
  const admin = authorizeEbookChapterAccess({
    auth: { uid: "a", token: { role: "admin" } },
    productId: PRODUCT,
    entitlements: [],
  });
  check("authz admin ALLOW", admin.ok === true && admin.reason === "admin");
}

// 14 server/content failure fail-closed
{
  const empty = new MemoryEbookContentProvider(new Map());
  try {
    await handleGetEbookChapterBody({
      auth: { uid: "buyer", token: { role: "member" } },
      data: { productId: PRODUCT, chapterId: CHAPTER },
      entitlements: memEnt("buyer", [{ productId: PRODUCT, status: "active", expiresAt: null }]),
      content: empty,
      now: NOW,
    });
    check("14 missing content fail-closed", false);
  } catch (e) {
    check(
      "14 missing content fail-closed",
      e instanceof EbookChapterAccessError && e.code === "not-found",
    );
  }
}

// Reader wiring — PreviewPersona must not be authority for private fetch
{
  const reader = readFileSync(
    join(repoRoot, "src", "components", "ebook", "EbookReaderClient.tsx"),
    "utf8",
  );
  const api = readFileSync(join(repoRoot, "src", "lib", "ebook-chapter-api.ts"), "utf8");
  check("11/F Reader calls fetchEbookChapterBody", reader.includes("fetchEbookChapterBody"));
  check("11 free preview still inline path", reader.includes('bodySource: "inline"'));
  check(
    "3/9 client payload only productId+chapterId",
    api.includes("getEbookChapterBody") &&
      api.includes("productId: input.productId") &&
      api.includes("chapterId: input.chapterId") &&
      !api.includes("previewAccess:") &&
      !api.includes("isAdmin:") &&
      !api.includes("userTier:"),
  );
  check(
    "Reader notes server entitlement gate",
    reader.includes("server entitlement") || reader.includes("서버 이용권"),
  );
  const personaBar = readFileSync(
    join(repoRoot, "src", "components", "access", "PreviewPersonaBar.tsx"),
    "utf8",
  );
  const personaHook = readFileSync(
    join(repoRoot, "src", "components", "access", "usePreviewPersona.ts"),
    "utf8",
  );
  const library = readFileSync(
    join(repoRoot, "src", "components", "ebook", "EbookLibraryView.tsx"),
    "utf8",
  );
  const detail = readFileSync(
    join(repoRoot, "src", "components", "ebook", "EbookDetailView.tsx"),
    "utf8",
  );
  const readerSrc = readFileSync(
    join(repoRoot, "src", "components", "ebook", "EbookReaderClient.tsx"),
    "utf8",
  );
  check(
    "PreviewPersonaBar gated for production",
    personaBar.includes("isPreviewPersonaEnabled") &&
      personaBar.includes("if (!enabled) return null"),
  );
  check(
    "ebook screens omit PreviewPersonaBar",
    !library.includes("PreviewPersonaBar") &&
      !detail.includes("PreviewPersonaBar") &&
      !readerSrc.includes("PreviewPersonaBar"),
  );
  check(
    "production persona hook force guest",
    personaHook.includes('return "guest"') &&
      personaHook.includes("isPreviewPersonaEnabled"),
  );
}

// Golden private artifact provider (if present)
{
  const goldenRoot = join(repoRoot, "artifacts", "ebook-private");
  const goldenProvider = new LocalPrivateArtifactProvider(goldenRoot, 2);
  if (existsSync(join(goldenRoot, "ai-first-ebook-for-50s", "r2", "private-content.json"))) {
    try {
      const body = await handleGetEbookChapterBody({
        auth: { uid: "admin1", token: { role: "admin" } },
        data: { productId: "ai-first-ebook-for-50s", chapterId: "ch-02" },
        entitlements: memEnt("admin1", []),
        content: goldenProvider,
        now: NOW,
      });
      check(
        "12 golden premium chapter ALLOW via admin",
        body.chapterId === "ch-02" && body.pages.length > 0,
      );
      check("12 single chapter only", !JSON.stringify(body).includes('"ch-03"'));
    } catch (e) {
      check("12 golden premium chapter ALLOW via admin", false, String(e));
    }
  } else {
    check("12 golden private artifact present (optional)", false, "run ingest first");
  }
}

// Source wiring
{
  const indexSrc = readFileSync(join(repoRoot, "functions", "src", "index.ts"), "utf8");
  check("export getEbookChapterBody", indexSrc.includes("getEbookChapterBody"));
  check(
    "future storage layout documented",
    Boolean(ebook.PRIVATE_EBOOK_STORAGE_LAYOUT?.chapterObject || ebook.FUTURE_PRIVATE_STORAGE_LAYOUT?.chapterObject),
  );
}

// Public leakage of test marker
{
  const publicTs = readFileSync(
    join(
      repoRoot,
      "src",
      "data",
      "service-catalog",
      "generated",
      "ai-first-ebook-for-50s.catalog.ts",
    ),
    "utf8",
  );
  check(
    "15 test private marker not in public catalog",
    !publicTs.includes("PRIVATE_MARKER_PHASE2_UNIQUE_SENTENCE_ALPHA"),
  );
  check("16 no pdfUrl in public catalog", !/"pdfUrl"|"epubUrl"/.test(publicTs));
}

// Diagnostic logging — client stays generic; server gets sanitized message
{
  const { runEbookDiagnosticLogChecks } = await import("./ebook-diagnostic-log.checks.mjs");
  runEbookDiagnosticLogChecks(ebook, check);
  const handlersSrc = readFileSync(join(repoRoot, "functions", "src", "ebook", "handlers.ts"), "utf8");
  check("diag handlers use sanitized logger", handlersSrc.includes("logEbookCallableFailure"));
  check("diag handlers keep client internal constant", handlersSrc.includes("EBOOK_CLIENT_INTERNAL_MESSAGE"));
  check(
    "diag handlers do not put Error.message in HttpsError",
    !/HttpsError\(\s*["']internal["']\s*,\s*[eE]\.message/.test(handlersSrc),
  );
  check(
    "diag stage labels present",
    handlersSrc.includes('stage = "provider_init"') && handlersSrc.includes('stage = "handle_chapter"'),
  );
  const clientApi = readFileSync(join(repoRoot, "src", "lib", "ebook-chapter-api.ts"), "utf8");
  check(
    "diag client maps unknown to generic unavailable",
    clientApi.includes("본문을 불러오지 못했습니다"),
  );
}

console.log(failed === 0 ? "\nCHAPTER API ALL PASS" : `\nFAILED=${failed}`);
process.exit(failed === 0 ? 0 : 1);
