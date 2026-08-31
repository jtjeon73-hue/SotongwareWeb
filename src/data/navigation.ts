import type { NavItem } from "@/types";
import { businessAreas } from "@/data/businesses";
import { canExposeExternalSiteLink } from "@/data/business-access";
import { getPublicExternalSiteUrl } from "@/lib/business-sites";

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
  { label: "제작 과정", href: "/process" },
  { label: "이용 안내", href: "/guide" },
  { label: "SotongWare 소개", href: "/about" },
];

export const businessNavigation: NavItem[] = businessAreas.map((area) => ({
  label: area.titleKo,
  href: area.internalPath,
}));

export const footerNavigation = {
  externalServices: businessAreas
    .filter(
      (area) =>
        canExposeExternalSiteLink(area.id) &&
        getPublicExternalSiteUrl(area) &&
        area.siteStatus !== "coming-soon",
    )
    .map((area) => ({
      label: area.titleKo,
      href: getPublicExternalSiteUrl(area)!,
      external: true as const,
    })),
  guide: [
    { label: "제작 과정", href: "/process" },
    { label: "서비스 이용 안내", href: "/guide" },
  ],
  company: [
    { label: "SotongWare 소개", href: "/about" },
    { label: "상담·제작 문의", href: "/contact" },
  ],
  legal: [
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "이용약관", href: "/terms" },
  ],
};
