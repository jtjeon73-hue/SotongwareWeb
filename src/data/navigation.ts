import type { NavItem } from "@/types";
import { businessAreas } from "@/data/businesses";

export const siteConfig = {
  name: "SotongWare",
  nameKo: "소통웨어",
  description:
    "산업자동화, 앱, 전자책, 지식·교육, 마케팅, 콘텐츠를 만들고 운영·판매하는 SotongWare 디지털 사업 플랫폼",
  url: "https://sotongware.com",
  locale: "ko_KR",
};

const serviceNavChildren: NavItem[] = businessAreas.map((area) => ({
  label: area.titleKo,
  href: area.internalPath,
}));

export const mainNavigation: NavItem[] = [
  {
    label: "서비스",
    href: "/services",
    children: serviceNavChildren,
  },
  { label: "디지털 상품", href: "/products" },
  { label: "지식·교육", href: "/knowledge" },
  { label: "포트폴리오", href: "/works" },
  { label: "SotongWare 소개", href: "/about" },
];

export const businessNavigation: NavItem[] = businessAreas.map((area) => ({
  label: area.titleKo,
  href: area.internalPath,
}));

export const footerNavigation = {
  externalServices: businessAreas
    .filter((area) => area.externalSiteUrl && area.siteStatus !== "coming-soon")
    .map((area) => ({
      label: area.titleKo,
      href: area.externalSiteUrl!,
      external: true as const,
    })),
  products: [
    { label: "전체 상품", href: "/products" },
    { label: "앱", href: "/apps" },
    { label: "전자책", href: "/ebooks" },
    { label: "교육", href: "/knowledge" },
    { label: "콘텐츠", href: "/contents" },
  ],
  company: [
    { label: "소개", href: "/about" },
    { label: "문의", href: "/contact" },
  ],
  legal: [
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "이용약관", href: "/terms" },
  ],
};
