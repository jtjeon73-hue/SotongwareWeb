export const usageTypes = [
  {
    id: "free",
    title: "무료",
    description:
      "가입이나 결제 없이 이용할 수 있는 콘텐츠 또는 서비스입니다. 검색·소개를 통해 먼저 경험할 수 있습니다.",
    note: undefined,
  },
  {
    id: "member",
    title: "회원전용",
    description:
      "회원 가입 후 이용 가능한 추가 콘텐츠 또는 기능입니다.",
    note: "향후 제공 예정",
  },
  {
    id: "paid",
    title: "유료",
    description:
      "상품이나 콘텐츠를 한 번 구매하여 이용하는 방식입니다.",
    note: "결제 기능 준비 중",
  },
  {
    id: "subscription",
    title: "구독",
    description:
      "월 또는 일정 기간 단위로 프리미엄 콘텐츠나 서비스를 이용하는 방식입니다.",
    note: "향후 제공 예정",
  },
  {
    id: "consulting",
    title: "상담·제작",
    description:
      "정해진 상품을 구매하는 것이 아니라, 고객 요구사항을 확인해 제작 범위와 비용을 정하는 서비스입니다.",
    note: undefined,
  },
] as const;

export const usageFlows = [
  {
    id: "app",
    title: "앱",
    steps: [
      "SotongWare",
      "앱 전문사이트",
      "앱 확인",
      "Google Play 등 Store",
      "설치/이용",
    ],
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
    id: "content",
    title: "콘텐츠",
    steps: [
      "SotongWare",
      "콘텐츠 전문사이트",
      "음악/Shorts/영상 확인",
      "YouTube 또는 서비스 사이트",
      "재생/이용/향후 구매",
    ],
  },
  {
    id: "knowledge",
    title: "지식·교육",
    steps: [
      "SotongWare",
      "지식·교육 사이트",
      "무료 콘텐츠",
      "향후 회원",
      "유료",
      "구독",
    ],
  },
  {
    id: "automation",
    title: "산업자동화",
    steps: [
      "SotongWare",
      "산업자동화 전문사이트",
      "서비스 이해",
      "상담/견적",
    ],
  },
  {
    id: "marketing",
    title: "마케팅",
    steps: [
      "SotongWare",
      "마케팅 전문사이트",
      "서비스 확인",
      "홍보/마케팅 상담",
    ],
  },
] as const;
