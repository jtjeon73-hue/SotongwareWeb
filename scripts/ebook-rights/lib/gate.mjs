/**
 * Publishing-rights publication gate — fail-closed.
 * Automated scan never grants reviewStatus=cleared.
 */

export const REVIEW_STATUSES = Object.freeze([
  "pending",
  "needs_review",
  "cleared",
  "blocked",
]);

const BLOCKING_CATEGORIES = new Set([
  "source_unknown",
  "license_unknown",
  "commercial_use_unknown",
  "unresolved_third_party_asset",
  "unattributed_substantial_quotation_suspect",
  "rights_holder_unconfirmed",
  "ai_provenance",
]);

/**
 * Evaluate whether an ebook may proceed to publication-ready.
 * @returns {{ ok: boolean, errors: string[], warnings: string[] }}
 */
export function evaluateRightsPublicationGate(manifest) {
  const errors = [];
  const warnings = [];

  if (!manifest || typeof manifest !== "object") {
    return { ok: false, errors: ["rights_manifest_missing"], warnings };
  }

  const status = manifest.reviewStatus;
  if (!status) errors.push("reviewStatus_missing");
  else if (status === "pending") errors.push("reviewStatus_pending");
  else if (status === "needs_review") errors.push("reviewStatus_needs_review");
  else if (status === "blocked") errors.push("reviewStatus_blocked");
  else if (status !== "cleared") errors.push(`reviewStatus_invalid:${status}`);

  const issues = Array.isArray(manifest.openIssues) ? manifest.openIssues : [];
  const unresolved = issues.filter((i) => i && i.resolved !== true);

  if (status === "cleared" && unresolved.length > 0) {
    errors.push(`cleared_with_unresolved:${unresolved.length}`);
  }

  for (const issue of unresolved) {
    const cat = issue.category || "unknown";
    if (issue.blocksPublication === true || BLOCKING_CATEGORIES.has(cat)) {
      if (cat === "trademark_review" && issue.blocksPublication === false) {
        warnings.push(`trademark_review:${issue.id || cat}`);
        continue;
      }
      errors.push(`unresolved_${cat}:${issue.id || "item"}`);
    } else if (cat === "trademark_review") {
      warnings.push(`trademark_review:${issue.id || cat}`);
    }
  }

  // Explicit unknown markers on sources/assets
  for (const s of manifest.thirdPartySources || []) {
    if (s.licenseStatus === "unknown" || !s.licenseStatus) {
      errors.push(`unknown_license:${s.id || s.url || "source"}`);
    }
    if (s.commercialUseStatus === "unknown" || !s.commercialUseStatus) {
      errors.push(`unknown_commercial_use:${s.id || s.url || "source"}`);
    }
    if (s.sourceStatus === "unknown") {
      errors.push(`source_unknown:${s.id || "source"}`);
    }
  }

  for (const a of manifest.assets || []) {
    if (a.licenseStatus === "unknown" || a.rightsStatus === "unknown") {
      errors.push(`unresolved_asset:${a.id || a.path || "asset"}`);
    }
  }

  if (!manifest.author && !manifest.publisher) {
    errors.push("author_publisher_missing");
  }

  if (manifest.aiAssisted === true) {
    const human = manifest.humanEditorialContribution;
    if (!human || (typeof human === "string" && !human.trim())) {
      errors.push("ai_assisted_without_human_contribution_record");
    }
  }

  // Deduplicate errors
  const uniq = [...new Set(errors)];
  return { ok: uniq.length === 0, errors: uniq, warnings: [...new Set(warnings)] };
}

/**
 * Build a rights manifest from scan + registration meta.
 * reviewStatus defaults to needs_review — never auto-cleared.
 */
export function buildRightsManifest({ registration, scan, overrides = {} }) {
  const productId = registration.slug;
  const revision = Number(registration.finalRevision);
  const openIssues = (scan.openIssues || []).map((i) => ({ ...i, resolved: false }));

  const manifest = {
    schemaVersion: 1,
    productId,
    instructionId: registration.instructionId,
    revision,
    author: registration.author?.ko || registration.author || null,
    publisher: overrides.publisher || "SotongWare",
    humanEditorialContribution:
      overrides.humanEditorialContribution ||
      "Human planned topic, TOC, fact-check policy, and editorial constraints; AI assisted drafting — contribution extent requires human attestation before cleared",
    aiAssisted: overrides.aiAssisted !== undefined ? overrides.aiAssisted : true,
    thirdPartySources: (scan.thirdPartySources || []).map((s) => ({
      ...s,
      licenseStatus: s.licenseStatus || "unknown",
      commercialUseStatus: s.commercialUseStatus || "unknown",
    })),
    assets: [
      ...(scan.assets?.images || []).map((img, i) => ({
        id: `img_${i}`,
        type: "image",
        chapterId: img.chapterId,
        ref: img.src,
        licenseStatus: "unknown",
        rightsStatus: "unknown",
      })),
      {
        id: "instructional_tables",
        type: "table",
        countApprox: scan.assets?.tables?.totalBlocksApprox || 0,
        note: "Mostly instructional checklists/tables authored in-manuscript; no third-party figure files detected in markdown",
        licenseStatus: "n/a_authored",
        rightsStatus: "review",
      },
    ],
    trademarks: (scan.trademarks || []).map((t) => ({
      id: t.trademarkId,
      label: t.label,
      chapterId: t.chapterId,
      disposition: "review",
    })),
    citations: summarizeCitations(scan.citations || []),
    licenses: [],
    openIssues,
    scanSummary: {
      scannedAt: scan.scannedAt,
      fileCount: scan.fileCount,
      sourceCount: (scan.thirdPartySources || []).length,
      citationHits: (scan.citations || []).length,
      imageCount: (scan.assets?.images || []).length,
      screenshotKeywordHits: (scan.assets?.screenshots || []).length,
      logoKeywordHits: (scan.assets?.logos || []).length,
      tableBlocksApprox: scan.assets?.tables?.totalBlocksApprox || 0,
      quoteSuspectCount: (scan.quoteSuspects || []).length,
      trademarkHitCount: (scan.trademarks || []).length,
      codeBlockFiles: (scan.assets?.codeExamples || []).length,
    },
    reviewedAt: null,
    reviewStatus: overrides.reviewStatus || "needs_review",
    reviewerNotes:
      overrides.reviewerNotes ||
      "Automated scan only. Do not treat as legal clearance. Human rights review required before reviewStatus=cleared.",
    generatedAt: new Date().toISOString(),
  };

  return manifest;
}

function summarizeCitations(citations) {
  const bySrc = new Map();
  for (const c of citations) {
    const cur = bySrc.get(c.srcId) || { srcId: c.srcId, chapters: new Set(), hits: 0 };
    cur.chapters.add(c.chapterId);
    cur.hits += 1;
    bySrc.set(c.srcId, cur);
  }
  return [...bySrc.values()].map((v) => ({
    srcId: v.srcId,
    hits: v.hits,
    chapters: [...v.chapters],
  }));
}

/** Assert rights evidence is not embedded in a public catalog blob. */
export function assertNoRightsLeakInPublicText(text) {
  const bad = [
    "reviewStatus",
    "openIssues",
    "humanEditorialContribution",
    "thirdPartySources",
    "rights_manifest",
    "license_unknown_",
    "wi_plan_1789914868666",
  ];
  for (const b of bad) {
    if (text.includes(b)) throw new Error(`rights_public_leak:${b}`);
  }
}
