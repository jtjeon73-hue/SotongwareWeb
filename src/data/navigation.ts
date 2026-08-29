import type { NavItem } from "@/types";

export const siteConfig = {
  name: "SotongWare",
  nameKo: "소통웨어",
  description:
    "산업자동화, 앱, 전자책, 지식·교육, 마케팅, 콘텐츠를 만들고 판매·배포하는 디지털 사업 플랫폼",
  url: "https://sotongware.com",
  locale: "ko_KR",
};

export const mainNavigation: NavItem[] = [
  { label: "Products", href: "/products", description: "디지털 상품" },
  { label: "Services", href: "/services", description: "제작 서비스" },
  { label: "Business", href: "/#business-hub-heading", description: "6대 사업" },
  { label: "About", href: "/about", description: "소개" },
];

export const businessNavigation: NavItem[] = [
  { label: "산업자동화", href: "/automation" },
  { label: "앱", href: "/apps" },
  { label: "전자책", href: "/ebooks" },
  { label: "지식·교육", href: "/knowledge" },
  { label: "마케팅", href: "/marketing" },
  { label: "콘텐츠", href: "/content" },
];

export const footerNavigation = {
  business: businessNavigation,
  products: [
    { label: "전체 상품", href: "/products" },
    { label: "앱", href: "/apps" },
    { label: "전자책", href: "/ebooks" },
    { label: "교육", href: "/knowledge" },
    { label: "콘텐츠", href: "/content" },
  ],
  services: [
    { label: "산업자동화", href: "/automation" },
    { label: "앱 개발", href: "/services/app-development" },
    { label: "전자책", href: "/services/ebook-development" },
    { label: "마케팅", href: "/marketing" },
    { label: "웹 개발", href: "/services/web-development" },
  ],
  company: [
    { label: "소개", href: "/about" },
    { label: "문의", href: "/contact" },
    { label: "목적별 안내", href: "/ai-guide" },
  ],
  legal: [
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "이용약관", href: "/terms" },
  ],
};
