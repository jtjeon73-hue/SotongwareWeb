/**
 * Scan Next build outputs for leaked premium ebook body markers.
 * Run after: ebook:ingest + next build
 *
 * Usage: node scripts/ebook-private-leakage-scan.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractPremiumLeakMarkers,
  privateArtifactPath,
} from "./ebook-ingest/lib/ingest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const slug = "ai-first-ebook-for-50s";
const finalRevision = 2;

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkFiles(p, out);
    else out.push(p);
  }
  return out;
}

const privPath = privateArtifactPath(repoRoot, slug, finalRevision);
check("private artifact exists", existsSync(privPath), privPath);
if (!existsSync(privPath)) {
  console.error("\nFAILED=private_missing");
  process.exit(1);
}

const privatePackage = JSON.parse(readFileSync(privPath, "utf8"));
const publicCatalogPath = join(
  repoRoot,
  "src",
  "data",
  "service-catalog",
  "generated",
  `${slug}.catalog.ts`,
);
const publicTs = readFileSync(publicCatalogPath, "utf8");
// Prefer markers that do not also appear in free-preview public text (avoid false positives).
const rawMarkers = extractPremiumLeakMarkers(privatePackage, { limit: 80 });
const markers = rawMarkers.filter((m) => !publicTs.includes(m)).slice(0, 40);
check("premium-only markers extracted", markers.length >= 5, String(markers.length));

const leakedInPublicSrc = markers.filter((m) => publicTs.includes(m));
check("A public catalog has zero premium markers", leakedInPublicSrc.length === 0, leakedInPublicSrc[0] || "");

const scanRoots = [
  join(repoRoot, "out"),
  join(repoRoot, ".next", "static"),
];
const scanFiles = scanRoots.flatMap((r) => walkFiles(r));
check("build outputs present for scan", scanFiles.length > 0, String(scanFiles.length));

const hits = [];
for (const file of scanFiles) {
  let text = "";
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const m of markers) {
    if (text.includes(m)) {
      hits.push({ file: relative(repoRoot, file), marker: m.slice(0, 48) });
      break;
    }
  }
}
check("F out/.next/static leakage scan clean", hits.length === 0, hits[0] ? JSON.stringify(hits[0]) : "");

// Free preview markers must still exist in public catalog
const freeIds = ["fm-01", "fm-02", "ch-01"];
const itemMatch = publicTs.match(
  /export const generatedEbookCatalogItem = (\{[\s\S]*\n\}) as EbookCatalogItem;/,
);
const golden = itemMatch ? JSON.parse(itemMatch[1]) : null;
for (const id of freeIds) {
  const ch = golden?.chapters?.find((c) => c.id === id);
  const paras = (ch?.pages || []).reduce((n, p) => n + (p.paragraphs || []).length, 0);
  check(`B free preview body ${id}`, Boolean(ch && paras > 0), String(paras));
}

const premiumPublicBody = (golden?.chapters || [])
  .filter((c) => c.accessTier === "premium")
  .reduce((n, c) => n + (c.pages || []).reduce((m, p) => m + (p.paragraphs || []).length, 0), 0);
check("E premium public body count 0", premiumPublicBody === 0, String(premiumPublicBody));

check("C private premium chapters 15", privatePackage.chapters.length === 15, String(privatePackage.chapters.length));
check(
  "D private has no free chapters",
  privatePackage.chapters.every((c) => c.accessTier === "premium"),
);
check(
  "E private path not under src/public/out",
  !privPath.replace(/\\/g, "/").includes("/src/") &&
    !privPath.replace(/\\/g, "/").includes("/public/") &&
    !privPath.replace(/\\/g, "/").includes("/out/"),
);

check("G no pdfUrl/epubUrl on public item", !/"pdfUrl"|"epubUrl"|"downloadUrl"/.test(publicTs));
check("H no absolute Documents path in public catalog", !/C:\\\\Users|C:\/Users/i.test(publicTs));
check(
  "I no provenance SHA in public catalog TS",
  !/sourcePdfSha256|sourceEpubSha256|generatedProvenance/.test(publicTs),
);

console.log(failed === 0 ? "\nLEAKAGE SCAN ALL PASS" : `\nFAILED=${failed}`);
process.exit(failed === 0 ? 0 : 1);
