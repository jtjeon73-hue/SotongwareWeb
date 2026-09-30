/**
 * Content Phase 1 — catalog contract, UI IA, live gate, game metadata.
 * Run: node scripts/content-phase1.test.mjs
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  assertCatalogLiveGates,
  formatIdToUiCategory,
  resolveContentRenderer,
  validateContentLiveGate,
} from "../src/lib/content-publication-gate.mjs";

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

async function runAsync(name, fn) {
  try {
    await fn();
    pass(name);
  } catch (e) {
    console.error(`FAIL: ${name}`);
    console.error(e);
    process.exitCode = 1;
  }
}

const typesSrc = read("src/data/service-catalog/types.ts");
const catalogSrc = read("src/data/service-catalog/contents.ts");
const librarySrc = read("src/components/content/ContentLibraryView.tsx");
const detailSrc = read("src/components/content/ContentDetailView.tsx");
const legacySrc = read("src/data/contents.ts");
const gateSrc = read("src/lib/content-publication-gate.mjs");

run("game format exists in ContentFormatId", () => {
  assert.match(typesSrc, /\| "game"/);
  assert.match(catalogSrc, /game: \{ ko: "게임"/);
  assert.match(catalogSrc, /formatId: "game"/);
});

run("UI categories: all/shorts/music/comic/video/image/game", () => {
  assert.match(librarySrc, /data-content-ui-categories="all-shorts-music-comic-video-image-game"/);
  assert.match(catalogSrc, /contentUiCategories/);
  for (const id of ["shorts", "music", "comic", "video", "image", "game"]) {
    assert.match(catalogSrc, new RegExp(`"${id}"`));
  }
  assert.doesNotMatch(librarySrc, /contentFormats\.map/);
  assert.doesNotMatch(librarySrc, /contentFormatLabels\[id\]/);
});

run("comicVideo + video map to UI video", () => {
  assert.equal(formatIdToUiCategory("comicVideo"), "video");
  assert.equal(formatIdToUiCategory("video"), "video");
  assert.equal(formatIdToUiCategory("shorts"), "shorts");
  assert.equal(formatIdToUiCategory("game"), "game");
  assert.equal(formatIdToUiCategory("other"), null);
});

run("placeholder items are not customer-live", () => {
  assert.doesNotMatch(catalogSrc, /status: "live"/);
  assert.match(catalogSrc, /status: "preparing"/);
  assert.match(catalogSrc, /approvedForPublic: false/);
  assert.match(librarySrc, /data-content-empty-live/);
  assert.match(librarySrc, /Preparing · Preview|준비 중 · Preview/);
});

run("live validation: media missing → FAIL", () => {
  const r = validateContentLiveGate({
    slug: "x",
    status: "live",
    formatId: "shorts",
    accessTier: "free",
    title: { ko: "t", en: "t" },
    summary: { ko: "s", en: "s" },
    media: { kind: "shortVideo", source: "none", alt: { ko: "a", en: "a" } },
    publication: {
      rightsStatus: "cleared",
      aiProvenance: "none",
      reviewed: true,
      approvedForPublic: true,
    },
  });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /media/i.test(e)));
});

run("live validation: rights missing → FAIL", () => {
  const r = validateContentLiveGate({
    slug: "x",
    status: "live",
    formatId: "shorts",
    accessTier: "free",
    title: { ko: "t", en: "t" },
    summary: { ko: "s", en: "s" },
    media: {
      kind: "shortVideo",
      source: "public_asset",
      publicSrc: "/contents/x.mp4",
      poster: "/contents/x.jpg",
      alt: { ko: "a", en: "a" },
    },
    publication: {
      rightsStatus: "unchecked",
      aiProvenance: "none",
      reviewed: true,
      approvedForPublic: true,
    },
  });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /rightsStatus/i.test(e)));
});

run("live validation: reviewed false → FAIL", () => {
  const r = validateContentLiveGate({
    slug: "x",
    status: "live",
    formatId: "music",
    accessTier: "free",
    title: { ko: "t", en: "t" },
    summary: { ko: "s", en: "s" },
    media: {
      kind: "audio",
      source: "public_asset",
      publicSrc: "/contents/x.mp3",
      alt: { ko: "a", en: "a" },
    },
    publication: {
      rightsStatus: "cleared",
      aiProvenance: "none",
      reviewed: false,
      approvedForPublic: true,
    },
  });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /reviewed/i.test(e)));
});

run("live validation: approved false → FAIL", () => {
  const r = validateContentLiveGate({
    slug: "x",
    status: "live",
    formatId: "music",
    accessTier: "free",
    title: { ko: "t", en: "t" },
    summary: { ko: "s", en: "s" },
    media: {
      kind: "audio",
      source: "public_asset",
      publicSrc: "/contents/x.mp3",
      alt: { ko: "a", en: "a" },
    },
    publication: {
      rightsStatus: "cleared",
      aiProvenance: "none",
      reviewed: true,
      approvedForPublic: false,
    },
  });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /approvedForPublic/i.test(e)));
});

run("live validation: full gate PASS", () => {
  const r = validateContentLiveGate({
    slug: "ok",
    status: "live",
    formatId: "shorts",
    accessTier: "free",
    title: { ko: "제목", en: "Title" },
    summary: { ko: "요약", en: "Summary" },
    media: {
      kind: "shortVideo",
      source: "public_asset",
      publicSrc: "/contents/ok.mp4",
      poster: "/contents/ok.jpg",
      alt: { ko: "a", en: "a" },
    },
    publication: {
      rightsStatus: "cleared",
      aiProvenance: "aiAssisted",
      reviewed: true,
      approvedForPublic: true,
      publishedAt: "2026-09-30",
    },
  });
  assert.equal(r.ok, true);
});

run("private storage URL rejected on live", () => {
  const r = validateContentLiveGate({
    slug: "bad",
    status: "live",
    formatId: "image",
    accessTier: "free",
    title: { ko: "t", en: "t" },
    summary: { ko: "s", en: "s" },
    media: {
      kind: "image",
      source: "public_asset",
      publicSrc: "https://firebasestorage.googleapis.com/v0/b/x/o/y?token=secret",
      poster: "/contents/x.jpg",
      alt: { ko: "a", en: "a" },
    },
    publication: {
      rightsStatus: "cleared",
      aiProvenance: "none",
      reviewed: true,
      approvedForPublic: true,
    },
  });
  assert.equal(r.ok, false);
});

run("related empty → UI does not render related block", () => {
  assert.match(detailSrc, /if \(!hasRelatedLinks\(item\)\) return null/);
  assert.match(detailSrc, /if \(shown\.length === 0\) return null/);
  assert.doesNotMatch(detailSrc, /data-content-related="false"/);
});

run("game metadata contract", () => {
  assert.match(typesSrc, /ContentGameMeta/);
  assert.match(typesSrc, /guestPlayAllowed/);
  assert.match(typesSrc, /memberRankingFuture/);
  assert.match(catalogSrc, /launchMode: "embedded"/);
  assert.match(catalogSrc, /supportsTouch: true/);
  assert.match(catalogSrc, /guestPlayAllowed: true/);
  assert.match(detailSrc, /data-content-stage="preparing"/);
  assert.doesNotMatch(detailSrc, /Play now|지금 플레이/);
  assert.doesNotMatch(detailSrc, /data-content-stage="play"/);
});

run("renderer resolves preparing without live media", () => {
  const renderer = resolveContentRenderer({
    slug: "p",
    status: "preparing",
    media: { kind: "game", source: "none", alt: { ko: "a", en: "a" } },
    publication: {
      rightsStatus: "unchecked",
      aiProvenance: "none",
      reviewed: false,
      approvedForPublic: false,
    },
  });
  assert.equal(renderer, "preparing");
});

run("responsive-risk: min-w-0 / overflow / touch targets", () => {
  assert.match(librarySrc, /min-w-0/);
  assert.match(librarySrc, /overflow-x-hidden|overflow-hidden/);
  assert.match(librarySrc, /min-h-11/);
  assert.match(detailSrc, /min-w-0/);
  assert.match(detailSrc, /overflow-x-hidden|overflow-hidden/);
  assert.match(detailSrc, /min-h-11/);
});

run("legacy contents.ts deprecated toward service-catalog SSOT", () => {
  assert.match(legacySrc, /@deprecated/);
  assert.match(legacySrc, /service-catalog\/contents/);
  assert.match(legacySrc, /export const contents: SotongProduct\[\] = \[\]/);
  assert.match(legacySrc, /game/);
});

run("media/publication fields on ContentCatalogItem", () => {
  assert.match(typesSrc, /media: ContentMediaMeta/);
  assert.match(typesSrc, /publication: ContentPublicationMeta/);
  assert.match(typesSrc, /related\?: ContentRelatedMeta/);
  assert.match(typesSrc, /aiProvenance/);
  assert.match(gateSrc, /approvedForPublic/);
});

await runAsync("catalog live gates all pass (no false live)", async () => {
  // Parse status fields from source — none should be live
  const liveCount = [...catalogSrc.matchAll(/status: "live"/g)].length;
  assert.equal(liveCount, 0);
  const batch = assertCatalogLiveGates([
    {
      slug: "factory-morning-short",
      status: "preparing",
      media: { kind: "shortVideo", source: "none", alt: { ko: "a", en: "a" } },
      publication: {
        rightsStatus: "unchecked",
        aiProvenance: "none",
        reviewed: false,
        approvedForPublic: false,
      },
    },
  ]);
  assert.equal(batch.ok, true);
});

await runAsync("knowledge phase1 catalog file still present", async () => {
  const k = read("src/data/service-catalog/knowledge.ts");
  assert.match(k, /export const knowledgeSites/);
  assert.match(k, /slug: "plc"/);
});

await runAsync("ebook catalog untouched structurally", async () => {
  const e = read("src/data/service-catalog/ebooks.ts");
  assert.match(e, /export const ebookCatalog|getEbookBySlug/);
});

await runAsync("commerce prices 2000 / 20000 / 3000 unchanged", async () => {
  const catalog = await import(
    pathToFileURL(join(repoRoot, "src/lib/commerce-policy/catalog.mjs")).href
  );
  assert.equal(catalog.MEMBERSHIP_MONTHLY_PRODUCT.amount, 2000);
  assert.equal(catalog.MEMBERSHIP_YEARLY_PRODUCT.amount, 20000);
  assert.equal(catalog.GOLDEN_EBOOK_PRODUCT.amount, 3000);
});

await runAsync("knowledge/ebook routes files unchanged by content phase (exist)", async () => {
  assert.ok(read("src/app/[locale]/knowledge/page.tsx").length > 0);
  assert.ok(read("src/app/[locale]/ebooks/page.tsx").length > 0);
  assert.doesNotMatch(read("src/app/[locale]/knowledge/page.tsx"), /contentCatalog/);
});

console.log("\ncontent-phase1 tests done");
