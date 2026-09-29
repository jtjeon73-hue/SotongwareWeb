/**
 * Ebook publishing-rights risk scanner (evidence collector).
 * Does NOT declare "no infringement" — only gathers review candidates.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const URL_RE = /https?:\/\/[^\s)\]|>"']+/gi;
const SRC_RE = /\bSRC(\d{2})\b/g;
const MD_IMAGE_RE = /!\[[^\]]*\]\(([^)]+)\)/g;
const BLOCKQUOTE_RE = /^>\s+.+/gm;
const LONG_QUOTE_RE = /[「『“"]([^」』”"]{80,})[」』”"]/g;

/** Descriptive trademark / product mentions — review, not auto-block. */
const TRADEMARK_PATTERNS = [
  { id: "chatgpt", re: /\bChatGPT\b/gi, label: "ChatGPT" },
  { id: "openai", re: /\bOpenAI\b/gi, label: "OpenAI" },
  { id: "gemini", re: /\bGemini\b/gi, label: "Gemini" },
  { id: "claude", re: /\bClaude\b/gi, label: "Claude" },
  { id: "canva", re: /Canva|캔바/gi, label: "Canva/캔바" },
  { id: "kindle", re: /\bKindle\b|킨들/gi, label: "Kindle" },
  { id: "adobe", re: /\bAdobe\b|어도비/gi, label: "Adobe" },
  { id: "microsoft", re: /\bMicrosoft\b|워드|PowerPoint|엑셀/gi, label: "Microsoft/오피스 계열" },
  { id: "google", re: /구글\s*문서|Google\s*Docs|Google\s*Drive/gi, label: "Google Docs/Drive" },
  { id: "w3c", re: /\bW3C\b/g, label: "W3C" },
  { id: "brunch", re: /브런치/g, label: "브런치" },
  { id: "epub", re: /\bEPUB\b/g, label: "EPUB" },
];

const AI_ASSIST_RE =
  /생성형\s*AI|AI\s*초안|AI\s*보조|AI로|ChatGPT|Gemini|Claude|인공지능\s*서비스/gi;

function chapterIdFromFile(name) {
  const m = name.match(/^([a-z0-9-]+)(?:_|\.)/i);
  return m ? m[1] : name.replace(/\.md$/i, "");
}

function parseSourcesTable(markdown) {
  const sources = [];
  for (const line of markdown.split(/\r?\n/)) {
    const m = line.match(
      /^\|\s*(SRC\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(https?:\/\/[^|\s]+)\s*\|/i,
    );
    if (!m) continue;
    sources.push({
      id: m[1].trim(),
      title: m[2].trim(),
      publisher: m[3].trim(),
      url: m[4].trim(),
      attributionPresent: true,
      licenseStatus: "unknown",
      commercialUseStatus: "unknown",
      notes: "Listed in sources appendix; license/commercial reuse not auto-verified",
    });
  }
  return sources;
}

function countTables(markdown) {
  const lines = markdown.split(/\r?\n/).filter((l) => /^\|/.test(l.trim()));
  // Rough table count: groups of pipe rows
  let tables = 0;
  let inTable = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\|/.test(line.trim())) {
      if (!inTable) {
        tables++;
        inTable = true;
      }
    } else {
      inTable = false;
    }
  }
  return { tableRowHits: lines.length, tableBlocksApprox: tables };
}

/**
 * Scan a Golden R2 manuscript directory (READ-ONLY).
 */
export function scanManuscriptRights(manuscriptDir, meta = {}) {
  if (!existsSync(manuscriptDir)) {
    throw new Error(`manuscript_dir_missing:${manuscriptDir}`);
  }

  const files = readdirSync(manuscriptDir).filter((f) => f.endsWith(".md"));
  const citations = [];
  const urls = [];
  const images = [];
  const screenshots = [];
  const logos = [];
  const trademarks = [];
  const codeBlocks = [];
  const quoteSuspects = [];
  const aiMentions = [];
  const tableStats = { filesWithTables: [], totalBlocksApprox: 0 };
  let sourcesFromAppendix = [];

  for (const file of files) {
    const full = join(manuscriptDir, file);
    const text = readFileSync(full, "utf8");
    const chapterId = chapterIdFromFile(file);

    if (file.startsWith("ap-c") || /sources/i.test(file)) {
      sourcesFromAppendix = parseSourcesTable(text);
    }

    let m;
    URL_RE.lastIndex = 0;
    while ((m = URL_RE.exec(text))) {
      urls.push({ chapterId, file, url: m[0], attributedViaSrc: /SRC\d+/i.test(text) });
    }

    SRC_RE.lastIndex = 0;
    while ((m = SRC_RE.exec(text))) {
      citations.push({
        chapterId,
        file,
        srcId: `SRC${m[1]}`,
        contextSnippet: text.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, " "),
      });
    }

    MD_IMAGE_RE.lastIndex = 0;
    while ((m = MD_IMAGE_RE.exec(text))) {
      images.push({ chapterId, file, src: m[1], kind: "markdown_image" });
    }

    if (/스크린샷|screenshot/i.test(text)) {
      screenshots.push({ chapterId, file, note: "screenshot keyword" });
    }
    if (/로고|logo\b/i.test(text) && !/체크리스트|실습/.test(text.slice(0, 200))) {
      logos.push({ chapterId, file, note: "logo keyword (may be instructional)" });
    }

    for (const tm of TRADEMARK_PATTERNS) {
      tm.re.lastIndex = 0;
      if (tm.re.test(text)) {
        trademarks.push({ chapterId, file, trademarkId: tm.id, label: tm.label, disposition: "review" });
      }
    }

    if (/```/.test(text)) {
      codeBlocks.push({ chapterId, file, note: "fenced code block present" });
    }

    LONG_QUOTE_RE.lastIndex = 0;
    while ((m = LONG_QUOTE_RE.exec(text))) {
      quoteSuspects.push({
        chapterId,
        file,
        length: m[1].length,
        snippet: m[1].slice(0, 120),
        disposition: "review_unattributed_substantial_quote_suspect",
      });
    }

    BLOCKQUOTE_RE.lastIndex = 0;
    const bqs = text.match(BLOCKQUOTE_RE) || [];
    for (const b of bqs) {
      if (b.length > 100) {
        quoteSuspects.push({
          chapterId,
          file,
          length: b.length,
          snippet: b.slice(0, 120),
          disposition: "review_blockquote",
        });
      }
    }

    AI_ASSIST_RE.lastIndex = 0;
    if (AI_ASSIST_RE.test(text)) {
      aiMentions.push({ chapterId, file });
    }

    const ts = countTables(text);
    if (ts.tableBlocksApprox > 0) {
      tableStats.filesWithTables.push({ chapterId, file, blocks: ts.tableBlocksApprox });
      tableStats.totalBlocksApprox += ts.tableBlocksApprox;
    }
  }

  // Deduplicate trademarks by id+chapter
  const tmKey = new Set();
  const trademarksDedup = [];
  for (const t of trademarks) {
    const k = `${t.trademarkId}:${t.chapterId}`;
    if (tmKey.has(k)) continue;
    tmKey.add(k);
    trademarksDedup.push(t);
  }

  const openIssues = [];

  for (const s of sourcesFromAppendix) {
    openIssues.push({
      id: `license_unknown_${s.id}`,
      severity: "high",
      category: "license_unknown",
      summary: `${s.id} (${s.publisher}) — commercial reuse / license not verified by automated scan`,
      evidenceRefs: [s.id, s.url],
      blocksPublication: true,
    });
  }

  if (images.length) {
    openIssues.push({
      id: "third_party_images",
      severity: "high",
      category: "unresolved_third_party_asset",
      summary: "Markdown images detected — license/attribution required before publication",
      evidenceRefs: images.map((i) => `${i.chapterId}:${i.src}`),
      blocksPublication: true,
    });
  }

  for (const q of quoteSuspects.slice(0, 20)) {
    openIssues.push({
      id: `quote_suspect_${q.chapterId}_${quoteSuspects.indexOf(q)}`,
      severity: "medium",
      category: "unattributed_substantial_quotation_suspect",
      summary: `Long quoted span in ${q.chapterId} — human must confirm originality or attribution`,
      evidenceRefs: [q.file],
      blocksPublication: true,
    });
  }

  if (trademarksDedup.length) {
    openIssues.push({
      id: "trademark_mentions_review",
      severity: "low",
      category: "trademark_review",
      summary:
        "Product/service names detected — descriptive use likely OK but human must confirm no logo misuse or endorsement claims",
      evidenceRefs: [...new Set(trademarksDedup.map((t) => t.label))],
      blocksPublication: false, // review only — not auto-block alone
    });
  }

  openIssues.push({
    id: "author_rights_confirmation",
    severity: "high",
    category: "rights_holder_unconfirmed",
    summary: "Author/publisher commercial distribution rights must be human-confirmed",
    evidenceRefs: [meta.author || "unknown"],
    blocksPublication: true,
  });

  openIssues.push({
    id: "ai_provenance_human_review",
    severity: "medium",
    category: "ai_provenance",
    summary:
      "AI-assisted production indicated — record human editorial contribution; do not auto-clear commercial rights",
    evidenceRefs: aiMentions.slice(0, 10).map((a) => a.chapterId),
    blocksPublication: true,
  });

  if (!sourcesFromAppendix.length) {
    openIssues.push({
      id: "source_appendix_missing",
      severity: "high",
      category: "source_unknown",
      summary: "No structured sources appendix parsed — external reuse risks unknown",
      evidenceRefs: [],
      blocksPublication: true,
    });
  }

  return {
    scannedAt: new Date().toISOString(),
    manuscriptDirNote: "path omitted from customer-facing artifacts",
    fileCount: files.length,
    thirdPartySources: sourcesFromAppendix,
    citations,
    urls: urls.slice(0, 200),
    assets: {
      images,
      screenshots,
      logos,
      tables: tableStats,
      codeExamples: codeBlocks,
    },
    trademarks: trademarksDedup,
    quoteSuspects,
    aiMentions,
    openIssues,
  };
}
