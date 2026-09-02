import type { Locale } from "./config";
import type { AccessMode, ProductStatus } from "@/types/product";
import type { RevenueDisplayBadge } from "@/lib/commerce";
import type { ProductCountTier } from "@/lib/product-catalog";

export const STATUS_LABELS: Record<Locale, Record<ProductStatus, string>> = {
  ko: {
    draft: "준비 중",
    testing: "테스트 중",
    ready: "출시 준비",
    published: "이용 가능",
    archived: "서비스 종료",
  },
  en: {
    draft: "In preparation",
    testing: "In testing",
    ready: "Preparing for launch",
    published: "Available",
    archived: "Discontinued",
  },
};

export const ACCESS_LABELS: Record<Locale, Record<AccessMode, string>> = {
  ko: {
    free: "무료",
    member: "회원전용",
    paid: "유료",
    subscription: "구독",
    inquiry: "상담",
  },
  en: {
    free: "Free",
    member: "Members only",
    paid: "Paid",
    subscription: "Subscription",
    inquiry: "Consultation",
  },
};

export const REVENUE_BADGE_LABELS: Record<Locale, Record<RevenueDisplayBadge, string>> = {
  ko: {
    free: "무료",
    paid: "유료",
    subscription: "구독",
    inquiry: "상담",
    member: "회원전용",
    launch_preparing: "출시 준비",
    on_sale: "판매 중",
    testing: "테스트 중",
  },
  en: {
    free: "Free",
    paid: "Paid",
    subscription: "Subscription",
    inquiry: "Consultation",
    member: "Members only",
    launch_preparing: "Launch prep",
    on_sale: "On sale",
    testing: "In testing",
  },
};

export const APP_RELEASE_LABELS: Record<Locale, Record<string, string>> = {
  ko: {
    development: "개발 중",
    testing: "테스트 중",
    ready: "출시 준비 중",
    "play-store": "Play Store 등록",
    live: "서비스 중",
    "update-planned": "업데이트 예정",
  },
  en: {
    development: "In development",
    testing: "In testing",
    ready: "Preparing for launch",
    "play-store": "Play Store listing",
    live: "Live",
    "update-planned": "Update planned",
  },
};

export const catalogUi: Record<
  Locale,
  {
    heroEyebrow: string;
    heroTitle: string;
    heroDescription: string;
    featuredTitle: string;
    featuredDescriptionSingle: string;
    featuredDescriptionMulti: string;
    preparingTitle: string;
    preparingDescription: string;
    recentTitle: string;
    pipelineTitle: string;
    pipelineDescription: string;
    searchLabel: string;
    searchPlaceholder: string;
    typeLabel: string;
    accessLabel: string;
    typeAll: string;
    accessAll: string;
    productCount: (n: number) => string;
    types: Record<string, string>;
    problemLabel: string;
    featuresLabel: string;
    audienceLabel: string;
    statusLabel: string;
    viewDetails: string;
    exploreVentures: string;
    contactApps: string;
    freeAfterLaunch: string;
    priceInquiry: string;
    priceConsult: string;
    commercePreparing: string;
    commerceActive: string;
    commercePaused: string;
    channelInquiry: string;
  }
> = {
  ko: {
    heroEyebrow: "Product Catalog",
    heroTitle: "디지털 상품",
    heroDescription:
      "검증된 디지털 결과물만 공개합니다. 품질·정책 검토를 완료한 제품만 이곳에 표시됩니다.",
    featuredTitle: "현재 공개 중인 제품",
    featuredDescriptionSingle: "현재 공개 중인 SotongWare 디지털 제품입니다.",
    featuredDescriptionMulti: "실제 제작·검증 중이거나 공개된 제품입니다.",
    preparingTitle: "새로 준비 중",
    preparingDescription: "출시 전 검증·준비 단계의 제품입니다.",
    recentTitle: "최근 업데이트",
    pipelineTitle: "다음 출시 준비 영역",
    pipelineDescription: "가짜 상품 없이 사업 부문별 준비 상태만 표시합니다.",
    searchLabel: "상품 검색",
    searchPlaceholder: "상품명, 설명, 태그 검색...",
    typeLabel: "유형",
    accessLabel: "접근",
    typeAll: "전체",
    accessAll: "전체",
    productCount: (n) => `${n}개 상품`,
    types: {
      all: "전체",
      app: "앱",
      ebook: "전자책",
      knowledge: "교육",
      content: "콘텐츠",
      automation: "자동화",
      marketing: "마케팅",
    },
    problemLabel: "해결하는 문제",
    featuresLabel: "핵심 기능",
    audienceLabel: "대상 사용자",
    statusLabel: "현재 상태",
    viewDetails: "상세 보기",
    exploreVentures: "디지털 사업 둘러보기",
    contactApps: "앱 개발 문의",
    freeAfterLaunch: "출시 후 무료 예정",
    priceInquiry: "가격 문의",
    priceConsult: "상담 후 결정",
    commercePreparing: "출시 준비 중",
    commerceActive: "이용 가능",
    commercePaused: "일시 중단",
    channelInquiry: "앱 제작 문의",
  },
  en: {
    heroEyebrow: "Product Catalog",
    heroTitle: "Digital products",
    heroDescription:
      "We publish only verified digital products that passed quality and compliance review.",
    featuredTitle: "Available products",
    featuredDescriptionSingle: "The digital product we currently publish and validate.",
    featuredDescriptionMulti: "Products in validation or already available.",
    preparingTitle: "Coming next",
    preparingDescription: "Products in pre-launch validation.",
    recentTitle: "Recently updated",
    pipelineTitle: "Venture pipeline",
    pipelineDescription: "Preparation status by business area—no placeholder products.",
    searchLabel: "Search products",
    searchPlaceholder: "Search by name, description, or tags...",
    typeLabel: "Type",
    accessLabel: "Access",
    typeAll: "All",
    accessAll: "All",
    productCount: (n) => `${n} product${n === 1 ? "" : "s"}`,
    types: {
      all: "All",
      app: "Apps",
      ebook: "E-books",
      knowledge: "Education",
      content: "Content",
      automation: "Automation",
      marketing: "Marketing",
    },
    problemLabel: "Problem we address",
    featuresLabel: "Key features",
    audienceLabel: "Who it's for",
    statusLabel: "Current status",
    viewDetails: "View details",
    exploreVentures: "Explore digital ventures",
    contactApps: "Request app development",
    freeAfterLaunch: "Free after launch",
    priceInquiry: "Price on request",
    priceConsult: "Quoted after consultation",
    commercePreparing: "Preparing for launch",
    commerceActive: "Available",
    commercePaused: "Paused",
    channelInquiry: "App development inquiry",
  },
};

export const pipelineVentures: Record<
  Locale,
  { id: string; label: string; status: string; href: string }[]
> = {
  ko: [
    { id: "ebook", label: "전자책", status: "출시 준비", href: "/ebooks" },
    { id: "content", label: "콘텐츠", status: "출시 준비", href: "/contents" },
    { id: "knowledge", label: "지식·교육", status: "출시 준비", href: "/knowledge" },
    { id: "automation", label: "자동화 솔루션", status: "출시 준비", href: "/automation" },
  ],
  en: [
    { id: "ebook", label: "E-books", status: "Launch prep", href: "/ebooks" },
    { id: "content", label: "Content", status: "Launch prep", href: "/contents" },
    { id: "knowledge", label: "Knowledge & education", status: "Launch prep", href: "/knowledge" },
    { id: "automation", label: "Automation solutions", status: "Launch prep", href: "/automation" },
  ],
};

export const emptyStateLabels: Record<
  Locale,
  {
    catalog: string;
    catalogForType: (type: string) => string;
    title: string;
    description: string;
    note: string;
    criteriaTitle: string;
    criteriaItems: string[];
    pipelineTitle: string;
    ctaServices: string;
    ctaContact: string;
    ctaProducts: string;
  }
> = {
  ko: {
    catalog: "SotongWare Products",
    catalogForType: (type) => `${type} 카탈로그`,
    title: "검증된 디지털 결과물을 준비하고 있습니다",
    description:
      "품질과 정책 검토를 완료한 결과물만 공개합니다.",
    note: "앱, 전자책, 음악, 콘텐츠, 지식·교육, 산업·스마트팜 사례 — 검토 완료 후 순차 공개됩니다.",
    criteriaTitle: "공개 기준",
    criteriaItems: [
      "제작 완료 및 단계별 검증 PASS",
      "품질·저작권·정책·보안 검토 완료",
      "소통총관제 사용자 최종 승인",
    ],
    pipelineTitle: "준비 중인 분야",
    ctaServices: "사업부 둘러보기",
    ctaContact: "제작·상담 문의",
    ctaProducts: "포트폴리오 안내",
  },
  en: {
    catalog: "SotongWare Products",
    catalogForType: (type) => `${type} catalog`,
    title: "Our verified digital products are being prepared",
    description:
      "We publish only products that have completed quality and compliance review.",
    note: "Apps, e-books, music, content, knowledge, and industrial cases publish after review.",
    criteriaTitle: "Publication criteria",
    criteriaItems: [
      "Production complete with step validators passed",
      "Quality, copyright, policy, and security review complete",
      "Final user approval in SotongWare Control",
    ],
    pipelineTitle: "Areas in preparation",
    ctaServices: "Explore business areas",
    ctaContact: "Consultation & inquiry",
    ctaProducts: "Portfolio overview",
  },
};

export function getMerchandiseTitle(
  locale: Locale,
  tier: ProductCountTier,
  kind: "featured" | "preparing" | "recent",
): string {
  const ui = catalogUi[locale];
  if (kind === "featured") return ui.featuredTitle;
  if (kind === "preparing") return ui.preparingTitle;
  return ui.recentTitle;
}
