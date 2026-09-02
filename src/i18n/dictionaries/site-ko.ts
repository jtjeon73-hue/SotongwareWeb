import type { SiteDictionary, CapabilityDictionaryMap } from "../site-types";

export const koSite: SiteDictionary = {
  nav: {
    technology: "기술역량",
    digitalVentures: "디지털 사업",
    portfolio: "결과물",
    about: "소통웨어",
    contact: "문의",
    contactCta: "상담·제작 문의",
    process: "제작 과정",
    guide: "이용 안내",
    homeAria: "소통웨어 홈",
    mainMenu: "주요 메뉴",
    mobileMenu: "모바일 메뉴",
    openMenu: "메뉴 열기",
    closeMenu: "메뉴 닫기",
    viewService: "서비스 보기",
    viewAllServices: "전체 서비스 보기",
    externalSite: "전문 사이트 ↗",
    technologyItems: [
      { label: "산업자동화", slug: "industrial-automation" },
      { label: "스마트팜·농업자동화", slug: "smart-farm" },
      { label: "AI 소프트웨어", slug: "ai-software" },
      { label: "앱·웹·원격관제", slug: "multiplatform-control" },
    ],
    ventureItems: [
      { label: "전자책", href: "/ebooks" },
      { label: "앱", href: "/apps" },
      { label: "사이트", href: "/marketing" },
      { label: "콘텐츠", href: "/contents" },
      { label: "지식·교육", href: "/knowledge" },
    ],
  },
  footer: {
    tagline: "디지털 사업 플랫폼",
    externalServices: "전문 서비스",
    guide: "이용 안내",
    company: "회사",
    legal: "법적 안내",
    rights: "All rights reserved.",
  },
  common: {
    home: "홈",
    backHome: "홈으로",
    learnMore: "자세히 보기",
    contactUs: "상담·문의",
    launchPrep: "출시 준비",
    inValidation: "검증 중",
    live: "운영 중",
    comingSoon: "Coming Soon",
    notFoundTitle: "페이지를 찾을 수 없습니다",
    notFoundDescription: "요청하신 페이지가 없거나 이동되었습니다.",
    notFoundCta: "홈으로 돌아가기",
  },
  pages: {
    about: {
      meta: {
        title: "SotongWare 소개",
        description: "산업 현장에서 시작해 디지털 제품과 서비스로 확장하는 기술 기반 회사",
      },
      eyebrow: "About SotongWare",
      title: "기술을 만들고 끝내지 않습니다",
      description:
        "SotongWare는 산업 현장에서 시작해 소프트웨어, 자동화, 앱, 웹, 지식, 콘텐츠로 기술 영역을 확장합니다.",
      journeyTitle: "SotongWare의 여정",
      blocks: [
        { title: "산업 현장", titleEn: "Industrial Field", description: "현장 문제를 이해합니다. PLC, 설비, 생산 데이터 등 실제 산업 환경에서 출발합니다." },
        { title: "소프트웨어 개발", titleEn: "Software Engineering", description: "문제를 프로그램으로 해결합니다. 웹, 앱, 자동화 소프트웨어를 직접 설계·개발합니다." },
        { title: "AI 활용", titleEn: "AI Utilization", description: "제작 속도와 확장성을 강화합니다. AI를 도구로 활용해 더 빠르게 결과물을 만듭니다." },
        { title: "디지털 제품화", titleEn: "Digital Product", description: "앱·웹·전자책·콘텐츠로 제품화합니다. 만들고 끝내지 않고 실제 사용·배포까지 연결합니다." },
        { title: "사업 연결", titleEn: "Business Connection", description: "배포·홍보·판매로 연결합니다. 전문 서비스 채널과 디지털 상품으로 고객과 만납니다." },
      ],
      servicesTitle: "주요 사업 부문",
      servicesDescription: "SotongWare는 다음 분야의 전문 서비스를 직접 운영합니다.",
      ctaContact: "제작·사업 문의",
      ctaProducts: "대표 결과물 보기",
    },
    contact: {
      meta: { title: "문의", description: "SotongWare 제작 의뢰, 견적, 상담 문의" },
      title: "상담·제작 문의",
      description:
        "제작 의뢰, 견적, 상담 문의를 접수합니다. 온라인 접수가 준비 중인 경우 관련 전문 사이트 안내를 우선 제공합니다.",
      ctaGuide: "이용 안내",
    },
  },
};

// Capability pages - ko
export const koCapabilities: CapabilityDictionaryMap = {
  "industrial-automation": {
    meta: {
      title: "산업자동화 소프트웨어",
      description: "PLC·HMI·MES·비전검사·설비 모니터링 — 현장 맞춤 산업 소프트웨어 설계·개발",
    },
    hero: {
      eyebrow: "Industrial Automation",
      title: "공장 현장의 데이터를 연결하는 산업자동화 소프트웨어",
      subtitle:
        "설비·생산·품질·알람 데이터를 수집·분석·관리하고, 현장 PC·서버·모바일까지 연결합니다.",
      ctas: [
        { label: "자동화 상담", href: "/contact?topic=automation", variant: "primary" },
        { label: "대표 결과물", href: "/products", variant: "outline" },
      ],
    },
    problems: {
      title: "해결하는 문제",
      items: [
        { title: "설비 상태를 실시간으로 보기 어려움", description: "생산라인 가동·정지·알람 정보가 분산되어 운영자가 즉시 파악하기 어렵습니다." },
        { title: "수기 점검·종이 기록 의존", description: "점검·품질·이력 데이터가 현장에 남아 분석·추적이 어렵습니다." },
        { title: "기존 설비와 신규 시스템 통합", description: "PLC·HMI·상위 시스템 간 프로토콜·데이터 형식이 달라 단계적 통합이 필요합니다." },
        { title: "알람·불량 대응 지연", description: "경보 발생 후 원인 분석·조치까지 시간이 걸려 손실이 커질 수 있습니다." },
      ],
    },
    strengths: {
      title: "핵심 역량",
      items: [
        { title: "PLC·HMI·MES 연동", description: "Modbus RTU/TCP 등 현장 프로토콜을 이해하고, 설비 데이터 수집·이력·추적 구조를 설계합니다." },
        { title: "생산·품질·가동 데이터", description: "라인별 생산량, 불량, 가동률, 알람 이력을 통합 모니터링합니다." },
        { title: "비전검사·품질 관리", description: "검사 결과·판정·이력을 소프트웨어로 연결해 추적 가능하게 합니다." },
        { title: "멀티 디바이스 접근", description: "현장 PC·서버·태블릿·모바일에서 동일 데이터를 확인할 수 있게 합니다." },
      ],
    },
    flow: {
      title: "시스템·데이터 흐름",
      description: "현장 설비에서 운영 화면까지 데이터가 이동하는 구조입니다.",
      nodes: [
        { id: "field", label: "현장 설비", description: "PLC · 센서 · 검사장비" },
        { id: "collect", label: "수집·변환", description: "Modbus · OPC · DB" },
        { id: "process", label: "처리·저장", description: "이력 · 알람 · 분석" },
        { id: "view", label: "모니터링", description: "HMI · 웹 · 모바일" },
        { id: "act", label: "조치", description: "알람 · 작업지시 · 보고" },
      ],
    },
    applications: {
      title: "적용 분야",
      applicable: [
        { title: "제조·조립 라인", description: "생산 수집, 가동 모니터링, 알람 관리" },
        { title: "전기·설비 점검", description: "점검 체크리스트, 기록, 현장 앱 연동" },
        { title: "품질·검사 공정", description: "검사 데이터 수집, 불량 추적" },
        { title: "설비 유지보수", description: "이력 관리, 예방 점검 알림" },
      ],
      note: "완료 사례는 고객 승인 후 공개합니다. 위 항목은 적용 가능 영역입니다.",
    },
    deliverables: {
      title: "제공 결과물",
      items: [
        "현장 맞춤 모니터링·수집 소프트웨어",
        "HMI·웹·모바일 관제 화면",
        "알람·이력·보고 구조",
        "개발·검증·배포 문서",
        "운영·유지보수 지원 범위 협의",
      ],
    },
    process: {
      title: "개발 과정",
      steps: [
        { step: 1, title: "요구분석", description: "현장 설비, 프로토콜, 운영 흐름을 파악합니다." },
        { step: 2, title: "설계", description: "데이터 모델, 화면, 알람·이력 구조를 설계합니다." },
        { step: 3, title: "개발", description: "수집·처리·UI를 구현합니다." },
        { step: 4, title: "검증", description: "현장 조건에서 테스트·조정합니다." },
        { step: 5, title: "배포", description: "현장 PC·서버에 설치·연동합니다." },
        { step: 6, title: "운영", description: "모니터링·개선·유지보수를 지원합니다." },
      ],
    },
    portfolio: { title: "관련 포트폴리오", emptyNote: "산업 자동화 솔루션은 검수 후 순차 공개됩니다.", statusLabel: "출시 준비" },
    faq: {
      title: "자주 묻는 질문",
      items: [
        { q: "기존 PLC와 연동이 가능한가요?", a: "Modbus RTU/TCP 등 지원 프로토콜 범위에서 연동을 설계합니다. 사전 현장 조사가 필요합니다." },
        { q: "납기와 비용은 어떻게 정해지나요?", a: "요구 범위·설비 수·연동 복잡도에 따라 견적합니다. 확정 일정·금액은 상담 후 제안합니다." },
        { q: "클라우드가 필수인가요?", a: "현장 단독 운영·사내 서버·클라우드 등 환경에 맞게 설계합니다." },
      ],
    },
    finalCta: {
      title: "산업자동화 프로젝트를 논의해 보세요",
      description: "현장 조건과 목표를 알려주시면 가능 범위와 다음 단계를 안내합니다.",
      cta: "자동화 상담 요청",
      ctaHref: "/contact?topic=automation",
    },
  },
  "smart-farm": {
    meta: {
      title: "스마트팜·농업자동화",
      description: "온도·습도·관수·환기·에너지 데이터 연결과 원격관제 소프트웨어",
    },
    hero: {
      eyebrow: "Smart Farm",
      title: "농장 환경과 작업을 데이터로 연결하는 스마트팜 소프트웨어",
      subtitle: "센서·제어기·카메라 데이터를 수집하고, 경보·이력·원격관제로 운영을 돕습니다.",
      ctas: [
        { label: "스마트팜 상담", href: "/contact?topic=automation", variant: "primary" },
        { label: "기술 역량 보기", href: "/capabilities/industrial-automation", variant: "outline" },
      ],
    },
    problems: {
      title: "해결하는 문제",
      items: [
        { title: "환경 데이터 분산", description: "온도·습도·CO₂·관수 상태가 장비별로 나뉘어 한눈에 보기 어렵습니다." },
        { title: "야간·원거리 관리 부담", description: "현장 방문 없이 상태 확인·제어가 필요합니다." },
        { title: "경보 대응 지연", description: "임계값 초과·설비 이상 시 즉시 알림·기록이 필요합니다." },
        { title: "작업·이력 추적", description: "관수·방제·수확 등 작업 기록을 체계적으로 남기기 어렵습니다." },
      ],
    },
    strengths: {
      title: "핵심 역량",
      items: [
        { title: "환경·제어 데이터 통합", description: "온도, 습도, CO₂, 관수, 환기, 조명, 에너지 데이터를 연결합니다." },
        { title: "센서·제어기·카메라 연동", description: "현장 장비와 소프트웨어를 단계적으로 통합합니다." },
        { title: "경보·이력·분석", description: "임계값 알람, 이력 조회, 운영 분석 구조를 제공합니다." },
        { title: "현장·클라우드·모바일 역할 분리", description: "제어는 현장, 모니터링은 원격 — 역할에 맞게 설계합니다." },
      ],
    },
    flow: {
      title: "시스템·데이터 흐름",
      description: "농장 센서에서 원격 관제까지의 흐름입니다.",
      nodes: [
        { id: "sensor", label: "센서·제어", description: "온습도 · 관수 · 환기" },
        { id: "edge", label: "현장 게이트웨이", description: "수집 · 로컬 제어" },
        { id: "store", label: "저장·분석", description: "이력 · 경보 · 리포트" },
        { id: "remote", label: "원격관제", description: "웹 · 모바일 · 알림" },
        { id: "work", label: "작업기록", description: "관수 · 방제 · 수확" },
      ],
    },
    applications: {
      title: "적용 분야",
      applicable: [
        { title: "시설·스마트온실", description: "환경 제어, 관수 스케줄, 경보" },
        { title: "노지·과수", description: "기상·토양 센서, 관수 모니터링" },
        { title: "축산·특용작물", description: "환경 모니터링, 작업 이력" },
        { title: "농장 규모 확장", description: "구역 추가, 센서·제어기 확장 구조" },
      ],
      note: "농업 효과 수치는 환경·작물·운영에 따라 달라지며, 근거 없는 수치를 약속하지 않습니다.",
    },
    deliverables: {
      title: "제공 결과물",
      items: ["환경·제어 모니터링 소프트웨어", "경보·이력·작업기록 구조", "원격관제 웹·모바일", "현장 연동·검증·배포", "운영 가이드·유지보수 협의"],
    },
    process: {
      title: "개발 과정",
      steps: [
        { step: 1, title: "현장 조사", description: "작물, 시설, 장비, 운영 방식을 파악합니다." },
        { step: 2, title: "설계", description: "센서·제어·알람·화면 구조를 설계합니다." },
        { step: 3, title: "개발", description: "수집·제어·관제를 구현합니다." },
        { step: 4, title: "검증", description: "현장에서 시험 운전·조정합니다." },
        { step: 5, title: "배포", description: "운영 환경에 설치합니다." },
        { step: 6, title: "운영", description: "모니터링·개선을 지원합니다." },
      ],
    },
    portfolio: { title: "관련 포트폴리오", emptyNote: "스마트팜 관련 결과물은 준비·검증 후 공개됩니다.", statusLabel: "출시 준비" },
    faq: {
      title: "자주 묻는 질문",
      items: [
        { q: "소규모 농장도 가능한가요?", a: "규모에 맞춰 단계적으로 설계합니다. 최소 구성부터 확장 가능한 구조를 제안합니다." },
        { q: "인터넷이 불안정한 현장은?", a: "로컬 제어·버퍼링 후 동기화 등 현장 조건에 맞는 구조를 검토합니다." },
        { q: "기존 제어기와 연동되나요?", a: "장비·프로토콜 사양 확인 후 연동 가능 범위를 상담 시 안내합니다." },
      ],
    },
    finalCta: {
      title: "스마트팜·농업자동화를 상담해 보세요",
      description: "시설 규모와 목표를 알려주시면 적용 가능 범위를 안내합니다.",
      cta: "상담 요청",
      ctaHref: "/contact?topic=automation",
    },
  },
  "ai-software": {
    meta: {
      title: "AI 소프트웨어 개발·운영",
      description: "요구사항 정리, AI 제작공정, 검증·승인, 앱·콘텐츠·사이트 제작까지 실용적 AI 활용",
    },
    hero: {
      eyebrow: "AI Software",
      title: "AI를 실무 도구로 — 제작·검증·운영까지 연결하는 소프트웨어",
      subtitle: "요구사항 정리부터 앱·전자책·사이트·콘텐츠 제작, 사람의 최종 검토와 안전한 운영까지.",
      ctas: [
        { label: "AI·제작 상담", href: "/contact?topic=app", variant: "primary" },
        { label: "제작 과정", href: "/process", variant: "outline" },
      ],
    },
    problems: {
      title: "해결하는 문제",
      items: [
        { title: "아이디어는 있으나 제작 리소스 부족", description: "기획·개발·콘텐츠 제작에 시간과 인력이 부족합니다." },
        { title: "AI 도구만으로는 품질·일관성 확보 어려움", description: "자동 생성만으로는 검증·브랜드·운영 기준이 맞지 않을 수 있습니다." },
        { title: "배포·운영 구조 부재", description: "만들고 끝이 아니라 배포·모니터링·개선이 필요합니다." },
        { title: "문서화·요구사항 정리 미흡", description: "제작 전 요구사항이 불명확해 재작업이 발생합니다." },
      ],
    },
    strengths: {
      title: "핵심 역량",
      items: [
        { title: "요구사항·문서화", description: "기능, 범위, 검증 기준을 명확히 정리합니다." },
        { title: "AI 제작공정·검증", description: "자동화 단계와 품질 gate, 사람의 승인을 연결합니다." },
        { title: "멀티 포맷 제작", description: "앱, 전자책, 사이트, 콘텐츠를 하나의 흐름으로 제작합니다." },
        { title: "운영·로그·복구", description: "배포 후 모니터링, 로그, 복구 구조를 고려합니다." },
      ],
    },
    flow: {
      title: "제작·검증 흐름",
      description: "요구사항에서 배포까지 AI와 사람의 역할을 구분합니다.",
      nodes: [
        { id: "req", label: "요구 정리", description: "범위 · 기준 · 문서" },
        { id: "build", label: "AI·개발", description: "설계 · 구현 · 콘텐츠" },
        { id: "gate", label: "검증 gate", description: "테스트 · 승인" },
        { id: "ship", label: "배포", description: "스토어 · 웹 · 채널" },
        { id: "ops", label: "운영", description: "로그 · 개선 · 복구" },
      ],
    },
    applications: {
      title: "적용 분야",
      applicable: [
        { title: "앱·웹 서비스", description: "기능 개발, UI, 배포 파이프라인" },
        { title: "전자책·지식 콘텐츠", description: "기획, 집필 지원, 편집·출판 구조" },
        { title: "마케팅·콘텐츠", description: "영상·문서·채널 콘텐츠 제작" },
        { title: "업무 자동화", description: "반복 작업, 데이터 처리, 리포트" },
      ],
      note: "AI가 모든 작업을 완벽히 대신한다고 표현하지 않습니다. 사람의 검토와 책임 있는 운영을 전제로 합니다.",
    },
    deliverables: {
      title: "제공 결과물",
      items: ["요구사항·설계 문서", "소프트웨어·콘텐츠 결과물", "검증·배포 산출물", "운영·모니터링 가이드", "유지·개선 협의"],
    },
    process: {
      title: "개발 과정",
      steps: [
        { step: 1, title: "요구분석", description: "목표, 범위, 검증 기준을 정의합니다." },
        { step: 2, title: "설계", description: "구조, AI 활용 지점, 품질 gate를 설계합니다." },
        { step: 3, title: "제작", description: "개발·콘텐츠를 구현합니다." },
        { step: 4, title: "검증", description: "기능·품질·정책을 검수합니다." },
        { step: 5, title: "배포", description: "채널·스토어·웹에 공개합니다." },
        { step: 6, title: "운영", description: "피드백·개선·복구를 지원합니다." },
      ],
    },
    portfolio: { title: "관련 포트폴리오", emptyNote: "AI 기반 제작 결과물은 검증 후 공개됩니다.", statusLabel: "검증 중" },
    faq: {
      title: "자주 묻는 질문",
      items: [
        { q: "AI만으로 앱을 완성해 주나요?", a: "AI는 제작 속도를 돕는 도구입니다. 설계·검증·배포·운영은 사람이 책임집니다." },
        { q: "저작권·AI 생성물 표시는?", a: "콘텐츠 유형에 따라 검토·표시 정책을 적용합니다. 상담 시 안내합니다." },
        { q: "기존 시스템과 연동되나요?", a: "API·데이터 연동 범위는 프로젝트별로 검토합니다." },
      ],
    },
    finalCta: {
      title: "AI 활용 제작을 상담해 보세요",
      description: "만들고 싶은 결과물과 제약을 알려주시면 실현 가능 범위를 안내합니다.",
      cta: "제작 상담",
      ctaHref: "/contact?topic=app",
    },
  },
  "multiplatform-control": {
    meta: {
      title: "앱·웹·데스크톱·원격관제",
      description: "Flutter·웹·Windows — 모바일·PC·웹 역할 분리와 원격관제·동기화",
    },
    hero: {
      eyebrow: "Multi-Platform",
      title: "현장과 사무실을 연결하는 멀티플랫폼 소프트웨어",
      subtitle: "모바일·PC·웹에서 데이터·상태·알림을 동기화하고, 원격관제·작업 승인을 지원합니다.",
      ctas: [
        { label: "앱·웹 상담", href: "/contact?topic=app", variant: "primary" },
        { label: "앱 포트폴리오", href: "/apps", variant: "outline" },
      ],
    },
    problems: {
      title: "해결하는 문제",
      items: [
        { title: "현장·사무실 정보 단절", description: "현장 데이터가 사무실 시스템에 실시간 반영되지 않습니다." },
        { title: "디바이스별 다른 경험", description: "PC·모바일에서 다른 UI·데이터로 혼란이 생깁니다." },
        { title: "원격 확인·승인 어려움", description: "이동 없이 상태 확인·작업 승인이 필요합니다." },
        { title: "오프라인·오류 UX", description: "네트워크 불안정 시 사용성·데이터 손실이 우려됩니다." },
      ],
    },
    strengths: {
      title: "핵심 역량",
      items: [
        { title: "Flutter·웹·Windows", description: "검증된 기술 범위에서 멀티플랫폼을 설계합니다." },
        { title: "인증·알림·동기화", description: "로그인, 푸시·알림, 데이터·상태 동기화를 구현합니다." },
        { title: "원격관제·작업 흐름", description: "모니터링, 작업 지시, 결과 확인 흐름을 설계합니다." },
        { title: "반응형·접근성", description: "화면 크기, 터치, 키보드, 대비를 고려합니다." },
      ],
    },
    flow: {
      title: "플랫폼·데이터 흐름",
      description: "디바이스별 역할과 동기화 구조입니다.",
      nodes: [
        { id: "field", label: "현장", description: "모바일 · 태블릿" },
        { id: "desk", label: "사무·관제", description: "PC · 대시보드" },
        { id: "web", label: "웹", description: "브라우저 · 반응형" },
        { id: "sync", label: "동기화", description: "인증 · API · 실시간" },
        { id: "notify", label: "알림", description: "경보 · 승인 · 푸시" },
      ],
    },
    applications: {
      title: "적용 분야",
      applicable: [
        { title: "산업·설비 관제", description: "현장 점검 앱, 관제 대시보드" },
        { title: "스마트팜 원격", description: "환경 확인, 알람, 작업 기록" },
        { title: "업무·협업 앱", description: "체크리스트, 승인, 보고" },
        { title: "고객·마케팅 웹", description: "반응형 사이트, SEO, 결제 확장" },
      ],
      note: "플랫폼·기능 범위는 프로젝트별로 상담 후 확정합니다.",
    },
    deliverables: {
      title: "제공 결과물",
      items: ["Android·Web App·데스크톱(범위 협의)", "관제·대시보드 웹", "인증·API·동기화 구조", "배포·스토어 연동 지원", "운영·업데이트 체계"],
    },
    process: {
      title: "개발 과정",
      steps: [
        { step: 1, title: "요구분석", description: "사용자, 디바이스, 동기화 요구를 정의합니다." },
        { step: 2, title: "설계", description: "UI, API, 오프라인·오류 UX를 설계합니다." },
        { step: 3, title: "개발", description: "플랫폼별 구현·연동합니다." },
        { step: 4, title: "검증", description: "기기·네트워크 조건에서 테스트합니다." },
        { step: 5, title: "배포", description: "스토어·웹·현장에 배포합니다." },
        { step: 6, title: "운영", description: "모니터링·업데이트를 지원합니다." },
      ],
    },
    portfolio: { title: "관련 포트폴리오", emptyNote: "앱·웹 결과물은 검증·출시 단계에 따라 공개됩니다.", statusLabel: "검증 중" },
    faq: {
      title: "자주 묻는 질문",
      items: [
        { q: "iOS도 지원하나요?", a: "현재 주력은 Android·Web입니다. iOS는 범위·일정을 상담 후 안내합니다." },
        { q: "오프라인에서도 동작하나요?", a: "요구에 따라 오프라인 캐시·동기화를 설계합니다." },
        { q: "기존 서버와 연동되나요?", a: "REST API·DB 등 연동 방식은 사전 검토가 필요합니다." },
      ],
    },
    finalCta: {
      title: "멀티플랫폼 프로젝트를 상담해 보세요",
      description: "사용 시나리오와 디바이스 환경을 알려주시면 설계 방향을 제안합니다.",
      cta: "앱·웹 상담",
      ctaHref: "/contact?topic=app",
    },
  },
};
