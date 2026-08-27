import type { NavItem } from "@/types";

export const siteConfig = {
  name: "SotongWare",
  nameKo: "소통웨어",
  description:
    "산업자동화, 앱, 웹, 전자책, 콘텐츠를 만들고 연결하여 실제 문제를 해결하는 기술 기반 디지털 제작 회사",
  url: "https://sotongware.com",
  locale: "ko_KR",
};

export const mainNavigation: NavItem[] = [
  { label: "Services", href: "/services", description: "제작 서비스" },
  { label: "Works", href: "/works", description: "결과물" },
  { label: "Solutions", href: "/solutions", description: "솔루션" },
  { label: "Insights", href: "/insights", description: "인사이트" },
  { label: "About", href: "/about", description: "소개" },
];

export const footerNavigation = {
  services: [
    { label: "산업자동화", href: "/services/industrial-automation" },
    { label: "앱 개발", href: "/services/app-development" },
    { label: "웹 개발", href: "/services/web-development" },
    { label: "전자책", href: "/services/ebook-development" },
    { label: "콘텐츠", href: "/services/content-development" },
  ],
  works: [
    { label: "앱", href: "/works/apps" },
    { label: "전자책", href: "/works/ebooks" },
    { label: "웹사이트", href: "/works/websites" },
    { label: "자동화", href: "/works/automation" },
    { label: "콘텐츠", href: "/works/content" },
  ],
  insights: [
    { label: "기술자료", href: "/insights/tech" },
    { label: "산업자동화", href: "/insights/industrial" },
    { label: "앱·웹", href: "/insights/digital" },
  ],
  company: [
    { label: "소개", href: "/about" },
    { label: "문의", href: "/contact" },
    { label: "AI 안내", href: "/ai-guide" },
  ],
  legal: [
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "이용약관", href: "/terms" },
  ],
};
