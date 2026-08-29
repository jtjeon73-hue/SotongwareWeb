import type { MarketingTier } from "@/types/product";
import type { SotongProduct } from "@/types/product";

export const marketingProducts: SotongProduct[] = [];

export const marketingServices = [
  { id: "homepage", title: "홈페이지 홍보", description: "기업·브랜드 홈페이지 제작 및 홍보 구조 설계" },
  { id: "seo", title: "SEO", description: "검색 유입 구조, 메타데이터, 콘텐츠 SEO" },
  { id: "content-marketing", title: "콘텐츠 마케팅", description: "블로그, Shorts, 정보 콘텐츠 기반 유입" },
  { id: "shorts", title: "YouTube Shorts 제작", description: "Shorts 기획·제작·채널 연동" },
  { id: "promo-video", title: "홍보 영상 제작", description: "제품·서비스 홍보 영상" },
  { id: "landing", title: "랜딩페이지 제작", description: "전환 중심 랜딩페이지" },
  { id: "digital-product", title: "디지털 상품 홍보", description: "앱·전자책·온라인 상품 홍보" },
  { id: "brand-content", title: "브랜드 콘텐츠", description: "브랜드 스토리·콘텐츠 체계" },
  { id: "ad-content", title: "광고용 콘텐츠", description: "광고·캠페인용 크리에이티브" },
  { id: "ai-marketing", title: "AI 기반 마케팅 제작", description: "AI 활용 콘텐츠·자동화 마케팅" },
];

export const marketingTiers: MarketingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "기본 홍보 — 웹·콘텐츠 기초",
    features: ["홈페이지/랜딩 기본 구조", "SEO 기본 설정", "콘텐츠 1종 기획"],
    priceLabel: "상담 후 결정",
  },
  {
    id: "growth",
    name: "Growth",
    description: "콘텐츠 + SEO — 유입 확대",
    features: ["Starter 포함", "정기 콘텐츠 제작", "Shorts/영상 연동", "검색·SNS 유입 구조"],
    priceLabel: "상담 후 결정",
  },
  {
    id: "business",
    name: "Business",
    description: "사이트 + 콘텐츠 + 홍보 통합",
    features: ["Growth 포함", "브랜드 콘텐츠 체계", "디지털 상품 홍보", "전환·성과 추적 구조"],
    priceLabel: "상담 후 결정",
  },
];
