import type { ServiceItem } from "@/types";

export const services: ServiceItem[] = [
  {
    id: "industrial-automation",
    slug: "industrial-automation",
    title: "산업자동화 소프트웨어",
    subtitle: "현장을 이해하는 산업 기술",
    description:
      "생산설비 모니터링, PLC 연동, MES 통합, 데이터 수집 등 실제 공장 현장에 맞는 산업용 프로그램을 개발합니다.",
    makesWhat: "설비 모니터링, PLC·MES 연동, 생산 데이터 수집 시스템",
    customerValue: "공장 운영을 실시간으로 보고, 수동 점검과 종이 기록을 줄입니다",
    valuePoints: [
      "설비 상태 실시간 모니터링",
      "생산 데이터 자동 수집·분석",
      "원격 관리 및 알림 체계",
    ],
    href: "/services/industrial-automation",
    worksHref: "/works/automation",
    icon: "factory",
    featured: true,
  },
  {
    id: "app-development",
    slug: "app-development",
    title: "앱 개발",
    subtitle: "업무와 생활을 연결하는 앱",
    description:
      "업무용·생산성·정보 제공·산업용 앱을 기획부터 출시까지 개발하고, Google Play 등 플랫폼 연동을 지원합니다.",
    makesWhat: "Android·Web App, 업무용·산업용·생활 편의 앱",
    customerValue: "아이디어를 실제 앱으로 출시하고 사용자가 다운로드·사용할 수 있게 합니다",
    valuePoints: [
      "Android 및 Web App 개발",
      "AI 기능 통합 가능",
      "출시·운영·수익화 구조 설계",
    ],
    href: "/services/app-development",
    worksHref: "/works/apps",
    icon: "app",
  },
  {
    id: "web-development",
    slug: "web-development",
    title: "웹·사이트 개발",
    subtitle: "검색과 사업이 되는 웹",
    description:
      "기업 홈페이지, 마케팅 사이트, 지식정보 사이트, 온라인 사업 플랫폼을 독립적인 디지털 자산으로 설계합니다.",
    makesWhat: "기업 홈페이지, 마케팅 사이트, 지식정보·웹서비스",
    customerValue: "검색 유입과 콘텐츠·상품 연결이 가능한 온라인 사업 기반을 만듭니다",
    valuePoints: [
      "SEO·유입 구조 최적화",
      "콘텐츠·상품 연결 설계",
      "24시간 자동 운영 가능 구조",
    ],
    href: "/services/web-development",
    worksHref: "/works/websites",
    icon: "web",
  },
  {
    id: "ebook-development",
    slug: "ebook-development",
    title: "전자책 개발",
    subtitle: "지식을 상품으로",
    description:
      "주제 기획부터 집필, 편집, 디자인, PDF/ePub 제작까지 전자책을 완성하고 여러 판매 채널에 연결합니다.",
    makesWhat: "PDF·ePub 전자책, 표지·편집·판매용 상품",
    customerValue: "전문 지식을 전자책 상품으로 만들어 판매·홍보할 수 있습니다",
    valuePoints: [
      "전문 분야 전자책 기획·제작",
      "다중 판매 플랫폼 연동 구조",
      "관련 앱·콘텐츠와 연결",
    ],
    href: "/services/ebook-development",
    worksHref: "/works/ebooks",
    icon: "ebook",
  },
  {
    id: "content-development",
    slug: "content-development",
    title: "콘텐츠 개발",
    subtitle: "발견과 유입을 만드는 콘텐츠",
    description:
      "YouTube Shorts, 정보 영상, 음악, 이미지, 지식 콘텐츠를 제작하고 앱·전자책·사이트와 연결하는 순환 구조를 만듭니다.",
    makesWhat: "Shorts, 정보 영상, 음악, 이미지·지식 콘텐츠",
    customerValue: "콘텐츠로 발견·유입을 만들고 앱·전자책·사이트와 연결합니다",
    valuePoints: [
      "Shorts·영상·음악 제작",
      "플랫폼 자동 등록 구조",
      "디지털 자산 간 상호 홍보",
    ],
    href: "/services/content-development",
    worksHref: "/works/content",
    icon: "content",
  },
];
