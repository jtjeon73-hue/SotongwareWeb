import type { Locale } from "./config";

export const guideLabels: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
    usageTypesTitle: string;
    usageFlowsTitle: string;
    usageFlowsDescription: string;
    nextStepSr: string;
    ctaProcess: string;
    ctaServices: string;
    ctaContact: string;
    usageTypes: { id: string; title: string; description: string; note?: string }[];
    usageFlows: { id: string; title: string; steps: string[] }[];
  }
> = {
  ko: {
    eyebrow: "Guide",
    title: "서비스 이용 안내",
    description:
      "SotongWare와 각 전문 사이트의 이용 방식 차이를 이해하고, 필요한 서비스로 이동할 수 있습니다.",
    usageTypesTitle: "이용 유형",
    usageFlowsTitle: "분야별 이용 흐름",
    usageFlowsDescription: "SotongWare 중앙 허브에서 각 전문 사이트·플랫폼으로 이어지는 경로입니다.",
    nextStepSr: "다음 단계",
    ctaProcess: "제작 과정 보기",
    ctaServices: "6대 서비스 보기",
    ctaContact: "상담·제작 문의",
    usageTypes: [
      {
        id: "free",
        title: "무료",
        description:
          "가입이나 결제 없이 이용할 수 있는 콘텐츠 또는 서비스입니다. 검색·소개를 통해 먼저 경험할 수 있습니다.",
      },
      {
        id: "member",
        title: "회원전용",
        description: "회원 가입 후 이용 가능한 추가 콘텐츠 또는 기능입니다.",
        note: "향후 제공 예정",
      },
      {
        id: "paid",
        title: "유료",
        description: "상품이나 콘텐츠를 한 번 구매하여 이용하는 방식입니다.",
        note: "결제 기능 준비 중",
      },
      {
        id: "subscription",
        title: "구독",
        description: "월 또는 일정 기간 단위로 프리미엄 콘텐츠나 서비스를 이용하는 방식입니다.",
        note: "향후 제공 예정",
      },
      {
        id: "consulting",
        title: "상담·제작",
        description:
          "정해진 상품을 구매하는 것이 아니라, 고객 요구사항을 확인해 제작 범위와 비용을 정하는 서비스입니다.",
      },
    ],
    usageFlows: [
      {
        id: "app",
        title: "앱",
        steps: ["SotongWare", "앱 전문사이트", "앱 확인", "Google Play 등 Store", "설치/이용"],
      },
      {
        id: "ebook",
        title: "전자책",
        steps: [
          "SotongWare",
          "전자책 전문사이트",
          "책 확인",
          "전자책 판매 플랫폼 또는 자체 판매",
          "구매/열람",
        ],
      },
      {
        id: "site",
        title: "사이트",
        steps: ["SotongWare", "사이트 전문 영역", "서비스 확인", "상담·제작", "배포·운영"],
      },
      {
        id: "content",
        title: "콘텐츠",
        steps: ["SotongWare", "콘텐츠 허브", "채널·작품 확인", "플랫폼 시청", "구독·후원"],
      },
      {
        id: "knowledge",
        title: "지식·교육",
        steps: ["SotongWare", "지식·교육 허브", "무료·회원 콘텐츠", "회원 포털", "학습·실습"],
      },
      {
        id: "automation",
        title: "산업자동화",
        steps: ["SotongWare", "자동화 역량", "상담·요구분석", "설계·개발", "현장 검증·운영"],
      },
    ],
  },
  en: {
    eyebrow: "Guide",
    title: "How to use SotongWare",
    description:
      "Understand how the central hub connects to specialized sites and platforms, then move to the service you need.",
    usageTypesTitle: "Access types",
    usageFlowsTitle: "Flows by business area",
    usageFlowsDescription: "Paths from the SotongWare hub to each specialized site or platform.",
    nextStepSr: "Next step",
    ctaProcess: "View our process",
    ctaServices: "Explore services",
    ctaContact: "Contact us",
    usageTypes: [
      {
        id: "free",
        title: "Free",
        description:
          "Content or services you can use without sign-up or payment. Discover through search and introductions first.",
      },
      {
        id: "member",
        title: "Members only",
        description: "Additional content or features available after creating an account.",
        note: "Coming soon",
      },
      {
        id: "paid",
        title: "Paid",
        description: "One-time purchase of a product or content item.",
        note: "Checkout in preparation",
      },
      {
        id: "subscription",
        title: "Subscription",
        description: "Premium content or services on a monthly or recurring basis.",
        note: "Coming soon",
      },
      {
        id: "consulting",
        title: "Consulting & production",
        description:
          "Custom engagements where scope and cost are defined after understanding your requirements—not fixed catalog purchases.",
      },
    ],
    usageFlows: [
      {
        id: "app",
        title: "Apps",
        steps: ["SotongWare", "App hub", "Review apps", "App stores", "Install & use"],
      },
      {
        id: "ebook",
        title: "E-books",
        steps: ["SotongWare", "E-book hub", "Browse titles", "Retail or direct sales", "Purchase & read"],
      },
      {
        id: "site",
        title: "Websites",
        steps: ["SotongWare", "Site services", "Review offerings", "Consult & build", "Launch & operate"],
      },
      {
        id: "content",
        title: "Content",
        steps: ["SotongWare", "Content hub", "Channels & works", "Platforms", "Watch & subscribe"],
      },
      {
        id: "knowledge",
        title: "Knowledge & education",
        steps: ["SotongWare", "Learning hub", "Free & member content", "Member portal", "Learn & practice"],
      },
      {
        id: "automation",
        title: "Industrial automation",
        steps: ["SotongWare", "Automation capabilities", "Consult & scope", "Design & build", "Validate & operate"],
      },
    ],
  },
};
