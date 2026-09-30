import type {
  ContentCatalogItem,
  ContentFormatId,
  ContentMediaKind,
  ContentUiCategoryId,
  LocalizedText,
} from "./types";
import {
  formatIdToUiCategory as formatIdToUiCategoryJs,
  isCustomerLiveContent,
} from "@/lib/content-publication-gate.mjs";

export const contentFormatLabels: Record<ContentFormatId, LocalizedText> = {
  shorts: { ko: "쇼츠", en: "Shorts" },
  comic: { ko: "만화", en: "Comics" },
  comicVideo: { ko: "만화영상", en: "Comic video" },
  music: { ko: "노래", en: "Music" },
  video: { ko: "일반 영상", en: "Video" },
  image: { ko: "이미지/그래픽", en: "Image / graphic" },
  game: { ko: "게임", en: "Game" },
  other: { ko: "기타", en: "Other" },
};

/** Customer hub tabs — no "other". */
export const contentUiCategories: ContentUiCategoryId[] = [
  "shorts",
  "music",
  "comic",
  "video",
  "image",
  "game",
];

export const contentUiCategoryLabels: Record<ContentUiCategoryId, LocalizedText> = {
  shorts: { ko: "쇼츠", en: "Shorts" },
  music: { ko: "음악", en: "Music" },
  comic: { ko: "만화", en: "Comics" },
  video: { ko: "영상", en: "Video" },
  image: { ko: "이미지", en: "Images" },
  game: { ko: "게임", en: "Games" },
};

/** All internal formats including game; "other" kept as internal fallback only. */
export const contentFormats: ContentFormatId[] = [
  "shorts",
  "comic",
  "comicVideo",
  "music",
  "video",
  "image",
  "game",
  "other",
];

export function formatIdToUiCategory(formatId: ContentFormatId): ContentUiCategoryId | null {
  return formatIdToUiCategoryJs(formatId) as ContentUiCategoryId | null;
}

export function defaultMediaKind(formatId: ContentFormatId): ContentMediaKind {
  switch (formatId) {
    case "shorts":
      return "shortVideo";
    case "music":
      return "audio";
    case "comic":
      return "comic";
    case "comicVideo":
    case "video":
      return "video";
    case "image":
      return "image";
    case "game":
      return "game";
    default:
      return "video";
  }
}

const preparingPublication = {
  rightsStatus: "unchecked" as const,
  aiProvenance: "none" as const,
  reviewed: false,
  approvedForPublic: false,
};

function emptyMedia(kind: ContentMediaKind, altKo: string, altEn: string) {
  return {
    kind,
    source: "none" as const,
    alt: { ko: altKo, en: altEn },
  };
}

/**
 * Media library catalog — Phase 1: schema + honest preparing demos only.
 * No fake view/subscriber/revenue counts. No private Storage URLs.
 */
export const contentCatalog: ContentCatalogItem[] = [
  {
    slug: "factory-morning-short",
    sortOrder: 10,
    updatedAt: "2026-09-30",
    featured: false,
    title: { ko: "공장 아침 루틴 Short", en: "Factory morning routine short" },
    summary: {
      ko: "현장 출근 루틴 쇼츠 — 실미디어 등록 전 준비 중 Preview입니다.",
      en: "Plant-floor morning short — preparing preview before real media lands.",
    },
    formatId: "shorts",
    theme: { ko: "산업 현장", en: "Plant floor" },
    accessTier: "free",
    status: "preparing",
    channel: { ko: "SotongWare Shorts (준비 중)", en: "SotongWare Shorts (preparing)" },
    coverTone: "rose",
    media: emptyMedia("shortVideo", "공장 아침 루틴 쇼츠 썸네일 자리", "Factory morning short poster placeholder"),
    publication: { ...preparingPublication },
  },
  {
    slug: "sotong-cat-episode-1",
    sortOrder: 20,
    updatedAt: "2026-09-30",
    title: { ko: "소통냥 에피소드 1", en: "Sotong Cat episode 1" },
    summary: {
      ko: "만화 컷 구성 Preview — 실제 컷·연재 연결 전 준비 중입니다.",
      en: "Comic-panel preview — preparing before real panels publish.",
    },
    formatId: "comic",
    theme: { ko: "캐릭터", en: "Characters" },
    accessTier: "free",
    status: "preparing",
    channel: { ko: "콘텐츠 허브 (준비 중)", en: "Content hub (preparing)" },
    coverTone: "amber",
    media: emptyMedia("comic", "소통냥 에피소드 1 커버 자리", "Sotong Cat episode 1 cover placeholder"),
    publication: { ...preparingPublication },
    related: { knowledgeSlugs: [], ebookSlugs: [] },
  },
  {
    slug: "comic-motion-teaser",
    sortOrder: 30,
    updatedAt: "2026-09-30",
    title: { ko: "만화영상 티저", en: "Comic-motion teaser" },
    summary: {
      ko: "만화영상 형식 티저 카드 — 실영상 등록 전 준비 중입니다.",
      en: "Comic-motion teaser card — preparing before real video lands.",
    },
    formatId: "comicVideo",
    theme: { ko: "스토리", en: "Story" },
    accessTier: "member",
    status: "preparing",
    channel: { ko: "회원 Preview (준비 중)", en: "Member preview (preparing)" },
    coverTone: "violet",
    media: emptyMedia("video", "만화영상 티저 포스터 자리", "Comic-motion teaser poster placeholder"),
    publication: { ...preparingPublication },
  },
  {
    slug: "morning-focus-track",
    sortOrder: 40,
    updatedAt: "2026-09-30",
    title: { ko: "모닝 포커스 트랙", en: "Morning focus track" },
    summary: {
      ko: "작업용 짧은 음악 트랙 — 실음원 등록 전 준비 중입니다.",
      en: "Short work-focus track — preparing before real audio lands.",
    },
    formatId: "music",
    theme: { ko: "음악", en: "Music" },
    accessTier: "free",
    status: "preparing",
    channel: { ko: "Sotong Music (준비 중)", en: "Sotong Music (preparing)" },
    coverTone: "sky",
    media: emptyMedia("audio", "모닝 포커스 트랙 커버 자리", "Morning focus track cover placeholder"),
    publication: { ...preparingPublication },
  },
  {
    slug: "remote-ops-explain",
    sortOrder: 50,
    updatedAt: "2026-09-30",
    title: { ko: "원격관제 설명 영상", en: "Remote ops explainer" },
    summary: {
      ko: "일반 영상 설명 콘텐츠 — 실영상 등록 전 준비 중입니다.",
      en: "Standard video explainer — preparing before real video lands.",
    },
    formatId: "video",
    theme: { ko: "자동화", en: "Automation" },
    accessTier: "member",
    status: "preparing",
    channel: { ko: "지식·콘텐츠 교차 (준비 중)", en: "Knowledge × content (preparing)" },
    coverTone: "emerald",
    media: emptyMedia("video", "원격관제 설명 영상 포스터 자리", "Remote ops explainer poster placeholder"),
    publication: { ...preparingPublication },
    related: { knowledgeSlugs: ["plc"], ebookSlugs: [] },
  },
  {
    slug: "brand-poster-set",
    sortOrder: 60,
    updatedAt: "2026-09-30",
    title: { ko: "브랜드 포스터 세트", en: "Brand poster set" },
    summary: {
      ko: "이미지/그래픽 결과물 — 실이미지 등록 전 Coming soon입니다.",
      en: "Image/graphic set — coming soon before real assets land.",
    },
    formatId: "image",
    theme: { ko: "브랜드", en: "Brand" },
    accessTier: "premium",
    status: "comingSoon",
    channel: { ko: "프리미엄 (준비 중)", en: "Premium (preparing)" },
    coverTone: "slate",
    media: emptyMedia("image", "브랜드 포스터 세트 자리", "Brand poster set placeholder"),
    publication: { ...preparingPublication },
  },
  {
    slug: "signal-light-reaction",
    sortOrder: 70,
    updatedAt: "2026-09-30",
    title: { ko: "현장 신호등 반응", en: "Plant signal-light reaction" },
    summary: {
      ko: "브라우저 미니게임 계약 Preview — 실행 파일·플레이는 아직 없습니다.",
      en: "Browser mini-game contract preview — no playable bundle yet.",
    },
    formatId: "game",
    theme: { ko: "미니게임", en: "Mini-game" },
    accessTier: "free",
    status: "preparing",
    channel: { ko: "게임 (준비 중)", en: "Games (preparing)" },
    coverTone: "emerald",
    media: emptyMedia("game", "현장 신호등 반응 게임 커버 자리", "Signal-light reaction game cover placeholder"),
    publication: { ...preparingPublication },
    related: { knowledgeSlugs: ["plc"], ebookSlugs: [], appSlugs: [] },
    game: {
      launchMode: "embedded",
      supportsTouch: true,
      supportsKeyboard: true,
      guestPlayAllowed: true,
      localScore: true,
      memberRankingFuture: true,
    },
  },
];

function sortByOrder(list: ContentCatalogItem[]): ContentCatalogItem[] {
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Full catalog sorted (includes preparing demos for detail routes). */
export function getContentCatalog(formatId?: ContentFormatId): ContentCatalogItem[] {
  const list = sortByOrder(contentCatalog);
  return formatId ? list.filter((c) => c.formatId === formatId) : list;
}

/** Customer library list filtered by UI category (comicVideo+video → video). */
export function getContentCatalogByUiCategory(
  category?: ContentUiCategoryId | "all",
): ContentCatalogItem[] {
  const list = sortByOrder(contentCatalog);
  if (!category || category === "all") return list;
  return list.filter((c) => formatIdToUiCategory(c.formatId) === category);
}

export function getCustomerLiveContents(): ContentCatalogItem[] {
  return sortByOrder(contentCatalog.filter(isCustomerLiveContent));
}

export function getPreparingContents(): ContentCatalogItem[] {
  return sortByOrder(contentCatalog.filter((c) => !isCustomerLiveContent(c)));
}

export function getContentBySlug(slug: string): ContentCatalogItem | undefined {
  return contentCatalog.find((c) => c.slug === slug);
}

export function contentCatalogSlugs(): string[] {
  return contentCatalog.map((c) => c.slug);
}

export function relatedLinkTargets(item: ContentCatalogItem): {
  knowledge: string[];
  ebooks: string[];
  apps: string[];
} {
  const knowledge = (item.related?.knowledgeSlugs ?? []).filter(Boolean).slice(0, 2);
  const ebooks = (item.related?.ebookSlugs ?? []).filter(Boolean).slice(0, 2);
  const apps = (item.related?.appSlugs ?? []).filter(Boolean).slice(0, 2);
  return { knowledge, ebooks, apps };
}

export function hasRelatedLinks(item: ContentCatalogItem): boolean {
  const r = relatedLinkTargets(item);
  return r.knowledge.length + r.ebooks.length + r.apps.length > 0;
}
