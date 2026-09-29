/**
 * Apply evidence-based rights completion to Golden record (local only).
 * Does not modify Golden R2. Does not invent licenses.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateRightsPublicationGate } from "./lib/gate.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const checkedAt = "2026-09-29T00:30:00.000Z";
const recordPath = join(__dirname, "records", "ai-first-ebook-for-50s.r2.rights.json");
const evidenceDir = join(__dirname, "evidence");
const attestationPath = join(evidenceDir, "ai-first-ebook-for-50s.r2.human-attestation.json");
const assessmentsPath = join(evidenceDir, "ai-first-ebook-for-50s.r2.source-assessments.json");

const attestation = JSON.parse(readFileSync(attestationPath, "utf8"));
const record = JSON.parse(readFileSync(recordPath, "utf8"));

/** @type {Record<string, object>} */
const assessments = {
  SRC01: {
    sourceId: "SRC01",
    usageType: "FACTUAL_REFERENCE",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: true,
    commercialReusePolicy:
      "KISDI site policy: materials copyrighted; KOGL-marked works free per type; unmarked require prior consult for material use. Specific report page fetch did not display a KOGL type mark.",
    licenseRequiredForActualUsage: false,
    evidenceUrl: "https://www.kisdi.re.kr/content.do?key=m2102243307344",
    sourcePageUrl:
      "https://www.kisdi.re.kr/report/fileView.do?arrMasterId=4333447&id=1865976&key=m2101113025790",
    evidenceCheckedAt: checkedAt,
    remainingRisk:
      "If future edits copy report prose/figures, KOGL/permission re-check required. Specific-report KOGL type not confirmed on page.",
    recommendedResolution: "NO_ADDITIONAL_LICENSE_EVIDENCE_NEEDED",
    licenseStatus: "assessed_fact_citation_no_expression_copy",
    commercialUseStatus: "no_report_republication_fact_cite_with_attribution",
    r2Locations: ["fm-02", "ch-01", "ch-09", "ap-c"],
    notes: "Uses attributed survey percentages in author tables/sentences; no report prose/table/figure republication observed.",
  },
  SRC02: {
    sourceId: "SRC02",
    usageType: "PARAPHRASED_FACT",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: true,
    commercialReusePolicy:
      "Same KISDI copyright/KOGL site policy as SRC01. Specific report KOGL mark not independently confirmed in this pass.",
    licenseRequiredForActualUsage: false,
    evidenceUrl: "https://www.kisdi.re.kr/content.do?key=m2102243307344",
    sourcePageUrl:
      "https://www.kisdi.re.kr/report/fileView.do?arrMasterId=4333447&id=1938416&key=m2101113025790",
    evidenceCheckedAt: checkedAt,
    remainingRisk: "Do not copy report prose/figures without KOGL/permission confirmation.",
    recommendedResolution: "NO_ADDITIONAL_LICENSE_EVIDENCE_NEEDED",
    licenseStatus: "assessed_fact_citation_no_expression_copy",
    commercialUseStatus: "no_report_republication_fact_cite_with_attribution",
    r2Locations: ["fm-02", "ch-01", "ch-09", "ap-c"],
    notes: "Age-gap observation paraphrased with SRC attribution; no expression copy found.",
  },
  SRC03: {
    sourceId: "SRC03",
    usageType: "PARAPHRASED_FACT",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: true,
    commercialReusePolicy:
      "Brunch terms: member posts copyright remain with authors; no blanket commercial republication license for third-party posts.",
    licenseRequiredForActualUsage: false,
    evidenceUrl: "https://brunch.co.kr/policy/terms",
    sourcePageUrl: "https://brunch.co.kr/@5482fb6d0e13442/79",
    evidenceCheckedAt: checkedAt,
    remainingRisk: "Verbatim quote/republication of post text would require permission.",
    recommendedResolution: "NO_ADDITIONAL_LICENSE_EVIDENCE_NEEDED",
    licenseStatus: "assessed_pattern_paraphrase_no_expression_copy",
    commercialUseStatus: "no_verbatim_republication_pattern_summary_only",
    r2Locations: ["ch-03", "ch-06", "ch-07", "ch-09", "ap-c"],
  },
  SRC04: {
    sourceId: "SRC04",
    usageType: "PARAPHRASED_FACT",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: true,
    commercialReusePolicy: "Brunch author-owned posts; same as SRC03.",
    licenseRequiredForActualUsage: false,
    evidenceUrl: "https://brunch.co.kr/policy/terms",
    sourcePageUrl: "https://brunch.co.kr/@5482fb6d0e13442/81",
    evidenceCheckedAt: checkedAt,
    remainingRisk: "Verbatim quote would need permission.",
    recommendedResolution: "NO_ADDITIONAL_LICENSE_EVIDENCE_NEEDED",
    licenseStatus: "assessed_pattern_paraphrase_no_expression_copy",
    commercialUseStatus: "no_verbatim_republication_pattern_summary_only",
    r2Locations: ["ch-01", "ch-02", "ch-04", "ap-c"],
  },
  SRC05: {
    sourceId: "SRC05",
    usageType: "PARAPHRASED_FACT",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: false,
    commercialReusePolicy:
      "No site-wide reusable license confirmed on peachyaho.com during this pass; usage limited to attributed pattern paraphrase.",
    licenseRequiredForActualUsage: false,
    evidenceUrl: "https://peachyaho.com/10",
    sourcePageUrl: "https://peachyaho.com/10",
    evidenceCheckedAt: checkedAt,
    remainingRisk: "Site terms not fully located; keep no-verbatim rule.",
    recommendedResolution: "ATTRIBUTION_SUFFICIENT_CANDIDATE",
    licenseStatus: "assessed_pattern_paraphrase_no_expression_copy",
    commercialUseStatus: "no_verbatim_republication_pattern_summary_only",
    r2Locations: ["fm-02", "ch-02", "ch-03", "ch-04", "ap-c"],
  },
  SRC06: {
    sourceId: "SRC06",
    usageType: "PARAPHRASED_FACT",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: false,
    commercialReusePolicy: "No reusable license confirmed; pattern paraphrase only.",
    licenseRequiredForActualUsage: false,
    evidenceUrl:
      "https://www.bopyoletters.com/https-www-bopyoletters-com-non-developer-ai-agent-first-ebook/",
    sourcePageUrl:
      "https://www.bopyoletters.com/https-www-bopyoletters-com-non-developer-ai-agent-first-ebook/",
    evidenceCheckedAt: checkedAt,
    remainingRisk: "Do not copy case-study prose.",
    recommendedResolution: "ATTRIBUTION_SUFFICIENT_CANDIDATE",
    licenseStatus: "assessed_pattern_paraphrase_no_expression_copy",
    commercialUseStatus: "no_verbatim_republication_pattern_summary_only",
    r2Locations: ["ch-05", "ch-06", "ch-09", "ap-c"],
  },
  SRC07: {
    sourceId: "SRC07",
    usageType: "PARAPHRASED_FACT",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: false,
    commercialReusePolicy: "No reusable license confirmed; pattern paraphrase only.",
    licenseRequiredForActualUsage: false,
    evidenceUrl:
      "https://www.gpters.org/ai-writing/post/writing-e-books-every-0Ta2R6qzuJ2HbIi",
    sourcePageUrl:
      "https://www.gpters.org/ai-writing/post/writing-e-books-every-0Ta2R6qzuJ2HbIi",
    evidenceCheckedAt: checkedAt,
    remainingRisk: "Do not copy forum post text.",
    recommendedResolution: "ATTRIBUTION_SUFFICIENT_CANDIDATE",
    licenseStatus: "assessed_pattern_paraphrase_no_expression_copy",
    commercialUseStatus: "no_verbatim_republication_pattern_summary_only",
    r2Locations: ["ch-03", "ch-04", "ch-05", "ch-06", "ap-c"],
  },
  SRC08: {
    sourceId: "SRC08",
    usageType: "PARAPHRASED_FACT",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: false,
    commercialReusePolicy:
      "Public education listing page; no KOGL/reuse license confirmed for page text. Manuscript summarizes course-flow idea only.",
    licenseRequiredForActualUsage: false,
    evidenceUrl: "https://www.50plus.or.kr/gdc/education-detail.do?id=70486687",
    sourcePageUrl: "https://www.50plus.or.kr/gdc/education-detail.do?id=70486687",
    evidenceCheckedAt: checkedAt,
    remainingRisk: "Do not copy course syllabus/page text.",
    recommendedResolution: "ATTRIBUTION_SUFFICIENT_CANDIDATE",
    licenseStatus: "assessed_pattern_paraphrase_no_expression_copy",
    commercialUseStatus: "no_verbatim_republication_pattern_summary_only",
    r2Locations: ["ch-02", "ch-03", "ch-07", "ap-c"],
  },
  SRC09: {
    sourceId: "SRC09",
    usageType: "PARAPHRASED_FACT",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: true,
    commercialReusePolicy:
      "Frontiers articles under CC BY (commercial reuse with attribution). Article DOI 10.3389/feduc.2023.1231701 listed CC BY on secondary scholarly record; Frontiers author guidelines confirm CC BY for journal articles.",
    licenseRequiredForActualUsage: false,
    evidenceUrl: "https://www.frontiersin.org/guidelines/author-guidelines",
    sourcePageUrl:
      "https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2023.1231701/full",
    secondaryEvidenceUrl:
      "https://www.researchgate.net/publication/373908839_How_basic_is_basic_digital_literacy_for_older_adults_Insights_from_digital_skills_instructors",
    ccDeedUrl: "https://creativecommons.org/licenses/by/4.0/",
    evidenceCheckedAt: checkedAt,
    remainingRisk:
      "If quoting long passages or third-party figures inside the article, follow CC BY attribution and any third-party notices.",
    recommendedResolution: "LICENSE_CONFIRMED",
    licenseStatus: "cc_by_frontiers_article",
    commercialUseStatus: "cc_by_commercial_ok_with_attribution",
    r2Locations: ["fm-01", "ch-07", "ap-c"],
  },
  SRC10: {
    sourceId: "SRC10",
    usageType: "PARAPHRASED_FACT",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: true,
    commercialReusePolicy:
      "Official page: 공공누리 제4유형 (출처표시 + 상업적 이용금지 + 변경금지) for the guide document itself.",
    licenseRequiredForActualUsage: false,
    evidenceUrl:
      "https://www.copyright.or.kr/information-materials/publication/research-report/view.do?brdctsno=52591",
    sourcePageUrl:
      "https://www.copyright.or.kr/information-materials/publication/research-report/view.do?brdctsno=52591",
    evidenceCheckedAt: checkedAt,
    remainingRisk:
      "Commercial republication/adaptation of guide text is prohibited under KOGL Type 4. Manuscript states no long copy; keep concept-only.",
    recommendedResolution: "NO_ADDITIONAL_LICENSE_EVIDENCE_NEEDED",
    licenseStatus: "policy_kogl_type4_document_no_commercial_republication",
    commercialUseStatus: "no_document_republication_concept_paraphrase_only",
    r2Locations: ["ch-05", "ch-09", "ch-10", "ap-a", "ap-c", "ap-d"],
  },
  SRC11: {
    sourceId: "SRC11",
    usageType: "PARAPHRASED_FACT",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: true,
    commercialReusePolicy: "Official page: 공공누리 제4유형 for the registration guide document.",
    licenseRequiredForActualUsage: false,
    evidenceUrl:
      "https://www.copyright.or.kr/information-materials/publication/research-report/view.do?brdctsno=54253",
    sourcePageUrl:
      "https://www.copyright.or.kr/information-materials/publication/research-report/view.do?brdctsno=54253",
    evidenceCheckedAt: checkedAt,
    remainingRisk: "Do not commercially republish/adapt guide text (KOGL4).",
    recommendedResolution: "NO_ADDITIONAL_LICENSE_EVIDENCE_NEEDED",
    licenseStatus: "policy_kogl_type4_document_no_commercial_republication",
    commercialUseStatus: "no_document_republication_concept_paraphrase_only",
    r2Locations: ["ch-05", "ch-10", "ap-a", "ap-c", "ap-d"],
  },
  SRC12: {
    sourceId: "SRC12",
    usageType: "REFERENCE_ONLY",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: true,
    commercialReusePolicy:
      "Official 이용허락 안내 page explains Copyright Act Art.46 process; used as bibliographic/concept pointer, not document dump.",
    licenseRequiredForActualUsage: false,
    evidenceUrl: "https://findcopyright.or.kr/user/useCntrct/guide/info.do",
    sourcePageUrl: "https://findcopyright.or.kr/user/useCntrct/guide/info.do",
    evidenceCheckedAt: checkedAt,
    remainingRisk: "Do not copy page long-form into commercial product.",
    recommendedResolution: "NO_ADDITIONAL_LICENSE_EVIDENCE_NEEDED",
    licenseStatus: "assessed_reference_link_concept_only",
    commercialUseStatus: "link_and_concept_reference_only",
    r2Locations: ["ch-10", "ap-a", "ap-c"],
  },
  SRC13: {
    sourceId: "SRC13",
    usageType: "REFERENCE_ONLY",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: true,
    commercialReusePolicy:
      "NL.go.kr legal/procedure notice for deposit; manuscript points readers to official page when applicable.",
    licenseRequiredForActualUsage: false,
    evidenceUrl: "https://www.nl.go.kr/NL/contents/N50107020100.do",
    sourcePageUrl: "https://www.nl.go.kr/NL/contents/N50107020100.do",
    evidenceCheckedAt: checkedAt,
    remainingRisk: "Do not copy site manuals wholesale.",
    recommendedResolution: "NO_ADDITIONAL_LICENSE_EVIDENCE_NEEDED",
    licenseStatus: "assessed_reference_link_procedure_only",
    commercialUseStatus: "link_and_procedure_reference_only",
    r2Locations: ["ch-11", "ap-c"],
  },
  SRC14: {
    sourceId: "SRC14",
    usageType: "REFERENCE_ONLY",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: true,
    commercialReusePolicy: "NL ISBN/ISSN/UCI/deposit portal reference only.",
    licenseRequiredForActualUsage: false,
    evidenceUrl: "https://www.nl.go.kr/seoji/",
    sourcePageUrl: "https://www.nl.go.kr/seoji/",
    evidenceCheckedAt: checkedAt,
    remainingRisk: "Do not copy portal manuals wholesale.",
    recommendedResolution: "NO_ADDITIONAL_LICENSE_EVIDENCE_NEEDED",
    licenseStatus: "assessed_reference_link_procedure_only",
    commercialUseStatus: "link_and_procedure_reference_only",
    r2Locations: ["ch-11", "ap-c"],
  },
  SRC15: {
    sourceId: "SRC15",
    usageType: "REFERENCE_ONLY",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: true,
    commercialReusePolicy:
      "W3C TR EPUB 3.3 notice: Copyright IDPF/W3C; liability, trademark and permissive document license rules apply. Manuscript summarizes format concept and links; does not reproduce specification text.",
    licenseRequiredForActualUsage: false,
    evidenceUrl: "https://www.w3.org/TR/epub-33/",
    sourcePageUrl: "https://www.w3.org/TR/epub-33/",
    documentLicenseUrl: "https://www.w3.org/copyright/document-license-2023/",
    evidenceCheckedAt: checkedAt,
    remainingRisk: "If quoting substantial W3C text, include required W3C copyright/license notices.",
    recommendedResolution: "NO_ADDITIONAL_LICENSE_EVIDENCE_NEEDED",
    licenseStatus: "w3c_tr_permissive_document_license_referenced",
    commercialUseStatus: "spec_link_summary_only_no_verbatim_spec_copy",
    r2Locations: ["ch-08", "ap-a", "ap-c"],
  },
  SRC16: {
    sourceId: "SRC16",
    usageType: "REFERENCE_ONLY",
    copyrightableExpressionCopied: false,
    attributionPresent: true,
    licensePolicyFound: true,
    commercialReusePolicy:
      "W3C EPUB Accessibility 1.1 under W3C document licensing family; manuscript uses checklist-level summary + link only.",
    licenseRequiredForActualUsage: false,
    evidenceUrl: "https://www.w3.org/TR/epub-a11y-11/",
    sourcePageUrl: "https://www.w3.org/TR/epub-a11y-11/",
    documentLicenseUrl: "https://www.w3.org/copyright/document-license-2023/",
    evidenceCheckedAt: checkedAt,
    remainingRisk: "Same as SRC15 for substantial quotes.",
    recommendedResolution: "NO_ADDITIONAL_LICENSE_EVIDENCE_NEEDED",
    licenseStatus: "w3c_tr_permissive_document_license_referenced",
    commercialUseStatus: "spec_link_summary_only_no_verbatim_spec_copy",
    r2Locations: ["ch-08", "ap-c"],
  },
};

const coverAssessment = {
  id: "cover_front",
  type: "cover_image",
  path: "publish/revisions/r2/cover/cover_front.png",
  sha256: "7766ec3f1b98f3bfffd9475fdac9bdab1a7e318a28acf03a46c97dfb3cb83f79",
  provenanceEvidence: [
    "output/12_cover_layout_design_result.md asset table CV01-CV03 original_work",
    "references/image_rights.md original_work; no stock scrape; no AI logos",
  ],
  thirdPartyPhotoOrLogo: false,
  stockAssetEvidence: false,
  aiImageGeneratorEvidence: "none_found_in_workspace_rights_docs",
  licenseStatus: "original_work_documented",
  rightsStatus: "documented_workspace_original",
  remainingRisk:
    "PNG rasterization pipeline details beyond design docs not separately licensed; treat as workspace original pending any contrary evidence.",
  recommendedResolution: "NO_ADDITIONAL_LICENSE_EVIDENCE_NEEDED",
  evidenceCheckedAt: checkedAt,
};

const fontAssessment = {
  id: "pdf_embedded_malgun_gothic",
  type: "font",
  epubEmbeddedFonts: false,
  epubNote: "book.epub zip listing showed cover image/xhtml/opf; no .ttf/.otf/.woff entries",
  pdfFontsObserved: ["Helvetica (Type1)", "MalgunGothic (TrueType subset embedded)", "MalgunGothicBold (TrueType subset embedded)"],
  fontFamilies: ["Malgun Gothic", "Helvetica"],
  bundling: "pdf_document_embedding_subset",
  licensePolicyFound: true,
  evidenceUrl: "https://learn.microsoft.com/en-us/typography/fonts/font-faq",
  malgunProductPage: "https://learn.microsoft.com/en-us/typography/font-list/malgun-gothic",
  commercialReusePolicy:
    "Microsoft Font redistribution FAQ: Windows-supplied fonts may be embedded in documents by compliant apps; redistribute documents with embedded fonts generally allowed; do not redistribute standalone font files.",
  licenseStatus: "windows_system_font_document_embedding_assessed",
  rightsStatus: "document_embedding_allowed_per_microsoft_faq",
  remainingRisk:
    "Confirm build machine used licensed Windows-supplied Malgun Gothic; do not ship standalone .ttf. Helvetica Type1 is standard PDF base font.",
  recommendedResolution: "NO_ADDITIONAL_LICENSE_EVIDENCE_NEEDED",
  evidenceCheckedAt: checkedAt,
};

mkdirSync(evidenceDir, { recursive: true });
writeFileSync(
  assessmentsPath,
  JSON.stringify(
    {
      schemaVersion: 1,
      productId: "ai-first-ebook-for-50s",
      revision: 2,
      checkedAt,
      disclaimer:
        "Not legal advice. Assessments distinguish expression-copy vs fact/reference usage. Do not treat as absolute non-infringement warranty.",
      sources: Object.values(assessments),
      cover: coverAssessment,
      font: fontAssessment,
    },
    null,
    2,
  ) + "\n",
);

// Update thirdPartySources
record.thirdPartySources = (record.thirdPartySources || []).map((s) => {
  const a = assessments[s.id];
  if (!a) return s;
  return {
    ...s,
    usageType: a.usageType,
    copyrightableExpressionCopied: a.copyrightableExpressionCopied,
    licenseStatus: a.licenseStatus,
    commercialUseStatus: a.commercialUseStatus,
    licensePolicyFound: a.licensePolicyFound,
    licenseRequiredForActualUsage: a.licenseRequiredForActualUsage,
    recommendedResolution: a.recommendedResolution,
    remainingRisk: a.remainingRisk,
    evidenceUrl: a.evidenceUrl,
    evidenceCheckedAt: a.evidenceCheckedAt,
    notes: a.notes || s.notes,
  };
});

// Assets: keep instructional tables; add cover + fonts
const nonCoverFont = (record.assets || []).filter(
  (a) => a.id !== "cover_front" && a.id !== "pdf_embedded_fonts" && a.id !== "epub_fonts",
);
record.assets = [
  ...nonCoverFont.map((a) =>
    a.id === "instructional_tables"
      ? {
          ...a,
          licenseStatus: "n/a_authored",
          rightsStatus: "authored_instructional",
          note: "53 instructional markdown tables; no third-party figure files in manuscript",
        }
      : a,
  ),
  {
    id: "cover_front",
    type: "cover_image",
    path: coverAssessment.path,
    sha256: coverAssessment.sha256,
    licenseStatus: coverAssessment.licenseStatus,
    rightsStatus: coverAssessment.rightsStatus,
    provenanceEvidence: coverAssessment.provenanceEvidence,
    evidenceCheckedAt: checkedAt,
  },
  {
    id: "pdf_embedded_fonts",
    type: "font",
    families: fontAssessment.fontFamilies,
    observed: fontAssessment.pdfFontsObserved,
    licenseStatus: fontAssessment.licenseStatus,
    rightsStatus: fontAssessment.rightsStatus,
    evidenceUrl: fontAssessment.evidenceUrl,
    evidenceCheckedAt: checkedAt,
  },
  {
    id: "epub_fonts",
    type: "font",
    embedded: false,
    licenseStatus: "n/a_no_embedded_font_files",
    rightsStatus: "no_epub_font_bundle",
    evidenceCheckedAt: checkedAt,
  },
];

record.humanAttestation = {
  evidenceFile: "scripts/ebook-rights/evidence/ai-first-ebook-for-50s.r2.human-attestation.json",
  confirmedBy: attestation.confirmedBy,
  confirmedAt: attestation.confirmedAt,
  authorRightsConfirmed: attestation.authorRightsConfirmed,
  commercialPublicationAuthorized: attestation.commercialPublicationAuthorized,
  aiAssisted: attestation.aiAssisted,
  humanContribution: attestation.humanContribution,
  ch04PromptExampleOriginalityConfirmed: attestation.ch04PromptExampleOriginalityConfirmed,
};

record.humanEditorialContribution = [
  "topicPlanning",
  "structure",
  "toc",
  "selection",
  "revision",
  "editing",
  "finalApproval",
].join(", ");

record.aiAssisted = true;
record.author = "SotongWare";
record.publisher = "SotongWare";
record.sourceAssessmentsEvidenceFile =
  "scripts/ebook-rights/evidence/ai-first-ebook-for-50s.r2.source-assessments.json";

function resolveIssue(issue, note, refs = []) {
  return {
    ...issue,
    resolved: true,
    resolvedAt: checkedAt,
    resolutionNote: note,
    evidenceRefs: [...new Set([...(issue.evidenceRefs || []), ...refs])],
  };
}

const evidenceAttestationRel =
  "scripts/ebook-rights/evidence/ai-first-ebook-for-50s.r2.human-attestation.json";
const evidenceAssessmentsRel =
  "scripts/ebook-rights/evidence/ai-first-ebook-for-50s.r2.source-assessments.json";

record.openIssues = (record.openIssues || []).map((issue) => {
  if (issue.id?.startsWith("license_unknown_SRC")) {
    const srcId = issue.id.replace("license_unknown_", "");
    const a = assessments[srcId];
    if (!a) return issue;
    return resolveIssue(
      issue,
      `Usage assessed as ${a.usageType}; copyrightableExpressionCopied=${a.copyrightableExpressionCopied}; licenseRequiredForActualUsage=${a.licenseRequiredForActualUsage}; recommendedResolution=${a.recommendedResolution}. ${a.commercialReusePolicy}`,
      [a.evidenceUrl, evidenceAssessmentsRel],
    );
  }
  if (issue.id === "quote_suspect_ch-04_0") {
    return resolveIssue(
      issue,
      "OWNER attestation: ch-04 bad-vs-good prompt examples are original production examples, not copied from another work.",
      [evidenceAttestationRel],
    );
  }
  if (issue.id === "author_rights_confirmation") {
    return resolveIssue(
      issue,
      "OWNER attestation: SotongWare production; commercial publication under SotongWare name authorized.",
      [evidenceAttestationRel],
    );
  }
  if (issue.id === "ai_provenance_human_review") {
    return resolveIssue(
      issue,
      "OWNER attestation: AI assist only; human topicPlanning/structure/toc/selection/revision/editing/finalApproval recorded.",
      [evidenceAttestationRel],
    );
  }
  if (issue.id === "trademark_mentions_review") {
    return resolveIssue(
      issue,
      "Manuscript uses product/service names descriptively; no logos/brand images; no affiliation/endorsement claims found in R2 markdown.",
      ["manuscript_nominative_use_review"],
    );
  }
  return issue;
});

// Ensure cover/font blockers are present only if unresolved — we resolve via assets; no separate open issues needed if assets assessed.

record.reviewStatus = "cleared";
record.reviewedAt = checkedAt;
record.reviewerNotes =
  "Evidence completion 2026-09-29: human OWNER attestation + official policy/link research for SRC usage-type assessments + cover original_work docs + Microsoft font embedding FAQ. Not a legal non-infringement warranty. Fail-closed gate re-evaluated locally.";

record.licenses = [
  {
    id: "SRC09_CC_BY",
    appliesTo: ["SRC09"],
    spdxOrLabel: "CC-BY-4.0",
    evidenceUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
  {
    id: "SRC10_KOGL4",
    appliesTo: ["SRC10"],
    spdxOrLabel: "KOGL-Type-4",
    note: "Applies to guide document republication; product does not republish document text",
  },
  {
    id: "SRC11_KOGL4",
    appliesTo: ["SRC11"],
    spdxOrLabel: "KOGL-Type-4",
    note: "Applies to guide document republication; product does not republish document text",
  },
  {
    id: "W3C_DOCUMENT_LICENSE_FAMILY",
    appliesTo: ["SRC15", "SRC16"],
    evidenceUrl: "https://www.w3.org/copyright/document-license-2023/",
  },
];

const gate = evaluateRightsPublicationGate(record);
record.gate = gate;
record.evidenceCompletedAt = checkedAt;
record.generatedAt = new Date().toISOString();

const json = JSON.stringify(record, null, 2) + "\n";
if (/C:[\\/]+Users/i.test(json)) {
  const idx = json.search(/C:[\\/]+Users/i);
  throw new Error(`absolute_Users_path_leak_in_rights_record@${idx}:${json.slice(idx, idx + 80)}`);
}
writeFileSync(recordPath, json);

console.log(JSON.stringify({ recordPath, gate, reviewStatus: record.reviewStatus, unresolved: (record.openIssues || []).filter((i) => !i.resolved).map((i) => i.id) }, null, 2));
if (!gate.ok) {
  console.error("GATE_NOT_OK", gate.errors);
  process.exit(1);
}
console.log("RIGHTS_GATE_OK");
