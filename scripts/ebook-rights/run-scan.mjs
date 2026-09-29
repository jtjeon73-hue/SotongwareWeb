/**
 * Run publishing-rights scan on Golden R2 manuscript (READ-ONLY).
 *
 * Usage:
 *   node scripts/ebook-rights/run-scan.mjs \
 *     --registration ai-first-ebook-for-50s \
 *     --workspace <EbookProjects/wi_plan_...>
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scanManuscriptRights } from "./lib/scan.mjs";
import {
  buildRightsManifest,
  evaluateRightsPublicationGate,
} from "./lib/gate.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : "";
}

const regId = argValue("--registration") || "ai-first-ebook-for-50s";
const workspace = argValue("--workspace");
if (!workspace) {
  console.error("FAIL: --workspace required (Golden EbookProjects path, READ-ONLY)");
  process.exit(2);
}

const reg = JSON.parse(
  readFileSync(join(__dirname, "..", "ebook-ingest", "registrations", `${regId}.json`), "utf8"),
);
const rev = Number(reg.finalRevision);
const manuscriptDir = join(workspace, "publish", "revisions", `r${rev}`, "manuscript");

if (!existsSync(manuscriptDir)) {
  console.error(`FAIL: manuscript missing: ${manuscriptDir}`);
  process.exit(1);
}

const scan = scanManuscriptRights(manuscriptDir, { author: reg.author?.ko });
const manifest = buildRightsManifest({ registration: reg, scan });
const gate = evaluateRightsPublicationGate(manifest);

const outDir = join(repoRoot, "artifacts", "ebook-rights", reg.slug, `r${rev}`);
mkdirSync(outDir, { recursive: true });

const manifestPath = join(outDir, "publishing-rights.manifest.json");
const evidencePath = join(outDir, "publishing-rights.evidence.json");
const gatePath = join(outDir, "publishing-rights.gate.json");

// Customer-facing safety: strip absolute workspace paths from persisted evidence.
const evidenceSafe = {
  ...scan,
  manuscriptDirNote: "Golden R2 manuscript scanned READ-ONLY; absolute path not stored",
};
delete evidenceSafe.manuscriptDir;

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
writeFileSync(evidencePath, JSON.stringify(evidenceSafe, null, 2) + "\n", "utf8");
writeFileSync(
  gatePath,
  JSON.stringify(
    {
      productId: reg.slug,
      revision: rev,
      reviewStatus: manifest.reviewStatus,
      publicationReady: false,
      gate,
      note: "Automated scan never sets cleared. Human review required.",
    },
    null,
    2,
  ) + "\n",
  "utf8",
);

// Tracked record for repo (no absolute paths, no full paragraph evidence dumps)
const recordsDir = join(__dirname, "records");
mkdirSync(recordsDir, { recursive: true });
const recordPath = join(recordsDir, `${reg.slug}.r${rev}.rights.json`);
writeFileSync(
  recordPath,
  JSON.stringify(
    {
      productId: manifest.productId,
      revision: manifest.revision,
      instructionId: manifest.instructionId,
      author: manifest.author,
      publisher: manifest.publisher,
      aiAssisted: manifest.aiAssisted,
      humanEditorialContribution: manifest.humanEditorialContribution,
      reviewStatus: manifest.reviewStatus,
      reviewedAt: manifest.reviewedAt,
      thirdPartySources: manifest.thirdPartySources,
      trademarks: manifest.trademarks,
      citations: manifest.citations,
      openIssues: manifest.openIssues,
      scanSummary: manifest.scanSummary,
      gate,
      generatedAt: manifest.generatedAt,
    },
    null,
    2,
  ) + "\n",
  "utf8",
);

console.log(
  JSON.stringify(
    {
      ok: true,
      productId: reg.slug,
      revision: rev,
      reviewStatus: manifest.reviewStatus,
      publicationGateOk: gate.ok,
      gateErrors: gate.errors.slice(0, 20),
      sourceCount: manifest.thirdPartySources.length,
      openIssueCount: manifest.openIssues.length,
      blockingIssueCount: manifest.openIssues.filter((i) => i.blocksPublication).length,
      imageCount: manifest.scanSummary.imageCount,
      tableBlocksApprox: manifest.scanSummary.tableBlocksApprox,
      trademarkLabels: [...new Set(manifest.trademarks.map((t) => t.label))],
      recordPath: recordPath.replace(repoRoot + "\\", "").replace(repoRoot + "/", ""),
      artifactDir: outDir.replace(repoRoot + "\\", "").replace(repoRoot + "/", ""),
      goldenMutable: false,
    },
    null,
    2,
  ),
);

process.exit(0);
