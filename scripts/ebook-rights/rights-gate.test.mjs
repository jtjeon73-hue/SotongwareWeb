/**
 * Publishing-rights gate unit tests + Golden record checks.
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { mkdtempSync } from "node:fs";
import {
  evaluateRightsPublicationGate,
  buildRightsManifest,
  assertNoRightsLeakInPublicText,
} from "./lib/gate.mjs";
import { scanManuscriptRights } from "./lib/scan.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function baseManifest(over = {}) {
  return {
    schemaVersion: 1,
    productId: "sample-ebook",
    revision: 2,
    author: "SotongWare",
    publisher: "SotongWare",
    aiAssisted: false,
    humanEditorialContribution: "Fully human-authored sample",
    thirdPartySources: [],
    assets: [],
    trademarks: [],
    citations: [],
    licenses: [],
    openIssues: [],
    reviewStatus: "pending",
    reviewedAt: null,
    ...over,
  };
}

// A missing
{
  const g = evaluateRightsPublicationGate(null);
  check("A manifest missing FAIL", !g.ok && g.errors.includes("rights_manifest_missing"));
}

// B pending
{
  const g = evaluateRightsPublicationGate(baseManifest({ reviewStatus: "pending" }));
  check("B pending FAIL", !g.ok && g.errors.includes("reviewStatus_pending"));
}

// C needs_review
{
  const g = evaluateRightsPublicationGate(baseManifest({ reviewStatus: "needs_review" }));
  check("C needs_review FAIL", !g.ok && g.errors.includes("reviewStatus_needs_review"));
}

// D blocked
{
  const g = evaluateRightsPublicationGate(baseManifest({ reviewStatus: "blocked" }));
  check("D blocked FAIL", !g.ok && g.errors.includes("reviewStatus_blocked"));
}

// E cleared + unresolved
{
  const g = evaluateRightsPublicationGate(
    baseManifest({
      reviewStatus: "cleared",
      openIssues: [
        {
          id: "x",
          category: "license_unknown",
          blocksPublication: true,
          resolved: false,
        },
      ],
    }),
  );
  check(
    "E cleared+unresolved FAIL",
    !g.ok && g.errors.some((e) => e.startsWith("cleared_with_unresolved")),
  );
}

// F cleared + evidence OK
{
  const g = evaluateRightsPublicationGate(
    baseManifest({
      reviewStatus: "cleared",
      reviewedAt: "2026-09-29T00:00:00.000Z",
      openIssues: [
        {
          id: "x",
          category: "license_unknown",
          blocksPublication: true,
          resolved: true,
          resolutionNote: "Counsel confirmed",
        },
      ],
      thirdPartySources: [
        {
          id: "SRC01",
          licenseStatus: "reviewed_link_only",
          commercialUseStatus: "no_republication_link_only",
        },
      ],
    }),
  );
  check("F cleared+resolved PASS", g.ok, g.errors.join(","));
}

// G unknown source category issue
{
  const g = evaluateRightsPublicationGate(
    baseManifest({
      reviewStatus: "needs_review",
      openIssues: [{ id: "s", category: "source_unknown", blocksPublication: true, resolved: false }],
    }),
  );
  check("G unknown source FAIL", !g.ok);
}

// H unknown commercial license on source while cleared attempt
{
  const g = evaluateRightsPublicationGate(
    baseManifest({
      reviewStatus: "cleared",
      openIssues: [],
      thirdPartySources: [
        { id: "SRC01", licenseStatus: "unknown", commercialUseStatus: "unknown" },
      ],
    }),
  );
  check(
    "H unknown commercial license FAIL",
    !g.ok &&
      g.errors.some((e) => e.startsWith("unknown_license")) &&
      g.errors.some((e) => e.startsWith("unknown_commercial_use")),
  );
}

// Trademark alone does not auto-block when blocksPublication=false and status needs_review still fails on status
{
  const g = evaluateRightsPublicationGate(
    baseManifest({
      reviewStatus: "cleared",
      openIssues: [
        {
          id: "tm",
          category: "trademark_review",
          blocksPublication: false,
          resolved: false,
        },
      ],
      thirdPartySources: [],
    }),
  );
  // unresolved non-blocking trademark still trips cleared_with_unresolved
  check(
    "trademark unresolved still blocks cleared",
    !g.ok && g.errors.some((e) => e.startsWith("cleared_with_unresolved")),
  );
  const g2 = evaluateRightsPublicationGate(
    baseManifest({
      reviewStatus: "cleared",
      openIssues: [
        {
          id: "tm",
          category: "trademark_review",
          blocksPublication: false,
          resolved: true,
        },
      ],
    }),
  );
  check("trademark resolved allows cleared", g2.ok, g2.errors.join(","));
}

// Scanner on mini fixture
{
  const dir = mkdtempSync(join(tmpdir(), "rights-scan-"));
  writeFileSync(
    join(dir, "ap-c_sources.md"),
    `# sources\n| ID | 제목 | 발행기관 | URL |\n|---|---|---|---|\n| SRC01 | Test | Org | https://example.com/a |\n`,
  );
  writeFileSync(
    join(dir, "ch-01_body.md"),
    `# ch\nSee SRC01 and ChatGPT. 「${"가".repeat(90)}」\n`,
  );
  const scan = scanManuscriptRights(dir, { author: "SotongWare" });
  check("scan finds source", scan.thirdPartySources.length === 1);
  check("scan finds trademark review candidate", scan.trademarks.some((t) => t.trademarkId === "chatgpt"));
  check("scan finds quote suspect", scan.quoteSuspects.length >= 1);
  const man = buildRightsManifest({
    registration: {
      slug: "mini",
      instructionId: "wi_x",
      finalRevision: 2,
      author: { ko: "SotongWare" },
    },
    scan,
  });
  check("auto manifest never cleared", man.reviewStatus === "needs_review");
  const gate = evaluateRightsPublicationGate(man);
  check("auto manifest publication FAIL", !gate.ok);
  rmSync(dir, { recursive: true, force: true });
}

// I public leakage
{
  const catalog = join(
    repoRoot,
    "src",
    "data",
    "service-catalog",
    "generated",
    "ai-first-ebook-for-50s.catalog.ts",
  );
  if (existsSync(catalog)) {
    const ts = readFileSync(catalog, "utf8");
    let leak = false;
    try {
      assertNoRightsLeakInPublicText(ts);
    } catch {
      leak = true;
    }
    // instructionId must not appear in public catalog — our assert includes wi_plan; catalog must not have it
    check("I rights metadata public leakage 0", !leak && !ts.includes("openIssues") && !ts.includes("reviewStatus"));
  } else {
    check("I public catalog present", false);
  }

  const reader = readFileSync(
    join(repoRoot, "src", "components", "ebook", "EbookReaderClient.tsx"),
    "utf8",
  );
  check("I reader has no rights gate fields", !reader.includes("openIssues") && !reader.includes("reviewStatus"));
}

// Golden record (after run-scan)
{
  const record = join(__dirname, "records", "ai-first-ebook-for-50s.r2.rights.json");
  if (existsSync(record)) {
    const man = JSON.parse(readFileSync(record, "utf8"));
    check("Golden record reviewStatus needs_review", man.reviewStatus === "needs_review");
    check("Golden sources >= 1", (man.thirdPartySources || []).length >= 1);
    check("Golden openIssues present", (man.openIssues || []).length >= 1);
    check("Golden publication gate FAIL", man.gate && man.gate.ok === false);
    check("Golden no absolute Users path", !JSON.stringify(man).includes("C:\\\\Users") && !JSON.stringify(man).includes("C:/Users"));
  } else {
    check("Golden rights record present", false, "run ebook:rights:scan first");
  }
}

console.log(failed === 0 ? "\nRIGHTS GATE ALL PASS" : `\nFAILED=${failed}`);
process.exit(failed === 0 ? 0 : 1);
