import type { GoalItem, ProcessStep, WhyPoint, TechnologyItem, EcosystemNode, AiGuideOption } from "@/types";

export const heroContent = {
  headline: "기술로 만들고, 연결하여 운영되는 디지털 자산",
  subheadline:
    "산업자동화부터 앱·웹·전자책·콘텐츠까지 — SotongWare는 실제 문제를 해결하는 기술과 결과물을 만들고, 검색과 플랫폼을 통해 지속적인 가치를 만듭니다.",
  primaryCta: { label: "결과물 둘러보기", href: "/works" },
  secondaryCta: { label: "서비스 살펴보기", href: "/services" },
};

export const whyPoints: WhyPoint[] = [
  {
    title: "산업 현장 이해",
    description:
      "PLC, MES, Modbus 등 실제 공장 환경을 이해하고 현장에 맞는 소프트웨어를 설계합니다.",
  },
  {
    title: "풀스택 개발 역량",
    description:
      "앱, 웹, 산업용 프로그램을 하나의 팀에서 기획·개발·운영까지 담당합니다.",
  },
  {
    title: "AI 활용 설계",
    description:
      "AI를 단순 홍보가 아닌, 실제 업무 자동화와 사용자 경험 개선에 적용합니다.",
  },
  {
    title: "디지털 자산 연결",
    description:
      "앱, 전자책, 웹, 콘텐츠를 서로 연결하여 하나의 결과물이 다른 결과물을 홍보하는 구조를 만듭니다.",
  },
  {
    title: "온라인 사업화",
    description:
      "검색 유입, 플랫폼 배포, 수익화 구조를 함께 설계하여 24시간 운영되는 사업 기반을 구축합니다.",
  },
  {
    title: "자동화 운영",
    description:
      "제작부터 배포, 홈페이지 등록, 홍보까지 자동화 가능한 파이프라인을 지향합니다.",
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
    title: "업무를 자동화하고 싶어요",
    description: "공장·사무 업무 자동화, 설비 모니터링, 데이터 수집",
    href: "/services/industrial-automation",
    icon: "automation",
  },
  {
    id: "use-app",
    title: "앱을 사용해보고 싶어요",
    description: "SotongWare가 만든 앱을 다운로드하고 체험",
    href: "/works/apps",
    icon: "app",
  },
  {
    id: "start-business",
    title: "온라인 사업을 시작하고 싶어요",
    description: "웹사이트, 지식 사이트, 디지털 상품 사업 구축",
    href: "/solutions/digital-business",
    icon: "business",
  },
  {
    id: "read-ebook",
    title: "전자책을 보고 싶어요",
    description: "전문 분야 전자책 둘러보기",
    href: "/works/ebooks",
    icon: "ebook",
  },
  {
    id: "find-info",
    title: "유용한 정보를 찾고 있어요",
    description: "기술자료, 산업 정보, 인사이트",
    href: "/insights",
    icon: "info",
  },
  {
    id: "enjoy-content",
    title: "음악이나 영상을 보고 싶어요",
    description: "Shorts, 음악, 영상 콘텐츠",
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
    description: "산업자동화 서비스와 관련 결과물을 안내합니다.",
    href: "/services/industrial-automation",
  },
  {
    id: "app",
    label: "앱을 만들고 싶어요",
    description: "앱 개발 서비스와 기존 앱을 추천합니다.",
    href: "/services/app-development",
  },
  {
    id: "website",
    label: "웹사이트·온라인 사업이 필요해요",
    description: "웹 개발과 디지털 사업 솔루션을 안내합니다.",
    href: "/services/web-development",
  },
  {
    id: "unsure",
    label: "아직 잘 모르겠어요",
    description: "목적에 맞는 서비스를 찾아드립니다.",
    href: "/solutions",
  },
];

export const finalCtaContent = {
  title: "지금 필요한 것부터 시작하세요",
  description:
    "상담 전에 결과물을 둘러보거나, 목적에 맞는 서비스를 찾아보세요. SotongWare는 24시간 자동으로 안내할 수 있는 구조를 만들고 있습니다.",
  actions: [
    { label: "결과물 보기", href: "/works", variant: "primary" as const },
    { label: "내게 맞는 서비스 찾기", href: "/solutions", variant: "secondary" as const },
    { label: "AI 안내 받기", href: "/ai-guide", variant: "secondary" as const },
    { label: "직접 문의하기", href: "/contact", variant: "outline" as const },
  ],
};
