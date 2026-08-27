import type { GoalItem, ProcessStep, WhyPoint, TechnologyItem, EcosystemNode, AiGuideOption } from "@/types";

export const heroContent = {
  eyebrow: "산업자동화 · 앱 · 웹 · 전자책 · 콘텐츠",
  headline: "산업 기술부터 앱·웹·콘텐츠까지, 실제로 쓰이는 디지털 자산을 만듭니다",
  subheadline:
    "공장 자동화와 설비 모니터링, 앱·웹·전자책·Shorts 제작부터 배포·사업화까지 — SotongWare는 기술을 개발하고 연결하여 현장과 온라인에서 검증된 결과물을 만듭니다. 단순 AI 홍보가 아닌, 실제 문제를 해결하는 제작 회사입니다.",
  primaryCta: { label: "결과물 둘러보기", href: "/works" },
  secondaryCta: { label: "서비스 살펴보기", href: "/services" },
  highlights: [
    { label: "산업 현장 기술", desc: "PLC · MES · 설비 모니터링" },
    { label: "디지털 제작·배포", desc: "앱 · 웹 · 전자책 · 콘텐츠" },
    { label: "사업화까지 연결", desc: "검색 · 플랫폼 · 24시간 운영" },
  ],
};

export const whyFormula = [
  { label: "Industrial Field", labelKo: "산업 현장 이해" },
  { label: "Software Engineering", labelKo: "소프트웨어 개발" },
  { label: "AI Utilization", labelKo: "AI 활용" },
  { label: "Digital Content", labelKo: "디지털 콘텐츠" },
  { label: "Business Automation", labelKo: "사업 자동화" },
];

export const whyPoints: WhyPoint[] = [
  {
    title: "산업 현장을 이해합니다",
    description:
      "PLC, MES, Modbus 등 실제 공장 환경을 알고, 현장에 맞는 산업용 프로그램을 설계합니다. 웹에이전시와 다른 출발점입니다.",
  },
  {
    title: "제작부터 배포까지",
    description:
      "앱, 웹, 산업 프로그램을 기획·개발하고 Google Play, 웹 호스팅, 판매 채널까지 연결합니다.",
  },
  {
    title: "AI는 도구로 활용",
    description:
      "AI를 홍보 문구가 아닌, 업무 자동화·사용자 경험·콘텐츠 제작에 실제로 적용합니다.",
  },
  {
    title: "자산이 서로 홍보합니다",
    description:
      "앱, 전자책, 웹, 콘텐츠를 연결하여 하나의 결과물이 다른 결과물로 방문자를 이동시킵니다.",
  },
];

export const processSteps: ProcessStep[] = [
  { step: 1, title: "아이디어·문제", description: "해결할 문제와 목표를 정의합니다." },
  { step: 2, title: "분석", description: "현장·시장·기술 요구사항을 분석합니다." },
  { step: 3, title: "기획", description: "기능, 구조, 수익 모델을 설계합니다." },
  { step: 4, title: "제작", description: "소프트웨어·콘텐츠·디자인을 개발합니다." },
  { step: 5, title: "검수", description: "품질과 요구사항을 검증합니다." },
  { step: 6, title: "공개·출시", description: "플랫폼과 홈페이지에 공개합니다." },
  { step: 7, title: "홍보", description: "검색·SNS·콘텐츠로 유입을 확대합니다." },
  { step: 8, title: "성과·개선", description: "데이터를 분석하고 지속 개선합니다." },
];

export const exploreGoals: GoalItem[] = [
  {
    id: "automate",
    title: "공장·업무를 자동화하고 싶어요",
    description: "설비 모니터링, PLC 연동, 생산 데이터 수집·분석",
    href: "/services/industrial-automation",
    icon: "automation",
  },
  {
    id: "app",
    title: "앱을 만들거나 사용하고 싶어요",
    description: "업무용·산업용 앱 개발, 또는 SotongWare 앱 체험",
    href: "/services/app-development",
    icon: "app",
  },
  {
    id: "start-business",
    title: "온라인 사업을 시작하고 싶어요",
    description: "지식 사이트, 디지털 상품, 검색 유입 구조 설계",
    href: "/solutions/digital-business",
    icon: "business",
  },
  {
    id: "ebook",
    title: "전자책을 만들거나 보고 싶어요",
    description: "전자책 기획·제작, 또는 전문 분야 전자책 탐색",
    href: "/services/ebook-development",
    icon: "ebook",
  },
  {
    id: "website",
    title: "웹사이트를 만들고 싶어요",
    description: "기업 홈페이지, 마케팅 사이트, 웹서비스 개발",
    href: "/services/web-development",
    icon: "web",
  },
  {
    id: "enjoy-content",
    title: "영상·음악·콘텐츠를 보고 싶어요",
    description: "Shorts, 정보 영상, 음악, 지식 콘텐츠",
    href: "/works/content",
    icon: "media",
  },
];

export const technologies: TechnologyItem[] = [
  { id: "industrial", name: "Industrial Software", category: "산업" },
  { id: "plc", name: "PLC / MES", category: "산업" },
  { id: "modbus", name: "Modbus", category: "산업" },
  { id: "c-cpp", name: "C / C++", category: "개발" },
  { id: "web", name: "Web (React, Next.js)", category: "개발" },
  { id: "app", name: "Android / Web App", category: "개발" },
  { id: "ai", name: "AI 활용", category: "기술" },
  { id: "automation", name: "업무 자동화", category: "기술" },
  { id: "content", name: "콘텐츠 제작", category: "콘텐츠" },
];

export const ecosystemNodes: EcosystemNode[] = [
  { id: "apps", label: "Apps", description: "앱으로 직접 사용·체험" },
  { id: "ebooks", label: "E-books", description: "전자책으로 깊이 있는 지식" },
  { id: "websites", label: "Websites", description: "웹으로 검색·정보 유입" },
  { id: "content", label: "Content", description: "Shorts·영상·음악으로 발견" },
  { id: "automation", label: "Automation", description: "산업 프로그램으로 현장 해결" },
];

export const aiGuideOptions: AiGuideOption[] = [
  {
    id: "automation",
    label: "공장·설비 자동화가 필요해요",
    description: "산업자동화 서비스와 관련 기술 안내",
    href: "/services/industrial-automation",
  },
  {
    id: "app",
    label: "앱을 만들거나 사용하고 싶어요",
    description: "앱 개발 서비스 및 앱 카탈로그 안내",
    href: "/services/app-development",
  },
  {
    id: "website",
    label: "웹사이트·온라인 사업이 필요해요",
    description: "웹 개발과 디지털 사업 솔루션 안내",
    href: "/services/web-development",
  },
  {
    id: "ebook",
    label: "전자책이 필요해요",
    description: "전자책 기획·제작 서비스 안내",
    href: "/services/ebook-development",
  },
  {
    id: "unsure",
    label: "아직 잘 모르겠어요",
    description: "목적에 맞는 서비스와 솔루션 탐색",
    href: "/solutions",
  },
];

export const worksEmptyContent = {
  title: "첫 결과물들이 준비되고 있습니다",
  description:
    "앱, 전자책, 웹사이트, 산업 프로그램, 음악, Shorts가 제작·검수 완료되는 순서대로 이곳에 공개됩니다. 실제 결과물만 등록합니다.",
  pipeline: ["기획", "제작", "검수", "배포", "공개"],
  categories: ["앱", "전자책", "웹사이트", "자동화", "음악", "Shorts"],
};

export const finalCtaContent = {
  title: "지금 필요한 것부터 시작하세요",
  description:
    "결과물을 둘러보거나, 목적에 맞는 서비스를 찾아보세요. 직접 문의는 자동 안내로 해결되지 않을 때 선택하시면 됩니다.",
  actions: [
    { label: "서비스 살펴보기", href: "/services", variant: "primary" as const },
    { label: "목적별 안내", href: "/ai-guide", variant: "secondary" as const },
    { label: "결과물 보기", href: "/works", variant: "outline" as const },
    { label: "직접 문의하기", href: "/contact", variant: "outline" as const },
  ],
};
