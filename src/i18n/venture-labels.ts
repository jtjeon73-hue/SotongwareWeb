import type { Locale } from "./config";

export type VenturePageId = "apps" | "ebooks" | "marketing" | "contents" | "knowledge" | "automation";

interface VenturePageLabels {
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle?: string;
  emptyDescription?: string;
  typeLabel?: string;
  ctas: { label: string; href: string; variant: "primary" | "outline" }[];
  sections?: Record<string, string>;
}

export const ventureLabels: Record<Locale, Record<VenturePageId, VenturePageLabels>> = {
  ko: {
    apps: {
      eyebrow: "App Marketplace",
      title: "앱 마켓플레이스",
      description:
        "SotongWare가 직접 제작한 앱을 전시합니다. Play Store URL은 실제 등록 후에만 활성화됩니다.",
      typeLabel: "앱",
      emptyTitle: "앱 카탈로그를 준비하고 있습니다",
      emptyDescription: "기획·개발·검수가 완료되는 순서대로 등록됩니다.",
      ctas: [
        { label: "앱 개발 의뢰", href: "/contact?topic=app", variant: "primary" },
        { label: "앱 개발 서비스", href: "/services/app-development", variant: "outline" },
      ],
    },
    ebooks: {
      eyebrow: "E-books",
      title: "전자책",
      description:
        "SotongWare에서 제작한 전자책을 상품으로 판매합니다. 외부 플랫폼 링크는 실제 등록 후에만 표시됩니다.",
      emptyTitle: "첫 전자책이 준비되고 있습니다",
      emptyDescription: "기획·집필·편집·검수가 완료되는 순서대로 등록됩니다.",
      ctas: [
        { label: "전자책 제작 의뢰", href: "/contact?topic=ebook", variant: "primary" },
        { label: "관련 교육 콘텐츠", href: "/knowledge", variant: "outline" },
      ],
    },
    marketing: {
      eyebrow: "Marketing Services",
      title: "마케팅",
      description:
        "홈페이지 홍보, SEO, 콘텐츠 마케팅, Shorts·영상 제작 — 마케팅 서비스를 상품화합니다. 가격은 상담 후 결정합니다.",
      ctas: [{ label: "마케팅 상담 요청", href: "/contact?topic=marketing", variant: "primary" }],
      sections: {
        services: "서비스 목록",
        pricing: "요금 플랜",
        pricingNote: "모든 플랜 가격은 상담 후 결정됩니다.",
      },
    },
    contents: {
      eyebrow: "Content",
      title: "콘텐츠",
      description:
        "AI 음악, YouTube Shorts, 영상, 만화 — 콘텐츠 자체 수익과 제작 대행 두 가지 사업 흐름을 지원합니다.",
      emptyTitle: "콘텐츠가 준비되고 있습니다",
      emptyDescription:
        "음악, Shorts, 영상 등 제작·검수 완료 후 등록됩니다. YouTube 링크는 실제 업로드 후에만 표시됩니다.",
      ctas: [
        { label: "콘텐츠 제작 의뢰", href: "/contact?topic=content", variant: "primary" },
        { label: "마케팅 서비스 보기", href: "/marketing", variant: "outline" },
      ],
    },
    knowledge: {
      eyebrow: "Knowledge & Education",
      title: "지식·교육",
      description:
        "무료 정보부터 회원·유료·구독 콘텐츠까지 — 반복수익형 지식 사업 구조입니다. 회원·프리미엄 콘텐츠는 SotongWare 포털에서 이용합니다.",
      emptyTitle: "교육 콘텐츠가 준비되고 있습니다",
      emptyDescription:
        "무료·회원·유료·구독 콘텐츠가 검수 후 순차 공개됩니다. 회원 포털에서 먼저 확인해 보세요.",
      ctas: [],
      sections: {
        portalTitle: "지식·교육 회원 포털",
        portalDescription: "회원 가입 후 대시보드에서 지식·교육 콘텐츠를 이용할 수 있습니다.",
        contentAreas: "콘텐츠 영역",
        contentAreasNote: "향후 콘텐츠가 순차적으로 공개됩니다.",
        fields: "분야",
        relatedEbooks: "관련 전자책 보기",
        signup: "무료 회원으로 보기",
        login: "로그인",
        comingSoon: "향후 제공 예정",
        paymentPrep: "결제 기능 준비 중",
      },
    },
    automation: {
      eyebrow: "Industrial Automation",
      title: "산업자동화",
      description:
        "SotongWare의 핵심 기술 역량 — PLC, HMI, MES, 설비 모니터링, 비전검사, 원격관리. B2B 구축·의뢰를 받습니다.",
      emptyTitle: "자동화 솔루션 카탈로그 준비 중",
      emptyDescription: "산업용 프로그램·솔루션이 검수 후 등록됩니다.",
      ctas: [
        { label: "자동화 상담", href: "/contact?topic=automation", variant: "primary" },
        { label: "견적 요청", href: "/contact?topic=quote", variant: "outline" },
        { label: "관련 산업용 앱", href: "/apps", variant: "outline" },
      ],
      sections: {
        capabilities: "기술 영역",
        portfolio: "구축 사례",
        portfolioEmpty: "구축 사례는 고객 승인 후 순차 공개됩니다.",
        products: "자동화 솔루션",
      },
    },
  },
  en: {
    apps: {
      eyebrow: "App Marketplace",
      title: "Apps we build",
      description:
        "Apps designed and shipped by SotongWare. Store links activate only after real listings go live.",
      typeLabel: "apps",
      emptyTitle: "App catalog in preparation",
      emptyDescription: "Apps register after planning, development, and review complete.",
      ctas: [
        { label: "Request app development", href: "/contact?topic=app", variant: "primary" },
        { label: "App development services", href: "/services/app-development", variant: "outline" },
      ],
    },
    ebooks: {
      eyebrow: "E-books",
      title: "E-books",
      description:
        "Titles produced by SotongWare. External retailer links appear only after official publication.",
      emptyTitle: "Our first e-books are in preparation",
      emptyDescription: "Titles are registered as planning, writing, editing, and review complete.",
      ctas: [
        { label: "Request e-book production", href: "/contact?topic=ebook", variant: "primary" },
        { label: "Related learning content", href: "/knowledge", variant: "outline" },
      ],
    },
    marketing: {
      eyebrow: "Marketing Services",
      title: "Websites & marketing",
      description:
        "Corporate sites, SEO, content marketing, and short-form video—packaged as services with scope confirmed in consultation.",
      ctas: [{ label: "Request marketing consultation", href: "/contact?topic=marketing", variant: "primary" }],
      sections: {
        services: "Service lineup",
        pricing: "Engagement tiers",
        pricingNote: "All pricing is confirmed after scope review.",
      },
    },
    contents: {
      eyebrow: "Content",
      title: "Media & content",
      description:
        "Music, shorts, video, and illustrated series—both owned channels and production-for-hire workflows.",
      emptyTitle: "Content is being prepared",
      emptyDescription:
        "Works are listed after production and review. YouTube links appear only after real uploads.",
      ctas: [
        { label: "Request content production", href: "/contact?topic=content", variant: "primary" },
        { label: "View marketing services", href: "/marketing", variant: "outline" },
      ],
    },
    knowledge: {
      eyebrow: "Knowledge & Education",
      title: "Knowledge & education",
      description:
        "From free introductions to member, paid, and subscription learning—a structured knowledge business. Premium content lives in the SotongWare member portal.",
      emptyTitle: "Learning content is being prepared",
      emptyDescription:
        "Free, member, paid, and subscription materials publish after review. Check the member portal for early access.",
      ctas: [],
      sections: {
        portalTitle: "Member learning portal",
        portalDescription: "Sign in to access knowledge and education content from your dashboard.",
        contentAreas: "Content tracks",
        contentAreasNote: "Materials will roll out in phases.",
        fields: "Topics",
        relatedEbooks: "Related e-books",
        signup: "Join free",
        login: "Sign in",
        comingSoon: "Coming soon",
        paymentPrep: "Checkout in preparation",
      },
    },
    automation: {
      eyebrow: "Industrial Automation",
      title: "Industrial automation",
      description:
        "PLC, HMI, MES, equipment monitoring, vision inspection, and remote operations—B2B design, build, and support.",
      emptyTitle: "Automation catalog in preparation",
      emptyDescription: "Industrial software and solutions register after validation.",
      ctas: [
        { label: "Automation consultation", href: "/contact?topic=automation", variant: "primary" },
        { label: "Request a quote", href: "/contact?topic=quote", variant: "outline" },
        { label: "Related industrial apps", href: "/apps", variant: "outline" },
      ],
      sections: {
        capabilities: "Technical scope",
        portfolio: "Reference work",
        portfolioEmpty: "Case studies publish after client approval.",
        products: "Automation solutions",
      },
    },
  },
};

export const automationCapabilityLabels: Record<
  Locale,
  { id: string; title: string; description: string }[]
> = {
  ko: [
    { id: "plc", title: "PLC 연동", description: "PLC 통신, 데이터 수집, 제어 로직 연동" },
    { id: "hmi", title: "HMI", description: "운전 화면, 알람, 트렌드, 레시피 관리" },
    { id: "mes", title: "MES 연동", description: "생산실적, 작업지시, 품질 데이터 연동" },
    { id: "monitoring", title: "설비 모니터링", description: "실시간 설비 상태, 알림, 이력" },
    { id: "vision", title: "비전검사", description: "영상 검사, 불량 판별, 데이터 기록" },
    { id: "data", title: "데이터 수집", description: "생산·설비 데이터 자동 수집·저장" },
    { id: "line", title: "생산라인 소프트웨어", description: "라인별 공정 제어·모니터링" },
    { id: "remote", title: "설비 원격관리", description: "원격 모니터링, 알림, 진단" },
  ],
  en: [
    { id: "plc", title: "PLC integration", description: "Field communication, data acquisition, and control logic" },
    { id: "hmi", title: "HMI", description: "Operator screens, alarms, trends, and recipes" },
    { id: "mes", title: "MES integration", description: "Production results, work orders, and quality data" },
    { id: "monitoring", title: "Equipment monitoring", description: "Live status, alerts, and history" },
    { id: "vision", title: "Vision inspection", description: "Image-based inspection, defect handling, and records" },
    { id: "data", title: "Data acquisition", description: "Automated collection and storage of production data" },
    { id: "line", title: "Line software", description: "Per-line process control and monitoring" },
    { id: "remote", title: "Remote operations", description: "Remote monitoring, alerts, and diagnostics" },
  ],
};

export const marketingServiceLabels: Record<Locale, { id: string; title: string; description: string }[]> = {
  ko: [
    { id: "homepage", title: "홈페이지 홍보", description: "기업·브랜드 홈페이지 제작 및 홍보 구조 설계" },
    { id: "seo", title: "SEO", description: "검색 유입 구조, 메타데이터, 콘텐츠 SEO" },
    { id: "content-marketing", title: "콘텐츠 마케팅", description: "블로그, Shorts, 정보 콘텐츠 기반 유입" },
    { id: "shorts", title: "YouTube Shorts 제작", description: "Shorts 기획·제작·채널 연동" },
    { id: "promo-video", title: "홍보 영상 제작", description: "제품·서비스 홍보 영상" },
    { id: "landing", title: "랜딩페이지 제작", description: "전환 중심 랜딩페이지" },
  ],
  en: [
    { id: "homepage", title: "Corporate web presence", description: "Brand sites and promotion structure" },
    { id: "seo", title: "SEO", description: "Search architecture, metadata, and content SEO" },
    { id: "content-marketing", title: "Content marketing", description: "Blogs, shorts, and informational content for inbound traffic" },
    { id: "shorts", title: "YouTube Shorts", description: "Short-form planning, production, and channel integration" },
    { id: "promo-video", title: "Promotional video", description: "Product and service promotion videos" },
    { id: "landing", title: "Landing pages", description: "Conversion-focused landing experiences" },
  ],
};

export const contentCategoryLabels: Record<Locale, { id: string; label: string }[]> = {
  ko: [
    { id: "music", label: "AI 음악·노래" },
    { id: "shorts", label: "YouTube Shorts" },
    { id: "video", label: "일반 영상" },
    { id: "comic", label: "만화" },
  ],
  en: [
    { id: "music", label: "AI music" },
    { id: "shorts", label: "YouTube Shorts" },
    { id: "video", label: "Video" },
    { id: "comic", label: "Comics & illustration" },
  ],
};

export const knowledgeTierLabels: Record<
  Locale,
  { id: string; label: string; desc: string; cta: string }[]
> = {
  ko: [
    { id: "free", label: "무료", desc: "검색 유입용 정보", cta: "무료로 시작하기" },
    { id: "member", label: "회원전용", desc: "가입 회원 자료", cta: "회원 콘텐츠" },
    { id: "paid", label: "유료", desc: "구매자 전용", cta: "전문 자료" },
    { id: "subscription", label: "구독", desc: "월 정기결제 프리미엄", cta: "프리미엄" },
  ],
  en: [
    { id: "free", label: "Free", desc: "Introductory information", cta: "Start free" },
    { id: "member", label: "Members", desc: "Signed-in resources", cta: "Member content" },
    { id: "paid", label: "Paid", desc: "Purchased materials", cta: "Pro resources" },
    { id: "subscription", label: "Subscription", desc: "Recurring premium access", cta: "Premium" },
  ],
};

export const knowledgeRailLabels: Record<Locale, { title: string; desc: string }[]> = {
  ko: [
    { title: "무료로 시작하기", desc: "검색으로 찾아온 방문자를 위한 무료 정보" },
    { title: "최신 지식", desc: "분야별 최신 정보와 업데이트" },
    { title: "실전 가이드", desc: "현장과 실무에 바로 적용 가능한 가이드" },
    { title: "전문 자료", desc: "심화 학습을 위한 유료·회원 자료" },
  ],
  en: [
    { title: "Start free", desc: "Introductory material for new visitors" },
    { title: "Latest knowledge", desc: "Updates by topic" },
    { title: "Practical guides", desc: "Apply on the job right away" },
    { title: "Advanced resources", desc: "Member and paid deep dives" },
  ],
};
