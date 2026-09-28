/**
 * Golden ebook catalog ingest contract tests (A–O).
 */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertNoInternalLeakInReaderBody,
  assertNoPremiumBodyInPublicCatalog,
  assertNoPublicAssetUrls,
  assertPrivateArtifactLocation,
  buildEbookCatalogItem,
  privateArtifactPath,
  validateGoldenEvidence,
} from "./lib/ingest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");
const passRoot = join(__dirname, "fixtures", "pass_r2");
const passReg = JSON.parse(readFileSync(join(passRoot, "registration.json"), "utf8"));

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
  else {
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

function clonePass(mutate) {
  const dir = mkdtempSync(join(tmpdir(), "ebook-ingest-"));
  cpSync(passRoot, dir, { recursive: true });
  mutate?.(dir);
  return dir;
}

// A. wrong SHA
{
  const dir = clonePass();
  const reg = { ...passReg, expectedPdfSha256: "0".repeat(64) };
  const r = validateGoldenEvidence(dir, reg);
  check("A wrong SHA FAIL", !r.ok && r.errors.includes("pdf_sha_mismatch"), r.errors.join(","));
  rmSync(dir, { recursive: true, force: true });
}

// B. no final approval
{
  const dir = clonePass((d) => {
    writeFileSync(
      join(d, "ingest_evidence.json"),
      JSON.stringify({
        finalRevision: 2,
        completedCount: 18,
        userFinalApproval: false,
        approval: { userApproved: false },
        releaseReady: true,
      }),
    );
    writeFileSync(join(d, "output", "17_final_user_approval_result_r2.md"), "# park only\nawaiting\n");
  });
  const r = validateGoldenEvidence(dir, passReg);
  check(
    "B no final approval FAIL",
    !r.ok && (r.errors.includes("userFinalApproval_missing") || r.errors.includes("final_approval_grant_missing")),
    r.errors.join(","),
  );
  rmSync(dir, { recursive: true, force: true });
}

// C. release_ready=false
{
  const dir = clonePass((d) => {
    writeFileSync(join(d, "output", "18_publication_package_result.md"), "status: draft\nrelease_ready=false\n");
    const ev = JSON.parse(readFileSync(join(d, "ingest_evidence.json"), "utf8"));
    ev.releaseReady = false;
    writeFileSync(join(d, "ingest_evidence.json"), JSON.stringify(ev));
  });
  const r = validateGoldenEvidence(dir, passReg);
  check("C release_ready false FAIL", !r.ok && r.errors.includes("release_ready_false"), r.errors.join(","));
  rmSync(dir, { recursive: true, force: true });
}

// D. R1 selected
{
  const dir = clonePass();
  const reg = { ...passReg, finalRevision: 1, requireAuthoritativeR2: true };
  const r = validateGoldenEvidence(dir, reg);
  check("D R1 selected FAIL", !r.ok && r.errors.includes("r1_selected"), r.errors.join(","));
  rmSync(dir, { recursive: true, force: true });
}

// E. normal R2 PASS (all-free fixture → public bodies, empty private)
let built;
{
  built = buildEbookCatalogItem(passRoot, passReg, { generatedAt: "2026-09-29T00:00:00.000Z" });
  check("E normal R2 EbookCatalogItem PASS", Boolean(built.item?.slug === "fixture-pass-ebook"));
  check("E toc/chapters present", built.tocCount === 2 && built.chapterCount === 2);
  check("E all-free private package empty", built.privatePackage.chapters.length === 0);
  let noPrem = true;
  try {
    assertNoPremiumBodyInPublicCatalog(built.item);
  } catch {
    noPrem = false;
  }
  check("E no premium body in public fixture", noPrem);
}

// E2. public/private split (fm-01 free, ch-01 premium)
{
  const splitReg = {
    ...passReg,
    accessTier: "premium",
    chapterAccess: { default: "premium", byId: { "fm-01": "free" } },
  };
  const split = buildEbookCatalogItem(passRoot, splitReg, { generatedAt: "2026-09-29T00:00:00.000Z" });
  const pubFree = split.item.chapters.find((c) => c.id === "fm-01");
  const pubPrem = split.item.chapters.find((c) => c.id === "ch-01");
  check("E2 free preview has pages", (pubFree?.pages?.length || 0) > 0);
  check("E2 premium public pages empty", (pubPrem?.pages?.length || 0) === 0);
  check("E2 private has ch-01 only", split.privatePackage.chapters.map((c) => c.id).join(",") === "ch-01");
  check(
    "E2 private ch-01 has body",
    (split.privatePackage.chapters[0]?.pages?.length || 0) > 0,
  );
  check(
    "E2 private location allowed",
    (() => {
      try {
        const p = privateArtifactPath(repoRoot, splitReg.slug, splitReg.finalRevision);
        assertPrivateArtifactLocation(repoRoot, p);
        return true;
      } catch {
        return false;
      }
    })(),
  );
  // fail-closed: member tier chapter rejected
  let memberRejected = false;
  try {
    buildEbookCatalogItem(
      passRoot,
      { ...passReg, chapterAccess: { default: "member", byId: {} } },
      { generatedAt: "2026-09-29T00:00:00.000Z" },
    );
  } catch (e) {
    memberRejected = String(e.message).includes("unsupported_chapter_access");
  }
  check("E2 member chapterAccess fail-closed", memberRejected);
}

// F. slug unique vs fixtures
{
  const ebooksSrc = readFileSync(join(repoRoot, "src", "data", "service-catalog", "ebooks.ts"), "utf8");
  const fixtureSlugs = ["field-software-primer", "ai-practice-notes", "smart-farm-signals"];
  const goldenSlug = "ai-first-ebook-for-50s";
  check("F golden slug not a fixture id", !fixtureSlugs.includes(goldenSlug));
  check(
    "F catalog merges generated + fixtures",
    ebooksSrc.includes("generatedEbookCatalogItem") &&
      fixtureSlugs.every((s) => ebooksSrc.includes(s)),
  );}

// G. TOC/chapter order
{
  const idsToc = built.item.toc.map((t) => t.id);
  const idsCh = built.item.chapters.map((c) => c.id);
  check("G TOC/chapter order match", JSON.stringify(idsToc) === JSON.stringify(idsCh), `${idsToc} vs ${idsCh}`);
}

// H. no internal leak
{
  let ok = true;
  try {
    assertNoInternalLeakInReaderBody(built.item);
  } catch {
    ok = false;
  }
  check("H no internal STEP/validator/path/SHA in reader body", ok);
}

// I. no PDF/EPUB public URL
{
  let ok = true;
  try {
    assertNoPublicAssetUrls(built.item);
  } catch {
    ok = false;
  }
  const blob = JSON.stringify(built.item);
  check("I no PDF/EPUB public URL", ok && !/\.pdf|\.epub|https?:\/\//i.test(blob));
}

// J. fixture 3권 still in source
{
  const ebooksSrc = readFileSync(join(repoRoot, "src", "data", "service-catalog", "ebooks.ts"), "utf8");
  check(
    "J fixture 3권 retained",
    ebooksSrc.includes("field-software-primer") &&
      ebooksSrc.includes("ai-practice-notes") &&
      ebooksSrc.includes("smart-farm-signals"),
  );
}

// K/L/M render wiring — pages import getEbookCatalog / getEbookBySlug
{
  const lib = readFileSync(join(repoRoot, "src", "components", "ebook", "EbookLibraryView.tsx"), "utf8");
  const detail = readFileSync(join(repoRoot, "src", "app", "[locale]", "ebooks", "[slug]", "page.tsx"), "utf8");
  const read = readFileSync(join(repoRoot, "src", "app", "[locale]", "ebooks", "[slug]", "read", "page.tsx"), "utf8");
  check("K /ebooks list uses getEbookCatalog", lib.includes("getEbookCatalog"));
  check("L detail uses getEbookBySlug", detail.includes("getEbookBySlug"));
  check("M reader uses getEbookBySlug", read.includes("getEbookBySlug"));
}

// N. ko locale fields present
{
  check("N ko title/summary present", Boolean(built.item.title.ko && built.item.summary.ko));
}

// O. en fallback without inventing official translation
{
  check(
    "O en fallback equals ko when en null",
    built.item.title.en === built.item.title.ko && built.item.summary.en === built.item.summary.ko,
  );
}

// Extra: list/table content preserved
{
  const fm = built.item.chapters.find((c) => c.id === "fm-01");
  const blob = JSON.stringify(fm);
  check("list content retained", blob.includes("항목 하나") && blob.includes("항목 둘"));
  check("table text retained", blob.includes("구분:") || blob.includes("A:"));
}

// Generated golden entry checks (after ingest)
const genTs = join(repoRoot, "src", "data", "service-catalog", "generated", "ai-first-ebook-for-50s.catalog.ts");
const genProv = join(repoRoot, "src", "data", "service-catalog", "generated", "ai-first-ebook-for-50s.provenance.json");
if (existsSync(genTs) && existsSync(genProv)) {
  const ts = readFileSync(genTs, "utf8");
  const prov = JSON.parse(readFileSync(genProv, "utf8"));
  const itemMatch = ts.match(
    /export const generatedEbookCatalogItem = (\{[\s\S]*\n\}) as EbookCatalogItem;/,
  );
  check("generated catalog JSON extractable", Boolean(itemMatch));
  const golden = itemMatch ? JSON.parse(itemMatch[1]) : null;

  check("generated slug", golden?.slug === "ai-first-ebook-for-50s");
  check("generated accessTier premium", golden?.accessTier === "premium");
  check("generated status preparing", golden?.status === "preparing");
  check(
    "generated priceNote paid unset",
    Boolean(golden && /유료/.test(golden.priceNote.ko) && /가격 확정 전/.test(golden.priceNote.ko)),
  );

  const freeIds = (golden?.chapters || []).filter((c) => c.accessTier === "free").map((c) => c.id);
  const premiumIds = (golden?.chapters || []).filter((c) => c.accessTier === "premium").map((c) => c.id);
  const memberIds = (golden?.chapters || []).filter((c) => c.accessTier === "member").map((c) => c.id);
  check(
    "free preview only fm-01/fm-02/ch-01",
    freeIds.sort().join(",") === ["ch-01", "fm-01", "fm-02"].sort().join(","),
    freeIds.join(","),
  );
  check("no member-gated full body chapters", memberIds.length === 0, memberIds.join(","));
  check(
    "remaining chapters premium",
    Boolean(golden) && premiumIds.length === golden.chapters.length - 3,
    String(premiumIds.length),
  );

  const premiumPublicParas = (golden?.chapters || [])
    .filter((c) => c.accessTier === "premium")
    .reduce((n, c) => n + (c.pages || []).reduce((m, p) => m + (p.paragraphs || []).length, 0), 0);
  check("A premium public body count 0", premiumPublicParas === 0, String(premiumPublicParas));

  for (const id of ["fm-01", "fm-02", "ch-01"]) {
    const ch = golden?.chapters?.find((c) => c.id === id);
    const paras = (ch?.pages || []).reduce((n, p) => n + (p.paragraphs || []).length, 0);
    check(`B free preview body present ${id}`, paras > 0, String(paras));
  }

  const privPath = privateArtifactPath(repoRoot, "ai-first-ebook-for-50s", 2);
  if (existsSync(privPath)) {
    const priv = JSON.parse(readFileSync(privPath, "utf8"));
    check("C private premium chapters 15", priv.chapters.length === 15, String(priv.chapters.length));
    check(
      "D private no free preview duplicate",
      priv.chapters.every((c) => c.accessTier === "premium" && !["fm-01", "fm-02", "ch-01"].includes(c.id)),
    );
    const privParas = priv.chapters.reduce(
      (n, c) => n + c.pages.reduce((m, p) => m + p.paragraphs.length, 0),
      0,
    );
    check("F private body paragraphs > 0", privParas > 0, String(privParas));
    check(
      "E private not under src/public/out",
      (() => {
        try {
          assertPrivateArtifactLocation(repoRoot, privPath);
          return true;
        } catch {
          return false;
        }
      })(),
    );

    // J: guest/member cannot obtain premium body from public catalog
    const ACCESS_TIER_RANK = { free: 0, member: 1, premium: 2 };
    const publicPremiumBodyFor = (personaTier) => {
      if (ACCESS_TIER_RANK[personaTier] < ACCESS_TIER_RANK.premium) {
        return golden.chapters
          .filter((c) => c.accessTier === "premium")
          .every((c) => (c.pages || []).length === 0);
      }
      // Even premium persona cannot read body from public catalog in Phase 1
      return golden.chapters
        .filter((c) => c.accessTier === "premium")
        .every((c) => (c.pages || []).length === 0);
    };
    check("J guest cannot get premium body from public", publicPremiumBodyFor("free"));
    check("J member cannot get premium body from public", publicPremiumBodyFor("member"));
    check("J premium persona still no public premium body", publicPremiumBodyFor("premium"));
  } else {
    check("C private artifact present", false, "run ingest first");
  }

  check("generated no absolute Documents path", !ts.includes("C:\\\\Users") && !ts.includes("C:/Users"));
  check(
    "I provenance SHA not embedded in public catalog TS",
    !/sourcePdfSha256|sourceEpubSha256|generatedProvenance/.test(ts),
  );
  check(
    "provenance SHA match Golden (sidecar)",
    prov.sourcePdfSha256 === "ca2ecebe8667ccb67f5b6cd5515358781406b0ce65d157a01e3abc9adda28336" &&
      prov.sourceEpubSha256 === "147d9ccc15bea8c5917296498a5dc8cbc30f85c9df9210f3730abe09c5fde3e6",
  );
  check(
    "provenance not in reader component source",
    !readFileSync(join(repoRoot, "src", "components", "ebook", "EbookReaderClient.tsx"), "utf8").includes(
      "sourcePdfSha256",
    ),
  );
  check(
    "Reader wires fetchEbookChapterBody for premium",
    readFileSync(join(repoRoot, "src", "components", "ebook", "EbookReaderClient.tsx"), "utf8").includes(
      "fetchEbookChapterBody",
    ),
  );
  let noPublicAsset = false;
  try {
    assertNoPublicAssetUrls(golden);
    assertNoPremiumBodyInPublicCatalog(golden);
    noPublicAsset = true;
  } catch {
    noPublicAsset = false;
  }
  check(
    "generated no PDF/EPUB public asset URL",
    noPublicAsset &&
      !Object.prototype.hasOwnProperty.call(golden, "pdfUrl") &&
      !Object.prototype.hasOwnProperty.call(golden, "epubUrl") &&
      !Object.prototype.hasOwnProperty.call(golden, "downloadUrl"),
  );
} else {
  check("generated artifacts present", false, "run ingest first");
}

console.log(failed === 0 ? `\n${"ALL PASS"}` : `\nFAILED=${failed}`);
process.exit(failed === 0 ? 0 : 1);
