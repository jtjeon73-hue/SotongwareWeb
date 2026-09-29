/**
 * Golden ebook → EbookCatalogItem ingest helpers (Node, offline).
 * Runtime web code must never import absolute Golden workspace paths.
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const INTERNAL_LINE =
  /(instructionid|sha256\s*=|workflowapplied|finalapprovalvalid|ebookproductioncontractversion|stageid\s*:|step\s*\d+|validator|c:\\users\\|ebookprojects\\|output\/\d+|publish\/revisions|approvalgate|ssot:|source:\s*output\/)/i;

export function sha256File(path) {
  const buf = readFileSync(path);
  return createHash("sha256").update(buf).digest("hex");
}

export function localizeWithKoFallback(localized, fieldName) {
  const ko = (localized?.ko || "").trim();
  if (!ko) throw new Error(`missing_ko_${fieldName}`);
  const enRaw = localized?.en;
  if (typeof enRaw === "string" && enRaw.trim()) {
    return { ko, en: enRaw.trim() };
  }
  // Safe fallback: reuse Korean source text. Not an official EN translation.
  return { ko, en: ko };
}

export function parseTocCanonical(markdown) {
  const rows = [];
  for (const line of markdown.split(/\r?\n/)) {
    const m = line.match(
      /^\|\s*(\d+)\s*\|\s*([a-z0-9-]+)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|/i,
    );
    if (!m) continue;
    const id = m[2].trim();
    if (id === "id") continue;
    rows.push({
      order: Number(m[1]),
      id,
      titleKo: m[3].trim(),
      section: (m[4] || "").trim(),
    });
  }
  if (!rows.length) throw new Error("toc_canonical_empty");
  return rows.sort((a, b) => a.order - b.order);
}

function findManuscriptFile(manuscriptDir, chapterId) {
  const files = readdirSync(manuscriptDir).filter((f) => f.endsWith(".md"));
  const exact = files.find((f) => f === `${chapterId}.md`);
  if (exact) return join(manuscriptDir, exact);
  const prefixed = files
    .filter((f) => f.startsWith(`${chapterId}_`) || f.startsWith(`${chapterId}-`))
    .sort();
  if (prefixed.length) return join(manuscriptDir, prefixed[0]);
  throw new Error(`manuscript_missing:${chapterId}`);
}

function tableRowCells(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function isTableSep(line) {
  return /^\|?\s*:?-{3,}.*\|/.test(line.trim());
}

function convertTableBlock(lines) {
  const rows = lines.filter((l) => !isTableSep(l)).map(tableRowCells);
  if (!rows.length) return [];
  const header = rows[0];
  const out = [];
  for (const row of rows.slice(1)) {
    const parts = header.map((h, i) => `${h}: ${row[i] ?? ""}`.trim());
    out.push(parts.join(" · "));
  }
  if (out.length === 0 && header.length) out.push(header.join(" · "));
  return out;
}

function stripOpsNoise(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => !INTERNAL_LINE.test(line))
    .join("\n");
}

/**
 * Convert a chapter markdown body into Reader pages (## sections) and paragraphs.
 */
export function markdownToPages(markdown, { dropFirstH1 = true } = {}) {
  let body = stripOpsNoise(markdown).replace(/\uFEFF/g, "");
  const lines = body.split(/\r?\n/);
  if (dropFirstH1 && lines[0] && /^#\s+/.test(lines[0])) {
    lines.shift();
    while (lines[0] !== undefined && lines[0].trim() === "") lines.shift();
  }

  const sections = [];
  let current = { heading: "", lines: [] };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s+/.test(line)) {
      if (current.heading || current.lines.some((l) => l.trim())) sections.push(current);
      current = { heading: line.replace(/^##\s+/, "").trim(), lines: [] };
      continue;
    }
    current.lines.push(line);
  }
  if (current.heading || current.lines.some((l) => l.trim())) sections.push(current);
  if (!sections.length) sections.push({ heading: "", lines });

  const pages = [];
  for (const sec of sections) {
    const paragraphs = [];
    if (sec.heading) paragraphs.push(sec.heading);

    let i = 0;
    const L = sec.lines;
    while (i < L.length) {
      const line = L[i];
      if (!line.trim()) {
        i++;
        continue;
      }
      if (line.trim().startsWith("|")) {
        const block = [];
        while (i < L.length && L[i].trim().startsWith("|")) {
          block.push(L[i]);
          i++;
        }
        for (const t of convertTableBlock(block)) {
          if (t && !INTERNAL_LINE.test(t)) paragraphs.push(t);
        }
        continue;
      }
      if (/^[-*+]\s+/.test(line.trim()) || /^\d+\.\s+/.test(line.trim())) {
        const items = [];
        while (
          i < L.length &&
          ( /^[-*+]\s+/.test(L[i].trim()) || /^\d+\.\s+/.test(L[i].trim()) )
        ) {
          items.push(L[i].trim());
          i++;
        }
        paragraphs.push(items.join("\n"));
        continue;
      }
      if (line.trim().startsWith(">")) {
        const quote = [];
        while (i < L.length && L[i].trim().startsWith(">")) {
          quote.push(L[i].replace(/^>\s?/, "").trim());
          i++;
        }
        const q = quote.join(" ").trim();
        if (q && !INTERNAL_LINE.test(q)) paragraphs.push(q);
        continue;
      }
      // paragraph until blank
      const buf = [];
      while (i < L.length && L[i].trim() && !L[i].trim().startsWith("|") && !/^##\s+/.test(L[i])) {
        if (/^[-*+]\s+/.test(L[i].trim()) || /^\d+\.\s+/.test(L[i].trim()) || L[i].trim().startsWith(">")) break;
        buf.push(L[i].trim());
        i++;
      }
      const para = buf.join(" ").replace(/\s+/g, " ").trim();
      if (para && !INTERNAL_LINE.test(para)) paragraphs.push(para);
    }

    const cleaned = paragraphs.filter(Boolean);
    if (cleaned.length) {
      pages.push({
        paragraphs: cleaned.map((ko) => ({ ko, en: ko })),
      });
    }
  }
  if (!pages.length) {
    pages.push({
      paragraphs: [{ ko: "(본문 없음)", en: "(본문 없음)" }],
    });
  }
  return pages;
}

export function resolveChapterAccess(reg, chapterId) {
  const byId = reg.chapterAccess?.byId || {};
  if (byId[chapterId]) return byId[chapterId];
  return reg.chapterAccess?.default || reg.accessTier || "member";
}

export function loadIngestState(workspaceRoot, instructionId) {
  const docsRoot = join(workspaceRoot, "..", "..");
  const candidates = [
    join(workspaceRoot, "ingest_evidence.json"),
    join(docsRoot, "State", `wi_${instructionId}.ebook.json`),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return JSON.parse(readFileSync(p, "utf8"));
  }
  return null;
}

export function validateGoldenEvidence(workspaceRoot, reg) {
  const errors = [];
  const root = workspaceRoot;
  const rev = Number(reg.finalRevision);

  if (reg.requireAuthoritativeR2 !== false && rev !== 2) {
    errors.push("r1_selected");
  }

  const state = loadIngestState(root, reg.instructionId);
  if (!state) {
    errors.push("state_missing");
  } else {
    const finalRevision = Number(state.finalRevision || 0);
    if (finalRevision !== rev) errors.push(`finalRevision_mismatch:${finalRevision}`);

    if (typeof state.completedCount === "number") {
      if (state.completedCount !== 18) errors.push(`stages_incomplete:${state.completedCount}/18`);
    } else {
      const stages = state.stages || [];
      const applicable = stages.filter((s) => s.applicable !== false);
      const completed = applicable.filter((s) => s.status === "completed").length;
      if (applicable.length < 18 || completed !== applicable.length) {
        errors.push(`stages_incomplete:${completed}/${applicable.length}`);
      }
    }

    const userApproved =
      state.approval?.userApproved === true || state.userFinalApproval === true;
    if (!userApproved) errors.push("userFinalApproval_missing");
  }

  const pkgPath = join(root, "output", "18_publication_package_result.md");
  let releaseReady = false;
  if (existsSync(pkgPath)) {
    const pkg = readFileSync(pkgPath, "utf8").toLowerCase();
    releaseReady = pkg.includes("release_ready") && !pkg.includes("release_ready=false");
    if (/release_ready\s*:\s*false/i.test(pkg)) releaseReady = false;
  } else if (state?.releaseReady === true || state?.release_ready === true) {
    releaseReady = true;
  }
  if (!releaseReady) errors.push("release_ready_false");

  const grantCandidates = [
    join(root, "output", `17_final_user_approval_result_r${rev}.md`),
    join(root, "output", "17_final_user_approval_result.md"),
  ];
  let grantOk = state?.userFinalApproval === true;
  for (const gp of grantCandidates) {
    if (!existsSync(gp)) continue;
    const g = readFileSync(gp, "utf8");
    if (/userFinalApproval\s*:\s*true/i.test(g)) {
      grantOk = true;
      break;
    }
  }
  if (!grantOk) errors.push("final_approval_grant_missing");

  const pdfPath = join(root, "publish", "revisions", `r${rev}`, "book.pdf");
  const epubPath = join(root, "publish", "revisions", `r${rev}`, "book.epub");
  let pdfSha = "";
  let epubSha = "";
  if (!existsSync(pdfPath) || !existsSync(epubPath)) {
    errors.push("immutable_revision_assets_missing");
  } else {
    pdfSha = sha256File(pdfPath);
    epubSha = sha256File(epubPath);
    if (pdfSha !== reg.expectedPdfSha256) errors.push("pdf_sha_mismatch");
    if (epubSha !== reg.expectedEpubSha256) errors.push("epub_sha_mismatch");
  }

  return { ok: errors.length === 0, errors, pdfSha, epubSha };
}

const ALLOWED_CHAPTER_TIERS = new Set(["free", "premium"]);

function countParagraphs(chapters) {
  return chapters.reduce(
    (n, ch) => n + (ch.pages || []).reduce((m, p) => m + (p.paragraphs || []).length, 0),
    0,
  );
}

function countPages(chapters) {
  return chapters.reduce((n, ch) => n + (ch.pages || []).length, 0);
}

/**
 * Fail-closed public/private split.
 * Public may embed free preview pages only; premium chapters keep metadata, pages=[].
 */
export function splitPublicPrivateCatalog(fullChapters, reg, provenance) {
  if (!reg.chapterAccess || !reg.chapterAccess.default) {
    throw new Error("chapterAccess_missing");
  }

  const publicChapters = [];
  const privateChapters = [];
  const errors = [];

  for (const ch of fullChapters) {
    if (!ALLOWED_CHAPTER_TIERS.has(ch.accessTier)) {
      errors.push(`unsupported_chapter_access:${ch.id}:${ch.accessTier}`);
      continue;
    }
    if (!Array.isArray(ch.pages) || ch.pages.length === 0) {
      errors.push(`chapter_body_empty:${ch.id}`);
      continue;
    }

    if (ch.accessTier === "free") {
      publicChapters.push({
        id: ch.id,
        title: ch.title,
        accessTier: "free",
        pages: ch.pages,
      });
    } else {
      publicChapters.push({
        id: ch.id,
        title: ch.title,
        accessTier: "premium",
        pages: [],
      });
      privateChapters.push({
        id: ch.id,
        title: ch.title,
        accessTier: "premium",
        pages: ch.pages,
      });
    }
  }

  if (errors.length) {
    const err = new Error(`split_fail:${errors.join(",")}`);
    err.errors = errors;
    throw err;
  }

  if (publicChapters.length !== fullChapters.length) {
    throw new Error("split_fail:public_chapter_count_mismatch");
  }

  const publicPremiumWithBody = publicChapters.filter(
    (ch) => ch.accessTier === "premium" && countParagraphs([ch]) > 0,
  );
  if (publicPremiumWithBody.length) {
    throw new Error(
      `split_fail:premium_body_in_public:${publicPremiumWithBody.map((c) => c.id).join(",")}`,
    );
  }

  const freePublic = publicChapters.filter((ch) => ch.accessTier === "free");
  if (freePublic.some((ch) => countParagraphs([ch]) === 0)) {
    throw new Error("split_fail:free_preview_body_missing");
  }

  const freeInPrivate = privateChapters.filter((ch) => ch.accessTier === "free");
  if (freeInPrivate.length) {
    throw new Error(`split_fail:free_in_private:${freeInPrivate.map((c) => c.id).join(",")}`);
  }

  const expectedPremium = fullChapters.filter((ch) => ch.accessTier === "premium").length;
  if (privateChapters.length !== expectedPremium) {
    throw new Error(
      `split_fail:private_premium_count:${privateChapters.length}!=${expectedPremium}`,
    );
  }

  if (expectedPremium > 0 && countParagraphs(privateChapters) === 0) {
    throw new Error("split_fail:private_body_empty");
  }

  const privatePackage = {
    schemaVersion: 1,
    productId: reg.slug,
    slug: reg.slug,
    finalRevision: Number(reg.finalRevision),
    accessTier: reg.accessTier,
    chapters: privateChapters,
    provenance: {
      instructionId: provenance.instructionId,
      finalRevision: provenance.finalRevision,
      sourcePdfSha256: provenance.sourcePdfSha256,
      sourceEpubSha256: provenance.sourceEpubSha256,
      generatedAt: provenance.generatedAt,
    },
    stats: {
      chapterCount: privateChapters.length,
      pageCount: countPages(privateChapters),
      paragraphCount: countParagraphs(privateChapters),
    },
  };

  return { publicChapters, privatePackage };
}

/** Non-public build artifact root — must never be under src/public/out. */
export function privateArtifactDir(repoRoot, slug, finalRevision) {
  return join(repoRoot, "artifacts", "ebook-private", slug, `r${Number(finalRevision)}`);
}

export function privateArtifactPath(repoRoot, slug, finalRevision) {
  return join(privateArtifactDir(repoRoot, slug, finalRevision), "private-content.json");
}

export function assertPrivateArtifactLocation(repoRoot, absolutePath) {
  const norm = absolutePath.replace(/\\/g, "/").toLowerCase();
  const root = repoRoot.replace(/\\/g, "/").toLowerCase();
  if (!norm.startsWith(root + "/artifacts/ebook-private/")) {
    throw new Error("private_artifact_outside_allowed_root");
  }
  if (
    norm.includes("/src/") ||
    norm.includes("/public/") ||
    norm.includes("/out/") ||
    norm.includes("/.next/")
  ) {
    throw new Error("private_artifact_in_public_tree");
  }
}

export function buildEbookCatalogItem(workspaceRoot, reg, { generatedAt } = {}) {
  const evidence = validateGoldenEvidence(workspaceRoot, reg);
  if (!evidence.ok) {
    const err = new Error(`ingest_fail:${evidence.errors.join(",")}`);
    err.errors = evidence.errors;
    throw err;
  }

  const rev = Number(reg.finalRevision);
  const manuscriptDir = join(workspaceRoot, "publish", "revisions", `r${rev}`, "manuscript");
  if (!existsSync(manuscriptDir)) throw new Error("manuscript_dir_missing");

  const tocMd = readFileSync(join(manuscriptDir, "toc_canonical.md"), "utf8");
  const tocRows = parseTocCanonical(tocMd);

  const title = localizeWithKoFallback(reg.title, "title");
  const summary = localizeWithKoFallback(reg.summary, "summary");
  const category = localizeWithKoFallback(reg.category, "category");
  const author = localizeWithKoFallback(reg.author, "author");
  const priceNote = localizeWithKoFallback(reg.priceNote, "priceNote");

  const toc = [];
  const fullChapters = [];
  for (const row of tocRows) {
    const accessTier = resolveChapterAccess(reg, row.id);
    if (!ALLOWED_CHAPTER_TIERS.has(accessTier)) {
      throw new Error(`unsupported_chapter_access:${row.id}:${accessTier}`);
    }
    const titleLoc = { ko: row.titleKo, en: row.titleKo };
    toc.push({ id: row.id, title: titleLoc, accessTier });
    const file = findManuscriptFile(manuscriptDir, row.id);
    const md = readFileSync(file, "utf8");
    const pages = markdownToPages(md);
    fullChapters.push({
      id: row.id,
      title: titleLoc,
      accessTier,
      pages,
    });
  }

  const provenance = {
    instructionId: reg.instructionId,
    finalRevision: rev,
    sourcePdfSha256: evidence.pdfSha,
    sourceEpubSha256: evidence.epubSha,
    generatedAt: generatedAt || new Date().toISOString(),
    slug: reg.slug,
  };

  const { publicChapters, privatePackage } = splitPublicPrivateCatalog(
    fullChapters,
    reg,
    provenance,
  );

  const item = {
    slug: reg.slug,
    sortOrder: Number(reg.sortOrder ?? 100),
    updatedAt: (generatedAt || new Date().toISOString()).slice(0, 10),
    featured: Boolean(reg.featured),
    title,
    summary,
    category,
    accessTier: reg.accessTier,
    status: reg.status,
    author,
    coverTone: reg.coverTone || "amber",
    priceNote,
    toc,
    chapters: publicChapters,
  };

  return {
    item,
    privatePackage,
    provenance,
    tocCount: toc.length,
    chapterCount: publicChapters.length,
    publicPageCount: countPages(publicChapters),
    publicParagraphCount: countParagraphs(publicChapters),
    privateChapterCount: privatePackage.chapters.length,
    privateParagraphCount: privatePackage.stats.paragraphCount,
  };
}

export function assertNoPublicAssetUrls(item) {
  const blob = JSON.stringify(item);
  if (/\.pdf|\.epub|storage\.googleapis|firebasestorage|https?:\/\/[^\s"]+\.(pdf|epub)/i.test(blob)) {
    throw new Error("public_asset_url_detected");
  }
}

export function assertNoPremiumBodyInPublicCatalog(item) {
  for (const ch of item.chapters || []) {
    if (ch.accessTier === "premium" && countParagraphs([ch]) > 0) {
      throw new Error(`premium_body_in_public:${ch.id}`);
    }
  }
}

export function assertNoInternalLeakInReaderBody(item) {
  for (const ch of item.chapters) {
    for (const page of ch.pages || []) {
      for (const p of page.paragraphs || []) {
        const t = `${p.ko}\n${p.en}`;
        if (INTERNAL_LINE.test(t)) throw new Error(`internal_leak:${ch.id}`);
        if (/wi_plan_\d+/i.test(t)) throw new Error(`instruction_leak:${ch.id}`);
      }
    }
  }
}

/** Public catalog TS module — no provenance/SHA embedded (keeps secrets out of Next bundle). */
export function catalogItemToTsModule(item) {
  const json = JSON.stringify(item, null, 2);
  return `/**
 * GENERATED by scripts/ebook-ingest — do not hand-edit.
 * PUBLIC catalog only: free preview bodies + premium metadata (pages=[]).
 * Premium paragraphs live in artifacts/ebook-private (not imported by Next).
 */
import type { EbookCatalogItem } from "../types";

export const generatedEbookCatalogItem = ${json} as EbookCatalogItem;
`;
}

/** Distinctive premium markers for build leakage scans (ko text, length >= 24). */
export function extractPremiumLeakMarkers(privatePackage, { limit = 40 } = {}) {
  const markers = [];
  for (const ch of privatePackage.chapters || []) {
    for (const page of ch.pages || []) {
      for (const p of page.paragraphs || []) {
        const ko = (p.ko || "").trim();
        if (ko.length >= 24) markers.push(ko);
        if (markers.length >= limit) return markers;
      }
    }
  }
  return markers;
}
