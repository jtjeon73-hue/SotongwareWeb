/**
 * Reader UX + safe Markdown regression tests (no deploy / no Firebase mutation).
 */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
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

// --- Load pure markdown parser via Node strip-types ---
const parseModPath = join(repoRoot, "src", "lib", "ebook-reader-markdown.ts").replace(/\\/g, "/");
const parseLoad = spawnSync(
  process.execPath,
  [
    "--experimental-strip-types",
    "--input-type=module",
    "-e",
    `
import {
  parseInlineMarkdown,
  parseEbookParagraph,
  inlineContainsAngleTag,
} from 'file:///${parseModPath}';
const cases = {
  bold: parseInlineMarkdown('안녕 **독자 한 명** 예시'),
  boldBlock: parseEbookParagraph('**독자 문제 1문장**'),
  ul: parseEbookParagraph('- **저녁 20분:** a\\n- **주말 40분:** b'),
  ol: parseEbookParagraph('1. 첫\\n2. 둘'),
  check: parseEbookParagraph('- [ ] 준비\\n- [x] 완료'),
  xss: parseEbookParagraph('<script>alert(1)</script> **ok** <img onerror=x>'),
  jsLink: parseEbookParagraph('[x](javascript:alert(1))'),
};
console.log(JSON.stringify({
  boldTypes: cases.bold.map(s => s.type),
  boldValues: cases.bold.map(s => s.value),
  boldBlock: cases.boldBlock,
  ul: cases.ul,
  ol: cases.ol,
  check: cases.check,
  xss: cases.xss,
  xssHasAngle: cases.xss.type === 'paragraph' && inlineContainsAngleTag(cases.xss.segments),
  jsLink: cases.jsLink,
}));
`,
  ],
  { encoding: "utf8", cwd: repoRoot },
);
if (parseLoad.status !== 0) {
  console.error(parseLoad.stderr || parseLoad.stdout);
  check("markdown parser load", false);
} else {
  const data = JSON.parse(parseLoad.stdout.trim());
  check(
    "markdown bold segments",
    data.boldTypes.join(",") === "text,bold,text" && data.boldValues[1] === "독자 한 명",
  );
  check(
    "markdown bold-only paragraph",
    data.boldBlock.type === "paragraph" &&
      data.boldBlock.segments.some((s) => s.type === "bold" && s.value === "독자 문제 1문장"),
  );
  check("markdown ul block", data.ul.type === "ul" && data.ul.items.length === 2);
  check("markdown ol block", data.ol.type === "ol" && data.ol.items.length === 2);
  check(
    "markdown checklist",
    data.check.type === "ul" &&
      data.check.items[0].kind === "check" &&
      data.check.items[1].kind === "checked",
  );
  check(
    "markdown XSS kept as text nodes (no HTML exec path)",
    data.xss.type === "paragraph" &&
      data.xssHasAngle === true &&
      data.xss.segments.some((s) => s.type === "bold" && s.value === "ok"),
  );
  check(
    "markdown javascript link not parsed as URL",
    data.jsLink.type === "paragraph" &&
      data.jsLink.segments.every((s) => s.type === "text") &&
      data.jsLink.segments.some((s) => s.value.includes("javascript:")),
  );
}

// --- Source contracts: Reader UX + markdown wiring ---
{
  const reader = readFileSync(
    join(repoRoot, "src", "components", "ebook", "EbookReaderClient.tsx"),
    "utf8",
  );
  const mdComp = readFileSync(
    join(repoRoot, "src", "components", "ebook", "EbookMarkdownParagraph.tsx"),
    "utf8",
  );
  const mdLib = readFileSync(join(repoRoot, "src", "lib", "ebook-reader-markdown.ts"), "utf8");

  check("reader imports EbookMarkdownParagraph", reader.includes("EbookMarkdownParagraph"));
  check("reader keeps fetchEbookChapterBody", reader.includes("fetchEbookChapterBody"));
  check("reader keeps server entitlement note", reader.includes("서버 이용권") || reader.includes("server entitlement"));
  check("reader mobile chapter bar", reader.includes('data-reader-chrome="mobile-chapter-bar"'));
  check("reader mobile toc overlay", reader.includes('data-reader-chrome="mobile-toc-overlay"'));
  check("reader desktop toc hidden on mobile", reader.includes('data-reader-chrome="desktop-toc"') && reader.includes("hidden") && reader.includes("lg:block"));
  check("reader scroll anchor present", reader.includes('data-reader-anchor="chapter-body-start"'));
  check("reader schedules chapter scroll", reader.includes("scheduleChapterScroll") && reader.includes("window.scrollTo"));
  check("reader closes toc on chapter select", reader.includes("setTocOpen(false)"));
  check("reader overflow-x-hidden on reading pane", reader.includes("overflow-x-hidden"));
  check("reader break-words on long titles", reader.includes("break-words"));
  check("reader A+/A- controls retained", reader.includes("A+") && (reader.includes("A−") || reader.includes("A-")));
  check("md component no dangerouslySetInnerHTML", !/dangerouslySetInnerHTML\s*=/.test(mdComp));
  check("md lib no HTML allowlist / DOMPurify", !mdLib.includes("dangerouslySetInnerHTML") && !mdLib.includes("DOMPurify"));
  check("md component uses React text strong only", mdComp.includes("<strong") && mdComp.includes("seg.value"));
  check("premium panel uses markdown renderer", reader.includes("premium-authorized") && reader.includes("EbookMarkdownParagraph"));
}

// --- Responsive class intent (360 / tablet / desktop breakpoints via Tailwind) ---
{
  const reader = readFileSync(
    join(repoRoot, "src", "components", "ebook", "EbookReaderClient.tsx"),
    "utf8",
  );
  check("responsive mobile toc lg:hidden overlay", reader.includes("lg:hidden") && reader.includes("mobile-toc-overlay"));
  check("responsive desktop grid lg:grid-cols", reader.includes("lg:grid-cols-[240px_minmax(0,1fr)]"));
  check("responsive reading pane min-w-0", reader.includes('data-reader-chrome="reading-pane"') && reader.includes("min-w-0"));
}

// --- Premium body must not appear in public bundle/static output markers ---
{
  const catalog = readFileSync(
    join(repoRoot, "src", "data", "service-catalog", "generated", "ai-first-ebook-for-50s.catalog.ts"),
    "utf8",
  );
  // Free preview may contain ** markers; premium-only phrases should not be inlined as full private bodies.
  // Leakage scan is authoritative; here assert Reader does not embed private package path.
  check(
    "reader does not import private artifact path",
    !readFileSync(join(repoRoot, "src", "components", "ebook", "EbookReaderClient.tsx"), "utf8").includes(
      "artifacts/ebook-private",
    ),
  );
  check(
    "public catalog still has zero pdfUrl",
    !/"pdfUrl"\s*:/.test(catalog) && !/"epubUrl"\s*:/.test(catalog),
  );

  const outDir = join(repoRoot, "out");
  if (existsSync(outDir)) {
    // Sample scan: ensure a known premium-only private marker is not mass-copied (leakage script is primary).
    const privatePath = join(
      repoRoot,
      "artifacts",
      "ebook-private",
      "ai-first-ebook-for-50s",
      "r2",
      "private-content.json",
    );
    if (existsSync(privatePath)) {
      const priv = JSON.parse(readFileSync(privatePath, "utf8"));
      const chapters = priv.chapters || priv.premiumChapters || [];
      let marker = "";
      for (const ch of chapters) {
        const pages = ch.pages || [];
        for (const page of pages) {
          for (const para of page.paragraphs || []) {
            const ko = typeof para === "string" ? para : para.ko || "";
            if (ko.length > 40 && !catalog.includes(ko.slice(0, 40))) {
              marker = ko.slice(0, 48);
              break;
            }
          }
          if (marker) break;
        }
        if (marker) break;
      }
      if (marker) {
        const walk = (dir, hits = []) => {
          for (const name of readdirSync(dir)) {
            const p = join(dir, name);
            const st = statSync(p);
            if (st.isDirectory()) walk(p, hits);
            else if (/\.(html|js|txt|json)$/.test(name)) {
              const t = readFileSync(p, "utf8");
              if (t.includes(marker)) hits.push(p);
            }
          }
          return hits;
        };
        const hits = walk(outDir);
        check("out/ has no private premium marker sample", hits.length === 0, hits[0] || "");
      } else {
        check("out/ private marker sample skipped (no unique marker)", true);
      }
    } else {
      check("out/ private package absent — skip static premium scan", true);
    }
  } else {
    check("out/ absent before build — static premium scan deferred to build step", true);
  }
}

console.log(failed === 0 ? "\nREADER UX ALL PASS" : `\nFAILED=${failed}`);
process.exit(failed === 0 ? 0 : 1);
