import type { KnowledgeContentItem, KnowledgeSiteItem, KnowledgeThemeId, LocalizedText } from "./types";

export const knowledgeThemeLabels: Record<KnowledgeThemeId, LocalizedText> = {
  ai: { ko: "AI", en: "AI" },
  electrical: { ko: "전기", en: "Electrical" },
  plc: { ko: "PLC·자동화", en: "PLC & automation" },
  rural: { ko: "농업·시골생활", en: "Farm & rural life" },
  hobby: { ko: "취미", en: "Hobby" },
  other: { ko: "기타", en: "Other" },
};

export const knowledgeThemes: KnowledgeThemeId[] = [
  "ai",
  "electrical",
  "plc",
  "rural",
  "hobby",
  "other",
];

/** Linked knowledge sites — static preview, no live Firestore dependency. */
export const knowledgeSites: KnowledgeSiteItem[] = [
  {
    slug: "ai-lab-notes",
    sortOrder: 10,
    updatedAt: "2026-09-14",
    featured: true,
    name: { ko: "AI 실습 노트", en: "AI Lab Notes" },
    themeId: "ai",
    description: {
      ko: "요구 정리·검증 중심의 AI 실습 가이드 모음입니다.",
      en: "Practical AI guides focused on requirements and validation.",
    },
    status: "preparing",
    accessTier: "free",
    featuredContent: { ko: "AI 요구사항 체크리스트", en: "AI requirements checklist" },
    openHref: "/knowledge/sites/ai-lab-notes",
    urlNote: {
      ko: "연동 사이트 준비 중 — 지금은 SotongWare Preview에서 탐색합니다.",
      en: "Linked site preparing — explore in the SotongWare preview for now.",
    },
  },
  {
    slug: "electrical-basics",
    sortOrder: 20,
    updatedAt: "2026-09-14",
    name: { ko: "전기 기초 교실", en: "Electrical Basics" },
    themeId: "electrical",
    description: {
      ko: "현장 전기 기초와 안전 개념을 단계적으로 정리합니다.",
      en: "Stepwise basics and safety concepts for field electrical work.",
    },
    status: "comingSoon",
    accessTier: "member",
    featuredContent: { ko: "안전 점검 카드", en: "Safety check cards" },
    openHref: "/knowledge/sites/electrical-basics",
    urlNote: {
      ko: "Coming soon — 회원 포털이 아닌 공개 탐색용 카드입니다.",
      en: "Coming soon — public discovery card, not a member-portal gate.",
    },
  },
  {
    slug: "plc-field-desk",
    sortOrder: 30,
    updatedAt: "2026-09-13",
    featured: true,
    name: { ko: "PLC 현장 데스크", en: "PLC Field Desk" },
    themeId: "plc",
    description: {
      ko: "PLC·HMI·모니터링 용어와 현장 시나리오를 모은 지식 허브 Preview입니다.",
      en: "A knowledge-hub preview of PLC/HMI/monitoring terms and field scenarios.",
    },
    status: "live",
    accessTier: "free",
    featuredContent: { ko: "라인 알람 읽기", en: "Reading line alarms" },
    openHref: "/knowledge/sites/plc-field-desk",
    urlNote: {
      ko: "공개 탐색 가능 · 심화 자료는 회원/프리미엄 Preview",
      en: "Open browsing · deeper materials via member/premium preview",
    },
  },
  {
    slug: "rural-tech-notes",
    sortOrder: 40,
    updatedAt: "2026-09-12",
    name: { ko: "시골생활 기술 노트", en: "Rural Tech Notes" },
    themeId: "rural",
    description: {
      ko: "농업·생활 기술과 센서 활용을 쉬운 언어로 정리합니다.",
      en: "Farm and daily-life tech explained in plain language.",
    },
    status: "preparing",
    accessTier: "free",
    featuredContent: { ko: "관수 신호 입문", en: "Irrigation signals intro" },
    openHref: "/knowledge/sites/rural-tech-notes",
    urlNote: {
      ko: "테마 사이트 준비 중",
      en: "Theme site in preparation",
    },
  },
  {
    slug: "maker-hobby-lab",
    sortOrder: 50,
    updatedAt: "2026-09-11",
    name: { ko: "메이커 취미 랩", en: "Maker Hobby Lab" },
    themeId: "hobby",
    description: {
      ko: "취미·창작 프로젝트용 짧은 지식 카드 모음입니다.",
      en: "Short knowledge cards for hobby and maker projects.",
    },
    status: "comingSoon",
    accessTier: "free",
    featuredContent: { ko: "주말 프로젝트 카드", en: "Weekend project cards" },
    openHref: "/knowledge/sites/maker-hobby-lab",
    urlNote: {
      ko: "Coming soon",
      en: "Coming soon",
    },
  },
  {
    slug: "general-learning-rail",
    sortOrder: 60,
    updatedAt: "2026-09-10",
    name: { ko: "공통 학습 레일", en: "General Learning Rail" },
    themeId: "other",
    description: {
      ko: "여러 테마를 가로지르는 입문·안내 콘텐츠입니다.",
      en: "Cross-theme introductory and orientation content.",
    },
    status: "live",
    accessTier: "free",
    featuredContent: { ko: "학습 시작 가이드", en: "Getting-started guide" },
    openHref: "/knowledge/sites/general-learning-rail",
    urlNote: {
      ko: "공개 안내 허브",
      en: "Public orientation hub",
    },
  },
];

export const knowledgeContents: KnowledgeContentItem[] = [
  {
    id: "kc-ai-checklist",
    sortOrder: 10,
    updatedAt: "2026-09-14",
    featured: true,
    title: { ko: "AI 요구사항 체크리스트", en: "AI requirements checklist" },
    summary: {
      ko: "무료로 볼 수 있는 공개 체크리스트 Preview입니다.",
      en: "A free public checklist preview.",
    },
    themeId: "ai",
    siteSlug: "ai-lab-notes",
    accessTier: "free",
    status: "live",
    format: { ko: "가이드", en: "Guide" },
  },
  {
    id: "kc-plc-alarm",
    sortOrder: 20,
    updatedAt: "2026-09-13",
    title: { ko: "라인 알람 읽기", en: "Reading line alarms" },
    summary: {
      ko: "PLC 현장 데스크의 대표 공개 콘텐츠입니다.",
      en: "Featured open content from PLC Field Desk.",
    },
    themeId: "plc",
    siteSlug: "plc-field-desk",
    accessTier: "free",
    status: "live",
    format: { ko: "실습 노트", en: "Lab note" },
  },
  {
    id: "kc-elec-safety",
    sortOrder: 30,
    updatedAt: "2026-09-12",
    title: { ko: "안전 점검 카드", en: "Safety check cards" },
    summary: {
      ko: "회원 Preview에서 열람 가능한 전기 기초 자료입니다.",
      en: "Electrical basics available in member preview.",
    },
    themeId: "electrical",
    siteSlug: "electrical-basics",
    accessTier: "member",
    status: "preparing",
    format: { ko: "카드", en: "Cards" },
  },
  {
    id: "kc-irrigation",
    sortOrder: 40,
    updatedAt: "2026-09-11",
    title: { ko: "관수 신호 심화", en: "Irrigation signals deep dive" },
    summary: {
      ko: "프리미엄 Preview 예정 자료입니다. 결제는 아직 없습니다.",
      en: "Premium-preview material. Payments are not open.",
    },
    themeId: "rural",
    siteSlug: "rural-tech-notes",
    accessTier: "premium",
    status: "comingSoon",
    format: { ko: "심화 가이드", en: "Deep guide" },
  },
];

export function getKnowledgeSites(): KnowledgeSiteItem[] {
  return [...knowledgeSites].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getKnowledgeSiteBySlug(slug: string): KnowledgeSiteItem | undefined {
  return knowledgeSites.find((s) => s.slug === slug);
}

export function knowledgeSiteSlugs(): string[] {
  return knowledgeSites.map((s) => s.slug);
}

export function getKnowledgeContents(themeId?: KnowledgeThemeId): KnowledgeContentItem[] {
  const list = [...knowledgeContents].sort((a, b) => a.sortOrder - b.sortOrder);
  return themeId ? list.filter((c) => c.themeId === themeId) : list;
}
