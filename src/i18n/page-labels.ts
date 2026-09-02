import type { Locale } from "@/i18n/config";

export const serviceLabels: Record<Locale, Record<string, { title: string; description: string }>> = {
  ko: {},
  en: {
    "industrial-automation": {
      title: "Industrial automation software",
      description: "Monitoring, PLC integration, MES, and data acquisition for real factory floors.",
    },
    "app-development": {
      title: "App development",
      description: "Business, productivity, and industrial apps—from planning through release.",
    },
    "web-development": {
      title: "Web & site development",
      description: "Corporate, marketing, and knowledge sites built as digital business assets.",
    },
    "ebook-development": {
      title: "E-book development",
      description: "Planning, writing, design, and multi-channel publishing for e-books.",
    },
    "content-development": {
      title: "Content development",
      description: "Video, music, shorts, and promotional content production.",
    },
  },
};

export const pageLabels: Record<
  Locale,
  Record<string, { title: string; description: string; eyebrow?: string }>
> = {
  ko: {
    process: { eyebrow: "Process", title: "제작 과정", description: "SotongWare는 단순 생성이 아니라 기획·제작·검수·배포까지 체계적인 과정으로 결과물을 만듭니다." },
    guide: { title: "이용 안내", description: "SotongWare 서비스 이용 방식을 안내합니다." },
    services: { title: "Services", description: "SotongWare의 핵심 제작 서비스입니다." },
    products: { title: "디지털 상품", description: "SotongWare가 제작·운영하는 디지털 상품 목록입니다." },
    works: { title: "결과물", description: "분야별 제작 결과물을 확인합니다." },
    solutions: { title: "솔루션", description: "목적별 솔루션 안내입니다." },
    privacy: { title: "개인정보처리방침", description: "SotongWare 개인정보처리방침" },
    terms: { title: "이용약관", description: "SotongWare 이용약관" },
  },
  en: {
    process: { eyebrow: "Process", title: "How we build", description: "SotongWare follows a structured path from planning through validation and deployment—not one-shot generation." },
    guide: { title: "Usage guide", description: "How to use SotongWare services, access levels, and support channels." },
    services: { title: "Services", description: "SotongWare core production services." },
    products: { title: "Digital products", description: "Products built and operated by SotongWare." },
    works: { title: "Portfolio", description: "Outcomes by business area." },
    solutions: { title: "Solutions", description: "Goal-oriented solution guides." },
    privacy: { title: "Privacy policy", description: "SotongWare privacy policy" },
    terms: { title: "Terms of use", description: "SotongWare terms of use" },
  },
};

export const worksCopy: Record<
  Locale,
  Record<"empty" | "single" | "few" | "many", { eyebrow: string; title: string; description: string; catalogNote: string }>
> = {
  ko: {
    empty: {
      eyebrow: "SotongWare Works",
      title: "새로운 결과물을 준비하고 있습니다",
      description: "SotongWare에서 제작·검증을 마친 제품과 콘텐츠만 이곳에 공개합니다. 가짜 데이터는 등록하지 않습니다.",
      catalogNote: "모든 결과물은 중앙 Product 데이터에서 자동 표시됩니다.",
    },
    single: {
      eyebrow: "SotongWare Works",
      title: "직접 만들고 검증하는 결과물",
      description: "현재 공개 중인 SotongWare 디지털 제품입니다.",
      catalogNote: "모든 결과물은 중앙 Product 데이터에서 자동 표시됩니다.",
    },
    few: {
      eyebrow: "SotongWare Works",
      title: "직접 만들고 검증하는 결과물",
      description: "SotongWare에서 실제 제작·검증 중인 제품과 콘텐츠를 공개합니다.",
      catalogNote: "모든 결과물은 중앙 Product 데이터에서 자동 표시됩니다.",
    },
    many: {
      eyebrow: "SotongWare Works",
      title: "SotongWare 결과물",
      description: "앱, 전자책, 교육, 콘텐츠, 자동화 — 실제 제작·검증된 결과물 카탈로그입니다.",
      catalogNote: "모든 결과물은 중앙 Product 데이터에서 자동 표시됩니다.",
    },
  },
  en: {
    empty: {
      eyebrow: "SotongWare Works",
      title: "New outcomes are in preparation",
      description: "Only products and content validated by SotongWare appear here—we do not publish placeholder data.",
      catalogNote: "All entries sync from the central product catalog.",
    },
    single: {
      eyebrow: "SotongWare Works",
      title: "Built and validated by us",
      description: "The digital product we currently publish.",
      catalogNote: "All entries sync from the central product catalog.",
    },
    few: {
      eyebrow: "SotongWare Works",
      title: "Built and validated by us",
      description: "Products and content actively produced and reviewed by SotongWare.",
      catalogNote: "All entries sync from the central product catalog.",
    },
    many: {
      eyebrow: "SotongWare Works",
      title: "SotongWare portfolio",
      description: "Apps, e-books, learning, content, and automation—verified outcomes in one catalog.",
      catalogNote: "All entries sync from the central product catalog.",
    },
  },
};

export const workCategories: Record<Locale, { slug: string; title: string; description: string }[]> = {
  ko: [
    { slug: "apps", title: "앱", description: "SotongWare가 개발한 앱 목록" },
    { slug: "ebooks", title: "전자책", description: "SotongWare 전자책 목록" },
    { slug: "websites", title: "웹사이트", description: "SotongWare 웹사이트 목록" },
    { slug: "automation", title: "자동화", description: "산업자동화 프로그램 목록" },
    { slug: "content", title: "콘텐츠", description: "음악, Shorts, 영상 콘텐츠" },
  ],
  en: [
    { slug: "apps", title: "Apps", description: "Apps developed by SotongWare" },
    { slug: "ebooks", title: "E-books", description: "E-books published by SotongWare" },
    { slug: "websites", title: "Websites", description: "Websites built by SotongWare" },
    { slug: "automation", title: "Automation", description: "Industrial automation software" },
    { slug: "content", title: "Content", description: "Music, shorts, and video content" },
  ],
};

export const solutionItems: Record<Locale, { slug: string; title: string; description: string }[]> = {
  ko: [
    { slug: "digital-business", title: "디지털 사업", description: "온라인 사업 구축 솔루션" },
    { slug: "business-automation", title: "업무 자동화", description: "업무 자동화 솔루션" },
    { slug: "ai-utilization", title: "AI 활용", description: "AI 활용 솔루션" },
    { slug: "industrial-solutions", title: "산업 솔루션", description: "산업 솔루션" },
  ],
  en: [
    { slug: "digital-business", title: "Digital business", description: "Launch and grow online ventures" },
    { slug: "business-automation", title: "Business automation", description: "Automate operations and workflows" },
    { slug: "ai-utilization", title: "AI utilization", description: "Practical AI in production workflows" },
    { slug: "industrial-solutions", title: "Industrial solutions", description: "Software for factory and field operations" },
  ],
};

export const placeholderLabels: Record<Locale, { skeletonNote: string; backToList: string; backHome: string }> = {
  ko: {
    skeletonNote: "이 페이지는 확장 가능한 라우트로 준비되어 있으며, 콘텐츠는 순차적으로 추가됩니다.",
    backToList: "목록으로",
    backHome: "홈으로",
  },
  en: {
    skeletonNote: "This route is prepared for expansion; content will be added in phases.",
    backToList: "Back to list",
    backHome: "Back to home",
  },
};
