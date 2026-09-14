import type { ContentCatalogItem, ContentFormatId, LocalizedText } from "./types";

export const contentFormatLabels: Record<ContentFormatId, LocalizedText> = {
  shorts: { ko: "쇼츠", en: "Shorts" },
  comic: { ko: "만화", en: "Comics" },
  comicVideo: { ko: "만화영상", en: "Comic video" },
  music: { ko: "노래", en: "Music" },
  video: { ko: "일반 영상", en: "Video" },
  image: { ko: "이미지/그래픽", en: "Image / graphic" },
  other: { ko: "기타", en: "Other" },
};

export const contentFormats: ContentFormatId[] = [
  "shorts",
  "comic",
  "comicVideo",
  "music",
  "video",
  "image",
  "other",
];

/** Media library catalog — no fake view/subscriber/revenue counts. */
export const contentCatalog: ContentCatalogItem[] = [
  {
    slug: "factory-morning-short",
    sortOrder: 10,
    updatedAt: "2026-09-14",
    featured: true,
    title: { ko: "공장 아침 루틴 Short", en: "Factory morning routine short" },
    summary: {
      ko: "현장 출근 루틴을 짧게 보여주는 쇼츠 형식 Preview입니다.",
      en: "A short-form preview of a plant-floor morning routine.",
    },
    formatId: "shorts",
    theme: { ko: "산업 현장", en: "Plant floor" },
    accessTier: "free",
    status: "live",
    channel: { ko: "SotongWare Shorts Preview", en: "SotongWare Shorts Preview" },
    coverTone: "rose",
  },
  {
    slug: "sotong-cat-episode-1",
    sortOrder: 20,
    updatedAt: "2026-09-14",
    title: { ko: "소통냥 에피소드 1", en: "Sotong Cat episode 1" },
    summary: {
      ko: "만화 컷 구성 Preview — 실제 연재 채널 연결 전 샘플입니다.",
      en: "Comic-panel preview sample before live channel linking.",
    },
    formatId: "comic",
    theme: { ko: "캐릭터", en: "Characters" },
    accessTier: "free",
    status: "preparing",
    channel: { ko: "콘텐츠 허브 Preview", en: "Content hub preview" },
    coverTone: "amber",
  },
  {
    slug: "comic-motion-teaser",
    sortOrder: 30,
    updatedAt: "2026-09-13",
    title: { ko: "만화영상 티저", en: "Comic-motion teaser" },
    summary: {
      ko: "만화영상 형식의 티저 카드입니다. 조회수 수치는 표시하지 않습니다.",
      en: "A comic-motion teaser card. No view counts are shown.",
    },
    formatId: "comicVideo",
    theme: { ko: "스토리", en: "Story" },
    accessTier: "member",
    status: "preparing",
    channel: { ko: "회원 Preview 채널", en: "Member preview channel" },
    coverTone: "violet",
  },
  {
    slug: "morning-focus-track",
    sortOrder: 40,
    updatedAt: "2026-09-12",
    title: { ko: "모닝 포커스 트랙", en: "Morning focus track" },
    summary: {
      ko: "작업용 짧은 음악 트랙 Preview입니다.",
      en: "A short work-focus music track preview.",
    },
    formatId: "music",
    theme: { ko: "음악", en: "Music" },
    accessTier: "free",
    status: "live",
    channel: { ko: "Sotong Music Preview", en: "Sotong Music Preview" },
    coverTone: "sky",
  },
  {
    slug: "remote-ops-explain",
    sortOrder: 50,
    updatedAt: "2026-09-11",
    title: { ko: "원격관제 설명 영상", en: "Remote ops explainer" },
    summary: {
      ko: "일반 영상 형식의 설명 콘텐츠 Preview입니다.",
      en: "A standard video explainer preview.",
    },
    formatId: "video",
    theme: { ko: "자동화", en: "Automation" },
    accessTier: "member",
    status: "preparing",
    channel: { ko: "지식·콘텐츠 교차 Preview", en: "Knowledge × content preview" },
    coverTone: "emerald",
  },
  {
    slug: "brand-poster-set",
    sortOrder: 60,
    updatedAt: "2026-09-10",
    title: { ko: "브랜드 포스터 세트", en: "Brand poster set" },
    summary: {
      ko: "이미지/그래픽 결과물 자리 표시용 카드입니다.",
      en: "Placeholder card for image/graphic deliverables.",
    },
    formatId: "image",
    theme: { ko: "브랜드", en: "Brand" },
    accessTier: "premium",
    status: "comingSoon",
    channel: { ko: "프리미엄 Preview", en: "Premium preview" },
    coverTone: "slate",
  },
];

export function getContentCatalog(formatId?: ContentFormatId): ContentCatalogItem[] {
  const list = [...contentCatalog].sort((a, b) => a.sortOrder - b.sortOrder);
  return formatId ? list.filter((c) => c.formatId === formatId) : list;
}

export function getContentBySlug(slug: string): ContentCatalogItem | undefined {
  return contentCatalog.find((c) => c.slug === slug);
}

export function contentCatalogSlugs(): string[] {
  return contentCatalog.map((c) => c.slug);
}
