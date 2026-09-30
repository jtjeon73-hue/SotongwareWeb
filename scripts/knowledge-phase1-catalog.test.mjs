/**
 * Knowledge Phase 1 catalog contract tests.
 * Run: node scripts/knowledge-phase1-catalog.test.mjs
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(rel) {
  return readFileSync(join(repoRoot, rel), "utf8");
}

function pass(name) {
  console.log(`PASS: ${name}`);
}

function run(name, fn) {
  try {
    fn();
    pass(name);
  } catch (e) {
    console.error(`FAIL: ${name}`);
    console.error(e);
    process.exitCode = 1;
  }
}

const knowledgeSrc = read("src/data/service-catalog/knowledge.ts");
const hubView = read("src/components/knowledge/KnowledgeHubView.tsx");
const siteView = read("src/components/knowledge/KnowledgeSiteView.tsx");
const typesSrc = read("src/data/service-catalog/types.ts");

const PREVIEW6 = [
  "ai-lab-notes",
  "electrical-basics",
  "plc-field-desk",
  "rural-tech-notes",
  "maker-hobby-lab",
  "general-learning-rail",
];

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

const NEW_THEMES = [
  "mobility",
  "finance",
  "language",
  "health",
  "dev",
  "life",
];

run("12 site slug entries in catalog", () => {
  for (const slug of EXPECTED_SLUGS) {
    assert.match(knowledgeSrc, new RegExp(`slug: "${slug}"`));
  }
});

run("unique slugs (12)", () => {
  const slugs = [...knowledgeSrc.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
  const siteSlugs = slugs.filter((s) => !PREVIEW6.includes(s));
  assert.equal(new Set(siteSlugs).size, 12);
});

run("all sites accessTier free", () => {
  const start = knowledgeSrc.indexOf("export const knowledgeSites");
  const end = knowledgeSrc.indexOf("export const knowledgeContents");
  const sitesBlock = knowledgeSrc.slice(start, end);
  const ids = [...sitesBlock.matchAll(/\n    id: "([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, 12);
  for (const id of ids) {
    const chunk = sitesBlock.slice(sitesBlock.indexOf(`id: "${id}"`));
    const end = chunk.indexOf("\n  },");
    const site = chunk.slice(0, end);
    assert.match(site, /accessTier: "free"/);
    assert.doesNotMatch(site, /accessTier: "member"/);
    assert.doesNotMatch(site, /accessTier: "premium"/);
  }
});

run("12 externalUrls on live hubs", () => {
  const urls = [...knowledgeSrc.matchAll(/externalUrl: "(https:[^"]+)"/g)].map((m) => m[1]);
  assert.equal(urls.length, 12);
  assert.equal(new Set(urls).size, 12);
});

run("health/finance YMYL disclaimer types", () => {
  assert.match(knowledgeSrc, /slug: "finance"[\s\S]*?disclaimerType: "ymyl_finance"/);
  assert.match(knowledgeSrc, /slug: "health"[\s\S]*?disclaimerType: "ymyl_health"/);
});

run("preview6 not in site grid slugs", () => {
  for (const old of PREVIEW6) {
    assert.doesNotMatch(knowledgeSrc, new RegExp(`slug: "${old}"`));
  }
});

run("legacy redirect map exists", () => {
  assert.match(knowledgeSrc, /knowledgeLegacySlugRedirects/);
  for (const old of PREVIEW6) {
    assert.match(knowledgeSrc, new RegExp(`"${old}":`));
  }
  assert.match(knowledgeSrc, /"general-learning-rail": "\/knowledge"/);
});

run("theme labels cover new themes", () => {
  for (const t of NEW_THEMES) {
    assert.match(knowledgeSrc, new RegExp(`${t}: \\{`));
  }
});

run("hub cards use detail link not external-later copy", () => {
  assert.doesNotMatch(hubView, /외부 연동 이후/);
  assert.doesNotMatch(hubView, /External site linking later/);
  assert.match(hubView, /Site details|상세 보기/);
});

run("detail view external CTA and YMYL", () => {
  assert.match(siteView, /site\.externalUrl/);
  assert.match(siteView, /target="_blank"/);
  assert.match(siteView, /rel="noopener noreferrer"/);
  assert.match(siteView, /ymylBanner/);
  assert.doesNotMatch(siteView, /ComingSoonCta/);
  assert.doesNotMatch(siteView, /sourceRepo/);
});

run("types export disclaimer + externalUrl", () => {
  assert.match(typesSrc, /KnowledgeDisclaimerType/);
  assert.match(typesSrc, /externalUrl: string/);
});

run("ebook/commerce untouched markers", () => {
  const adapter = read("functions/src/commerce/adapter.ts");
  assert.match(adapter, /export function/);
  assert.doesNotMatch(adapter, /KNOWLEDGE_PHASE1_MUTATED/);
  const ebooks = read("src/data/service-catalog/ebooks.ts");
  assert.match(ebooks, /export const ebookCatalog/);
  assert.doesNotMatch(ebooks, /KNOWLEDGE_PHASE1_MUTATED/);
});

if (process.exitCode) {
  console.error("Some tests failed.");
} else {
  console.log("All knowledge phase 1 catalog tests passed.");
}
