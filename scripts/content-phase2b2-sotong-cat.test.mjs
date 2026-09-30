/**
 * Content Phase 2B-2 — Sotong Cat Ep.1 registration contract.
 * Run: node scripts/content-phase2b2-sotong-cat.test.mjs
 */
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  getOrderedComicPanels,
  resolveContentRenderer,
  validateContentLiveGate,
} from "../src/lib/content-publication-gate.mjs";
import {
  SOTONG_CAT_EP01_REQUIRED_FILES,
  SOTONG_CAT_EP01_SLUG,
  sotongCatEp01PanelPublicPath,
  sotongCatEp01PosterPublicPath,
  sotongCatEp01ThumbnailPublicPath,
} from "../src/data/content-assets/sotong-cat-ep01.mjs";

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

const catalogSrc = read("src/data/service-catalog/contents.ts");
const detailSrc = read("src/components/content/ContentDetailView.tsx");
const comicSrc = read("src/components/content/ComicPanelReader.tsx");
const librarySrc = read("src/components/content/ContentLibraryView.tsx");

const missingAssets = SOTONG_CAT_EP01_REQUIRED_FILES.filter(
  (rel) => !existsSync(join(repoRoot, "public", rel)),
);

run("ASSET_STATUS matches filesystem (10 required WebP)", () => {
  if (missingAssets.length > 0) {
    console.log(`  ASSET_STATUS=MISSING_ASSETS count=${missingAssets.length}`);
    assert.fail(`missing assets: ${missingAssets.join(", ")}`);
  }
  assert.equal(missingAssets.length, 0);
  console.log("  ASSET_STATUS=PRESENT");
});

run("catalog slug / series / live publication finalize", () => {
  assert.match(catalogSrc, /SOTONG_CAT_EP01_SLUG/);
  assert.match(catalogSrc, /seriesId: SOTONG_CAT_SERIES_ID/);
  assert.match(catalogSrc, /알람과의 전쟁/);
  assert.match(catalogSrc, /formatId: "comic"/);
  assert.match(catalogSrc, /accessTier: "free"/);
  const epBlock = catalogSrc.slice(
    catalogSrc.indexOf("SOTONG_CAT_EP01_SLUG"),
    catalogSrc.indexOf("comic-motion-teaser"),
  );
  assert.match(epBlock, /status: "live"/);
  assert.match(epBlock, /approvedForPublic: true/);
  assert.match(epBlock, /reviewed: true/);
  assert.match(epBlock, /rightsStatus: "cleared"/);
  assert.match(epBlock, /aiProvenance: "aiAssisted"/);
  assert.match(epBlock, /publishedAt: "2026-09-30"/);
  assert.match(epBlock, /featured: true/);
  assert.match(epBlock, /source: "public_asset"/);
  assert.doesNotMatch(catalogSrc, /sotong-cat-episode-1/);
});

run("eight panels ordered 1..8 in contract paths", () => {
  assert.equal(sotongCatEp01PanelPublicPath(1), "/contents/sotong-cat/ep01/panel-01.webp");
  assert.equal(sotongCatEp01PanelPublicPath(8), "/contents/sotong-cat/ep01/panel-08.webp");
  assert.match(catalogSrc, /sotongCatEp01Panels/);
  assert.match(catalogSrc, /comicPanels: sotongCatEp01Panels\(\)/);
});

run("comic detail reader + preparing preview path", () => {
  assert.match(detailSrc, /ComicPanelReader/);
  assert.match(detailSrc, /isPreviewPersonaEnabled/);
  assert.match(detailSrc, /data-dev-only-preview|preparingComicPreview/);
  assert.match(detailSrc, /data-content-hero-fit="contain"/);
  assert.match(detailSrc, /object-contain/);
  assert.match(comicSrc, /data-content-stage="comic-reader"/);
  assert.match(comicSrc, /data-comic-panel-order/);
  assert.match(comicSrc, /loading=\{index === 0 \? "eager" : "lazy"\}/);
  assert.match(comicSrc, /max-w-md/);
  assert.match(comicSrc, /overflow-x-hidden|min-w-0/);
  assert.doesNotMatch(comicSrc, /Play now|가짜 재생/);
});

run("production hides mock preview bar contract", () => {
  const bar = read("src/components/access/PreviewPersonaBar.tsx");
  const access = read("src/lib/access-tier.ts");
  assert.match(bar, /isPreviewPersonaEnabled/);
  assert.match(bar, /if \(!enabled\) return null/);
  assert.match(access, /NODE_ENV === "production"/);
  assert.match(detailSrc, /allowDevPreview &&/);
});

run("library poster allowed for public_asset preparing preview", () => {
  assert.match(librarySrc, /public_asset/);
  assert.match(librarySrc, /showPoster|Preview · 준비 중/);
});

run("live without media source fails gate", () => {
  const r = validateContentLiveGate({
    slug: SOTONG_CAT_EP01_SLUG,
    status: "live",
    formatId: "comic",
    accessTier: "free",
    title: { ko: "알람과의 전쟁", en: "War with the Alarm" },
    summary: { ko: "요약", en: "Summary" },
    media: {
      kind: "comic",
      source: "none",
      publicSrc: "/contents/sotong-cat/ep01/poster.webp",
      poster: "/contents/sotong-cat/ep01/thumbnail.webp",
      alt: { ko: "a", en: "a" },
    },
    comicPanels: Array.from({ length: 8 }, (_, i) => ({
      order: i + 1,
      src: sotongCatEp01PanelPublicPath(i + 1),
      alt: { ko: "a", en: "a" },
    })),
    publication: {
      rightsStatus: "cleared",
      aiProvenance: "aiAssisted",
      reviewed: true,
      approvedForPublic: true,
    },
  });
  assert.equal(r.ok, false);
});

run("live comic missing panels fails", () => {
  const r = validateContentLiveGate({
    slug: SOTONG_CAT_EP01_SLUG,
    status: "live",
    formatId: "comic",
    accessTier: "free",
    title: { ko: "t", en: "t" },
    summary: { ko: "s", en: "s" },
    media: {
      kind: "comic",
      source: "public_asset",
      publicSrc: "/contents/sotong-cat/ep01/poster.webp",
      poster: "/contents/sotong-cat/ep01/thumbnail.webp",
      alt: { ko: "a", en: "a" },
    },
    comicPanels: [],
    publication: {
      rightsStatus: "cleared",
      aiProvenance: "aiAssisted",
      reviewed: true,
      approvedForPublic: true,
    },
  });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /comicPanels/i.test(e)));
});

run("renderer preparing while other demos preparing; Ep.1 live resolves comic", () => {
  const preparingItem = {
    slug: "signal-light-reaction",
    status: "preparing",
    media: { kind: "game", source: "none", alt: { ko: "a", en: "a" } },
    publication: {
      rightsStatus: "unchecked",
      aiProvenance: "none",
      reviewed: false,
      approvedForPublic: false,
    },
  };
  assert.equal(resolveContentRenderer(preparingItem), "preparing");

  const liveComic = {
    slug: SOTONG_CAT_EP01_SLUG,
    status: "live",
    formatId: "comic",
    accessTier: "free",
    title: { ko: "알람과의 전쟁", en: "War with the Alarm" },
    summary: { ko: "s", en: "s" },
    media: {
      kind: "comic",
      source: "public_asset",
      publicSrc: sotongCatEp01PosterPublicPath(),
      poster: sotongCatEp01ThumbnailPublicPath(),
      alt: { ko: "a", en: "a" },
    },
    comicPanels: Array.from({ length: 8 }, (_, i) => ({
      order: i + 1,
      src: sotongCatEp01PanelPublicPath(i + 1),
      alt: { ko: "a", en: "a" },
    })),
    publication: {
      rightsStatus: "cleared",
      aiProvenance: "aiAssisted",
      reviewed: true,
      approvedForPublic: true,
      publishedAt: "2026-09-30",
    },
  };
  assert.equal(resolveContentRenderer(liveComic), "comic");
  assert.equal(getOrderedComicPanels(liveComic).map((p) => p.order).join(","), "1,2,3,4,5,6,7,8");
  assert.equal(validateContentLiveGate(liveComic).ok, true);
});

run("required file list is complete (10)", () => {
  assert.equal(SOTONG_CAT_EP01_REQUIRED_FILES.length, 10);
  assert.ok(SOTONG_CAT_EP01_REQUIRED_FILES.every((f) => f.startsWith("contents/sotong-cat/ep01/")));
});

run("responsive-risk tokens on comic reader", () => {
  assert.match(comicSrc, /min-w-0/);
  assert.match(comicSrc, /w-full/);
  assert.match(comicSrc, /object-contain/);
});

await runAsync("commerce prices unchanged", async () => {
  const catalog = await import(
    pathToFileURL(join(repoRoot, "src/lib/commerce-policy/catalog.mjs")).href
  );
  assert.equal(catalog.MEMBERSHIP_MONTHLY_PRODUCT.amount, 2000);
  assert.equal(catalog.MEMBERSHIP_YEARLY_PRODUCT.amount, 20000);
  assert.equal(catalog.GOLDEN_EBOOK_PRODUCT.amount, 3000);
});

await runAsync("no shorts video fake entry for ep1", async () => {
  assert.doesNotMatch(catalogSrc, /sotong-cat-alarm-war-ep1-short/);
  assert.doesNotMatch(catalogSrc, /formatId: "shorts"[\s\S]{0,80}알람과의 전쟁/);
});

console.log("\ncontent-phase2b2-sotong-cat tests done");
if (missingAssets.length) {
  console.log("ASSET_STATUS=MISSING_ASSETS");
} else {
  console.log("ASSET_STATUS=PRESENT");
}
