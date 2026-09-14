import type { EbookCatalogItem } from "./types";

/**
 * Static ebook catalog for library / detail / web-reader preview.
 * No public PDF/EPUB asset URLs — reader uses inlined mock text only.
 */
export const ebookCatalog: EbookCatalogItem[] = [
  {
    slug: "field-software-primer",
    sortOrder: 10,
    updatedAt: "2026-09-14",
    featured: true,
    title: {
      ko: "현장 소프트웨어 입문",
      en: "Field Software Primer",
    },
    summary: {
      ko: "산업·스마트팜 현장에서 소프트웨어가 하는 일과 설계 원칙을 짧게 정리한 입문서입니다.",
      en: "A short primer on what software does on industrial and smart-farm floors—and how we design it.",
    },
    category: { ko: "산업·현장", en: "Field & industry" },
    accessTier: "free",
    status: "live",
    author: { ko: "SotongWare", en: "SotongWare" },
    coverTone: "sky",
    priceNote: {
      ko: "무료 미리보기 제공 · 정식 판매 준비 중",
      en: "Free preview available · retail pricing coming soon",
    },
    toc: [
      { id: "ch1", title: { ko: "1. 현장이 원하는 소프트웨어", en: "1. What the field needs" }, accessTier: "free" },
      { id: "ch2", title: { ko: "2. 데이터에서 조치까지", en: "2. From data to action" }, accessTier: "free" },
      { id: "ch3", title: { ko: "3. 검증과 배포", en: "3. Validate and deploy" }, accessTier: "member" },
      { id: "ch4", title: { ko: "4. 운영 체크리스트", en: "4. Operations checklist" }, accessTier: "premium" },
    ],
    chapters: [
      {
        id: "ch1",
        title: { ko: "1. 현장이 원하는 소프트웨어", en: "1. What the field needs" },
        accessTier: "free",
        pages: [
          {
            paragraphs: [
              {
                ko: "현장 소프트웨어는 화려한 화면보다 ‘지금 무엇을 해야 하는가’를 빠르게 보여주는 것이 중요합니다.",
                en: "Field software succeeds when it answers what to do now—not when it looks flashy.",
              },
              {
                ko: "센서·설비·작업자 흐름을 하나의 화면 언어로 맞추는 것이 첫 단계입니다.",
                en: "Align sensors, equipment, and operator flow into one visual language first.",
              },
            ],
          },
          {
            paragraphs: [
              {
                ko: "이 장은 무료로 열람할 수 있는 Preview 본문입니다. 원본 파일 URL은 노출하지 않습니다.",
                en: "This chapter is a free preview body. Original file URLs are never exposed.",
              },
            ],
          },
        ],
      },
      {
        id: "ch2",
        title: { ko: "2. 데이터에서 조치까지", en: "2. From data to action" },
        accessTier: "free",
        pages: [
          {
            paragraphs: [
              {
                ko: "경보만 울리는 시스템은 부족합니다. 조치 후보와 책임자를 함께 제시해야 합니다.",
                en: "Alerts alone are not enough—pair them with suggested actions and owners.",
              },
            ],
          },
        ],
      },
      {
        id: "ch3",
        title: { ko: "3. 검증과 배포", en: "3. Validate and deploy" },
        accessTier: "member",
        pages: [
          {
            paragraphs: [
              {
                ko: "회원 Preview에서만 열리는 심화 장입니다. 실제 회원 권한이 아닙니다.",
                en: "Member-preview-only deeper chapter. This is not a real membership grant.",
              },
              {
                ko: "검증 시나리오, 롤백 기준, 현장 피드백 루프를 정리합니다.",
                en: "We outline validation scenarios, rollback criteria, and field feedback loops.",
              },
            ],
          },
        ],
      },
      {
        id: "ch4",
        title: { ko: "4. 운영 체크리스트", en: "4. Operations checklist" },
        accessTier: "premium",
        pages: [
          {
            paragraphs: [
              {
                ko: "프리미엄 Preview 전용 체크리스트입니다. 정식 이용권·결제는 아직 열리지 않았습니다.",
                en: "Premium-preview checklist only. Live entitlements and payments are not open yet.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-practice-notes",
    sortOrder: 20,
    updatedAt: "2026-09-14",
    title: {
      ko: "AI 실무 노트",
      en: "Practical AI Notes",
    },
    summary: {
      ko: "요구사항 정리부터 검증까지, AI를 실무 도구로 쓰는 짧은 노트입니다.",
      en: "Short notes on using AI as a practical tool—from requirements to validation.",
    },
    category: { ko: "AI·자동화", en: "AI & automation" },
    accessTier: "member",
    status: "preparing",
    author: { ko: "SotongWare", en: "SotongWare" },
    coverTone: "violet",
    priceNote: {
      ko: "회원 전용 Preview · 구매/구독 준비 중",
      en: "Member preview · purchase/subscription coming soon",
    },
    toc: [
      { id: "a1", title: { ko: "1. 요구를 문장으로", en: "1. Requirements as sentences" }, accessTier: "member" },
      { id: "a2", title: { ko: "2. 검증 루프", en: "2. Validation loop" }, accessTier: "premium" },
    ],
    chapters: [
      {
        id: "a1",
        title: { ko: "1. 요구를 문장으로", en: "1. Requirements as sentences" },
        accessTier: "member",
        pages: [
          {
            paragraphs: [
              {
                ko: "AI에게 맡기기 전에, 사람이 승인할 수 있는 문장으로 요구를 고정합니다.",
                en: "Before handing work to AI, lock requirements into human-approvable sentences.",
              },
            ],
          },
        ],
      },
      {
        id: "a2",
        title: { ko: "2. 검증 루프", en: "2. Validation loop" },
        accessTier: "premium",
        pages: [
          {
            paragraphs: [
              {
                ko: "프리미엄 Preview 본문 — 실제 DRM·결제와 무관한 샘플입니다.",
                en: "Premium preview body — sample text unrelated to live DRM or payments.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "smart-farm-signals",
    sortOrder: 30,
    updatedAt: "2026-09-13",
    title: {
      ko: "스마트팜 신호 읽기",
      en: "Reading Smart-Farm Signals",
    },
    summary: {
      ko: "온도·습도·관수 신호를 화면에서 어떻게 읽을지 정리한 프리미엄 가이드 Preview입니다.",
      en: "A premium-guide preview on reading climate and irrigation signals on screen.",
    },
    category: { ko: "스마트팜", en: "Smart farm" },
    accessTier: "premium",
    status: "comingSoon",
    author: { ko: "SotongWare", en: "SotongWare" },
    coverTone: "emerald",
    priceNote: {
      ko: "프리미엄 예정 · 정식 오픈 후 이용 가능",
      en: "Premium planned · available after official launch",
    },
    toc: [
      { id: "s1", title: { ko: "1. 신호의 의미", en: "1. What signals mean" }, accessTier: "premium" },
    ],
    chapters: [
      {
        id: "s1",
        title: { ko: "1. 신호의 의미", en: "1. What signals mean" },
        accessTier: "premium",
        pages: [
          {
            paragraphs: [
              {
                ko: "Coming soon 도서의 Preview 샘플 본문입니다.",
                en: "Sample preview body for a coming-soon title.",
              },
            ],
          },
        ],
      },
    ],
  },
];

export function getEbookCatalog(): EbookCatalogItem[] {
  return [...ebookCatalog].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getEbookBySlug(slug: string): EbookCatalogItem | undefined {
  return ebookCatalog.find((item) => item.slug === slug);
}

export function ebookCatalogSlugs(): string[] {
  return ebookCatalog.map((item) => item.slug);
}
