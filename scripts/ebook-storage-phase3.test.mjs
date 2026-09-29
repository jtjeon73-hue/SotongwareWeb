/**
 * Phase 3 — private Storage path, provider, rules, dry-run upload tests.
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
check("functions tsc build", build.status === 0, build.status === 0 ? "" : build.stderr);
if (build.status !== 0) {
  process.exit(1);
}

const ebook = require(join(repoRoot, "functions", "lib", "ebook", "index.js"));
const {
  canonicalEbookChapterObjectPath,
  EbookStoragePathError,
  FirebaseStorageEbookContentProvider,
  MemoryStorageObjectReader,
  handleGetEbookChapterBody,
  EbookChapterAccessError,
  MemoryProductEntitlementLookup,
  resolveEbookContentProviderMode,
  PRIVATE_EBOOK_STORAGE_LAYOUT,
} = ebook;

const PRODUCT = "ai-first-ebook-for-50s";
const REV = 2;
const NOW = new Date("2026-09-29T12:00:00.000Z");

// A canonicalization
{
  const p = canonicalEbookChapterObjectPath(PRODUCT, REV, "ch-02");
  check(
    "A canonical path",
    p === "private/ebooks/ai-first-ebook-for-50s/r2/chapters/ch-02.json",
    p,
  );
}

// B traversal
{
  const attacks = [
    () => canonicalEbookChapterObjectPath("../etc", REV, "ch-02"),
    () => canonicalEbookChapterObjectPath(PRODUCT, REV, "../../secret"),
    () => canonicalEbookChapterObjectPath(PRODUCT, REV, "ch/02"),
    () => canonicalEbookChapterObjectPath("ai-first-ebook-for-50s/../x", REV, "ch-02"),
  ];
  let allFail = true;
  for (const fn of attacks) {
    try {
      fn();
      allFail = false;
    } catch (e) {
      if (!(e instanceof EbookStoragePathError)) allFail = false;
    }
  }
  check("B traversal attack FAIL", allFail);
}

// C/D/E wrong ids via provider
{
  const chapter = {
    id: "ch-02",
    title: { ko: "테스트", en: "Test" },
    accessTier: "premium",
    pages: [{ paragraphs: [{ ko: "STORAGE_PHASE3_MARKER_UNIQUE", en: "STORAGE_PHASE3_MARKER_UNIQUE" }] }],
  };
  const path = canonicalEbookChapterObjectPath(PRODUCT, REV, "ch-02");
  const reader = new MemoryStorageObjectReader(
    new Map([[path, Buffer.from(JSON.stringify(chapter))]]),
  );
  const provider = new FirebaseStorageEbookContentProvider(reader, REV);

  check(
    "C wrong product FAIL",
    (await provider.getChapter("other-ebook", "ch-02")) === null,
  );
  check(
    "D wrong revision FAIL",
    (await new FirebaseStorageEbookContentProvider(reader, 99).getChapter(PRODUCT, "ch-02")) ===
      null,
  );
  check(
    "E wrong chapter FAIL",
    (await provider.getChapter(PRODUCT, "ch-99")) === null,
  );
  check(
    "L storage provider returns chapter",
    ((await provider.getChapter(PRODUCT, "ch-02")) || {}).id === "ch-02",
  );
}

// F missing object
{
  const provider = new FirebaseStorageEbookContentProvider(new MemoryStorageObjectReader(new Map()), 2);
  check("F missing object fail-closed", (await provider.getChapter(PRODUCT, "ch-02")) === null);
}

// G malformed JSON
{
  const path = canonicalEbookChapterObjectPath(PRODUCT, REV, "ch-02");
  const provider = new FirebaseStorageEbookContentProvider(
    new MemoryStorageObjectReader(new Map([[path, Buffer.from("{not-json")]])),
    REV,
  );
  check("G malformed JSON fail-closed", (await provider.getChapter(PRODUCT, "ch-02")) === null);
}

// L/M Callable + Storage authorized
{
  const chapter = {
    id: "ch-02",
    title: { ko: "본문", en: "Body" },
    accessTier: "premium",
    pages: [{ paragraphs: [{ ko: "STORAGE_PHASE3_MARKER_UNIQUE", en: "STORAGE_PHASE3_MARKER_UNIQUE" }] }],
  };
  const path = canonicalEbookChapterObjectPath(PRODUCT, REV, "ch-02");
  const content = new FirebaseStorageEbookContentProvider(
    new MemoryStorageObjectReader(new Map([[path, Buffer.from(JSON.stringify(chapter))]])),
    REV,
  );

  async function call(auth, ents) {
    return handleGetEbookChapterBody({
      auth,
      data: { productId: PRODUCT, chapterId: "ch-02", isAdmin: true, previewAccess: "premium" },
      entitlements: new MemoryProductEntitlementLookup(new Map([[auth?.uid || "x", ents]])),
      content,
      now: NOW,
    });
  }

  try {
    const body = await call(
      { uid: "buyer", token: { role: "member" } },
      [{ productId: PRODUCT, status: "active", expiresAt: null }],
    );
    check(
      "L valid premium Callable→Storage PASS",
      body.pages[0].paragraphs[0].ko.includes("STORAGE_PHASE3_MARKER_UNIQUE") &&
        !JSON.stringify(body).includes("storagePath") &&
        !JSON.stringify(body).includes("private/ebooks"),
    );
  } catch (e) {
    check("L valid premium Callable→Storage PASS", false, String(e));
  }

  try {
    const body = await call({ uid: "admin1", token: { role: "admin" } }, []);
    check("M admin Callable→Storage PASS", body.chapterId === "ch-02");
  } catch (e) {
    check("M admin Callable→Storage PASS", false, String(e));
  }

  try {
    await call({ uid: "member1", token: { role: "member" } }, []);
    check("N forged/unauthorized DENY", false);
  } catch (e) {
    check(
      "N forged/unauthorized DENY",
      e instanceof EbookChapterAccessError && e.code === "permission-denied",
    );
  }
}

// R production local fallback forbidden
{
  try {
    resolveEbookContentProviderMode({
      EBOOK_CONTENT_PROVIDER: "local",
      K_SERVICE: "getEbookChapterBody",
      FUNCTIONS_EMULATOR: "false",
    });
    check("R production local fallback forbidden", false);
  } catch (e) {
    check(
      "R production local fallback forbidden",
      String(e.message).includes("local_forbidden_in_production"),
    );
  }
  check(
    "R cloud default is storage",
    resolveEbookContentProviderMode({
      K_SERVICE: "getEbookChapterBody",
      FUNCTIONS_EMULATOR: "false",
    }) === "storage",
  );
  check(
    "R emulator default is local",
    resolveEbookContentProviderMode({ FUNCTIONS_EMULATOR: "true" }) === "local",
  );
}

// Dry-run uploader
{
  const priv = join(
    repoRoot,
    "artifacts",
    "ebook-private",
    PRODUCT,
    "r2",
    "private-content.json",
  );
  if (!existsSync(priv)) {
    check("P private package present for dry-run", false, "run ingest first");
  } else {
    const up = spawnSync(
      "node",
      [
        "scripts/ebook-private-storage-upload.mjs",
        "--dry-run",
        "--product",
        PRODUCT,
        "--revision",
        "2",
      ],
      { cwd: repoRoot, encoding: "utf8", shell: true },
    );
    check("uploader dry-run exit 0", up.status === 0, up.stderr || up.stdout.slice(0, 200));
    const manifestPath = join(
      repoRoot,
      "artifacts",
      "ebook-content-assets",
      PRODUCT,
      "r2",
      "contentAssets.manifest.json",
    );
    check("R contentAssets manifest exists", existsSync(manifestPath));
    if (existsSync(manifestPath)) {
      const man = JSON.parse(readFileSync(manifestPath, "utf8"));
      check("P premium chapter objects 15", man.assetCount === 15, String(man.assetCount));
      check(
        "Q free chapters excluded from manifest",
        man.assets.every((a) => !["fm-01", "fm-02", "ch-01"].includes(a.chapterId)),
      );
      check("H manifest dryRun true / not uploaded", man.dryRun === true && man.uploadedToFirebase === false);
      check(
        "H manifest not under src/public",
        !manifestPath.replace(/\\/g, "/").includes("/src/") &&
          !manifestPath.replace(/\\/g, "/").includes("/public/"),
      );
    }
  }
}

// layout / firebase.json / storage.rules
{
  const rules = readFileSync(join(repoRoot, "storage.rules"), "utf8");
  const fb = JSON.parse(readFileSync(join(repoRoot, "firebase.json"), "utf8"));
  check("storage.rules deny private ebooks", /private\/ebooks/.test(rules) && /allow read, write: if false/.test(rules));
  check("firebase.json storage rules wired", fb.storage?.rules === "storage.rules");
  check("firebase.json storage emulator port", fb.emulators?.storage?.port === 9199);
  check(
    "layout documents binary paths",
    PRIVATE_EBOOK_STORAGE_LAYOUT.pdfObject.includes("files/book.pdf"),
  );
}

// Storage rules emulator — run separately via npm run test:ebook:storage:rules
check(
  "H-K storage rules covered by test:ebook:storage:rules",
  existsSync(join(repoRoot, "scripts", "ebook-storage-rules.test.mjs")),
);

// Public leakage of staging marker
{
  const publicTs = join(
    repoRoot,
    "src",
    "data",
    "service-catalog",
    "generated",
    `${PRODUCT}.catalog.ts`,
  );
  if (existsSync(publicTs)) {
    const ts = readFileSync(publicTs, "utf8");
    check("S STORAGE_PHASE3 marker not in public catalog", !ts.includes("STORAGE_PHASE3_MARKER_UNIQUE"));
    check("T no pdfUrl/epubUrl", !/"pdfUrl"|"epubUrl"/.test(ts));
  }
}

console.log(failed === 0 ? "\nSTORAGE PHASE3 UNIT ALL PASS" : `\nFAILED=${failed}`);
process.exit(failed === 0 ? 0 : 1);
