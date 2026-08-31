import type { ProcessStep, GoalItem, TechnologyItem, EcosystemNode, AiGuideOption, WhyPoint } from "@/types";

export const heroContent = {
  eyebrow: "INDUSTRIAL × DIGITAL BUSINESS",
  headline:
    "현장의 기술을, 사용되는 디지털 제품과 서비스로 만듭니다",
  subheadline:
    "산업자동화부터 앱·웹·전자책·지식서비스·콘텐츠까지. SotongWare가 직접 만들고 운영하며 고객의 사업과 일상에 연결합니다.",
  ctas: [
    { label: "서비스 찾기", href: "/#business-hub-heading", variant: "primary" as const },
    { label: "제작 과정", href: "/process", variant: "secondary" as const },
    { label: "제작 상담", href: "/contact", variant: "secondary" as const },
  ],
  highlights: [
    { label: "6대 전문 서비스", desc: "내부 소개 + 전문 사이트 직접 연결" },
    { label: "체계적인 제작", desc: "기획 → 제작 → 검증 → 배포" },
    { label: "이용 방식 안내", desc: "무료 · 회원 · 유료 · 상담·제작" },
  ],
};

export const whyFormula = [
  { label: "Industrial Field", labelKo: "산업 현장 이해" },
  { label: "Software Engineering", labelKo: "소프트웨어 개발" },
  { label: "AI Utilization", labelKo: "AI 활용" },
  { label: "Digital Product", labelKo: "디지털 제품화" },
  { label: "Business Connection", labelKo: "사업 연결" },
];

export const whyPoints: WhyPoint[] = [
  {
    title: "현장에서 출발한 기술",
    description:
      "산업자동화·설비·소프트웨어 기반의 실전 기술로 출발합니다. PLC, MES, Modbus 등 현장 기술을 이해합니다.",
  },
  {
    title: "직접 제작",
    description:
      "앱·웹·전자책·지식·콘텐츠를 실제 디지털 제품으로 제작합니다. 만들고 끝내지 않고 배포·운영까지 연결합니다.",
  },
  {
    title: "체계적인 과정",
    description:
      "기획 → 제작 → 검증 → 배포. 고객이 이해하기 쉬운 단계로 제작 과정을 운영합니다.",
  },
  {
    title: "하나의 브랜드, 여러 전문 서비스",
    description:
      "SotongWare에서 6대 전문 서비스를 연결합니다. 필요한 분야의 전문 사이트로 자연스럽게 이동할 수 있습니다.",
  },
  {
    title: "제작 후에도 이어지는 구조",
    description:
      "Play Store, 전자책 플랫폼, 웹사이트, 콘텐츠 채널, 자체 서비스 등 실제 이용처까지 확장 가능한 구조입니다.",
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
    href: "/automation",
    icon: "automation",
  },
  {
    id: "app",
    title: "앱을 만들거나 사용하고 싶어요",
    description: "업무용·산업용 앱 개발, 또는 SotongWare 앱 체험",
    href: "/apps",
    icon: "app",
  },
  {
    id: "start-business",
    title: "온라인 사업을 시작하고 싶어요",
    description: "지식 사이트, 디지털 상품, 검색 유입 구조 설계",
    href: "/knowledge",
    icon: "business",
  },
  {
    id: "ebook",
    title: "전자책을 만들거나 보고 싶어요",
    description: "전자책 기획·제작, 또는 전문 분야 전자책 탐색",
    href: "/ebooks",
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
    href: "/contents",
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
  title: "필요한 서비스부터 시작하세요",
  description:
    "6대 전문 서비스를 둘러보거나, 제작 과정·이용 안내를 확인한 뒤 상담을 요청할 수 있습니다.",
  actions: [
    { label: "6대 사업 보기", href: "/#business-hub-heading", variant: "primary" as const },
    { label: "이용 안내", href: "/guide", variant: "secondary" as const },
    { label: "제작·사업 문의", href: "/contact", variant: "outline" as const },
  ],
};

export const trustItems = [
  { label: "운영 사이트", desc: "6개 전문 서비스 채널 운영", href: "/#business-network-heading" },
  { label: "제작 과정", desc: "기획 → 제작 → 검증 → 배포", href: "/process" },
  { label: "이용 안내", desc: "무료 · 회원 · 유료 · 상담·제작", href: "/guide" },
  { label: "기술 Stack", desc: "PLC · Web · App · AI · Content", href: "/about" },
];
