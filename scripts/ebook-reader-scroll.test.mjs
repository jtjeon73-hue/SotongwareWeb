/**
 * Mobile Reader chapter-scroll math + source contracts (no browser / no deploy).
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const scrollMod = join(repoRoot, "src", "lib", "ebook-reader-scroll.ts").replace(/\\/g, "/");
const scrollLoad = spawnSync(
  process.execPath,
  [
    "--experimental-strip-types",
    "--input-type=module",
    "-e",
    `
import {
  computeMobileChapterScrollTop,
  isMobileReaderViewportWidth,
} from 'file:///${scrollMod}';
console.log(JSON.stringify({
  mobile390: isMobileReaderViewportWidth(390),
  mobile430: isMobileReaderViewportWidth(430),
  desktop: isMobileReaderViewportWidth(1280),
  boundary: isMobileReaderViewportWidth(1023),
  desktopBoundary: isMobileReaderViewportWidth(1024),
  top: computeMobileChapterScrollTop(1200, 800, 64, 4),
  atTop: computeMobileChapterScrollTop(0, 64, 64, 4),
  clamp: computeMobileChapterScrollTop(0, 10, 64, 4),
}));
`,
  ],
  { encoding: "utf8", cwd: repoRoot },
);

if (scrollLoad.status !== 0) {
  console.error(scrollLoad.stderr || scrollLoad.stdout);
  check("mobile scroll helper load", false);
} else {
  const d = JSON.parse(scrollLoad.stdout.trim());
  check("viewport 390px treated as mobile", d.mobile390 === true);
  check("viewport 430px treated as mobile", d.mobile430 === true);
  check("viewport 1280px treated as desktop", d.desktop === false);
  check("viewport 1023px mobile boundary", d.boundary === true);
  check("viewport 1024px desktop boundary", d.desktopBoundary === false);
  check(
    "mobile scroll offsets sticky bar (390 contract math)",
    d.top === 1200 + 800 - 64 - 4 && d.atTop === 0 && d.clamp === 0,
    `top=${d.top}`,
  );
}

const reader = readFileSync(
  join(repoRoot, "src", "components", "ebook", "EbookReaderClient.tsx"),
  "utf8",
);

check(
  "scroll anchor wraps chapter body",
  reader.includes('data-reader-anchor="chapter-body-start"') &&
    reader.includes("readingFocusRef") &&
    /ref=\{readingFocusRef\}[\s\S]*?data-reader-anchor="chapter-body-start"/.test(reader),
);
check(
  "mobile uses window.scrollTo with sticky offset",
  reader.includes("window.scrollTo") && reader.includes("computeMobileChapterScrollTop"),
);
check("desktop keeps scrollIntoView nearest", reader.includes('block: "nearest"'));
check(
  "chapter scroll waits for toc close",
  reader.includes("if (tocOpen) return") && reader.includes("pendingChapterScrollRef"),
);
check(
  "chapter scroll scheduled after paint",
  reader.includes("requestAnimationFrame") && reader.includes("scheduleChapterScroll"),
);
check(
  "goToIndex closes toc then pending scroll",
  /pendingChapterScrollRef\.current = true;[\s\S]*?setTocOpen\(false\);[\s\S]*?setIndex\(next\)/.test(
    reader,
  ),
);
check("prev/next use goToIndex", (reader.match(/goToIndex\(/g) || []).length >= 2);
check("sticky chapter bar measured via ref", reader.includes("chapterBarRef"));
check("desktop toc layout retained", reader.includes('data-reader-chrome="desktop-toc"') && reader.includes("lg:grid-cols-[240px_minmax(0,1fr)]"));
check("fetchEbookChapterBody retained", reader.includes("fetchEbookChapterBody"));

console.log(failed === 0 ? "\nREADER SCROLL ALL PASS" : `\nFAILED=${failed}`);
process.exit(failed === 0 ? 0 : 1);
