/**
 * Visual Commerce Prototype V1 — static mock data only.
 * No Auth, PG, Firestore, or Functions integration.
 */

export const PREVIEW_BANNER =
  "검토용 시제품 — 실제 가입·결제·구매는 진행되지 않습니다.";

export const PREVIEW_BASE = "/preview/commerce";

export type PreviewBusinessSlug =
  | "automation"
  | "apps"
  | "ebooks"
  | "knowledge"
  | "marketing"
  | "contents";

export type PreviewAccess =
  | "free"
  | "basic_included"
  | "one_time"
  | "preview_only";

export interface PreviewBusiness {
  slug: PreviewBusinessSlug;
  title: string;
  short: string;
  mood: string;
  accent: string;
  heroLine: string;
  experience: string[];
  primaryAction: string;
}

export interface PreviewProduct {
  slug: string;
  business: PreviewBusinessSlug;
  title: string;
  subtitle: string;
  priceLabel: string;
  priceWon: number | null;
  access: PreviewAccess;
  basicDiscountLabel?: string;
  coverTone: string;
  previewText: string;
  bullets: string[];
  toc?: string[];
}

export const previewBusinesses: PreviewBusiness[] = [
  {
    slug: "automation",
    title: "산업자동화",
    short: "현장 개선이 보이는 자동화",
    mood: "신뢰 · 현장 · 숫자",
    accent: "from-slate-800 to-brand-800",
    heroLine: "공정 화면과 개선 전후로 먼저 보여 드립니다.",
    experience: ["적용 사례", "공정 화면", "개선 전후", "견적 문의"],
    primaryAction: "견적 문의 미리보기",
  },
  {
    slug: "apps",
    title: "앱개발",
    short: "쓰는 화면이 먼저인 앱",
    mood: "실용 · 터치 · 배포",
    accent: "from-brand-700 to-sky-600",
    heroLine: "앱 화면·기능·사용법을 한눈에 살펴보세요.",
    experience: ["앱 화면", "주요 기능", "사용법", "제작 문의"],
    primaryAction: "앱 살펴보기",
  },
  {
    slug: "ebooks",
    title: "전자책",
    short: "서점처럼 고르는 지식",
    mood: "서재 · 표지 · 미리보기",
    accent: "from-amber-800 to-orange-700",
    heroLine: "표지·목차·무료 미리보기 후 구매 흐름을 체험합니다.",
    experience: ["표지", "목차", "무료 미리보기", "구매"],
    primaryAction: "전자책 고르기",
  },
  {
    slug: "knowledge",
    title: "지식·교육",
    short: "무료로 시작하고 깊게 배우기",
    mood: "학습 · 퀴즈 · 도구",
    accent: "from-emerald-800 to-teal-700",
    heroLine: "무료 정보와 회원 자료를 구분해서 보여 줍니다.",
    experience: ["무료 정보", "퀴즈·도구", "학습자료", "회원 콘텐츠"],
    primaryAction: "학습 자료 보기",
  },
  {
    slug: "marketing",
    title: "마케팅",
    short: "홍보 전후가 보이는 제안",
    mood: "사례 · 진단 · 신청",
    accent: "from-rose-800 to-pink-700",
    heroLine: "사례와 맞춤 진단으로 다음 행동을 고릅니다.",
    experience: ["홍보 전후", "사례", "맞춤 진단", "제작 신청"],
    primaryAction: "사례 보기",
  },
  {
    slug: "contents",
    title: "콘텐츠",
    short: "듣고 보고 나누는 콘텐츠",
    mood: "감상 · 공유 · 소장",
    accent: "from-cyan-900 to-slate-700",
    heroLine: "음악·쇼츠·만화·이미지를 감상하고 소장 흐름을 봅니다.",
    experience: ["감상", "공유", "구매", "내 자료실"],
    primaryAction: "콘텐츠 감상",
  },
];

export const previewProducts: PreviewProduct[] = [
  {
    slug: "plc-dashboard-pack",
    business: "automation",
    title: "공정 모니터링 화면 팩",
    subtitle: "설비 상태·알람·개선 전후 비교 화면 세트",
    priceLabel: "견적 상담",
    priceWon: null,
    access: "preview_only",
    coverTone: "bg-slate-800",
    previewText:
      "라인 A 가동률 94% · 알람 3건 · 전주 대비 비가동 18% 감소 (시제품 예시 수치)",
    bullets: ["공정 대시보드 미리보기", "개선 전후 카드", "견적 문의로 이어짐"],
  },
  {
    slug: "field-check-app",
    business: "apps",
    title: "현장 점검 앱",
    subtitle: "체크리스트·사진·보고를 한 흐름으로",
    priceLabel: "단건 9,900원",
    priceWon: 9900,
    access: "one_time",
    basicDiscountLabel: "Basic 회원 7,900원",
    coverTone: "bg-brand-700",
    previewText: "점검 시작 → 항목 체크 → 사진 첨부 → 보고 전송 (시제품 화면 설명)",
    bullets: ["주요 화면 3장", "사용법 요약", "제작 문의 연결"],
  },
  {
    slug: "factory-start-ebook",
    business: "ebooks",
    title: "현장 자동화 첫걸음",
    subtitle: "비개발자도 읽는 현장 자동화 입문",
    priceLabel: "단건 12,000원",
    priceWon: 12000,
    access: "one_time",
    basicDiscountLabel: "Basic 회원 9,600원",
    coverTone: "bg-amber-800",
    previewText:
      "1장. 왜 자동화가 막히는가 — 현장 언어로 풀어 쓴 도입부 (무료 미리보기)",
    bullets: ["서점형 표지", "목차", "1장 무료 미리보기"],
    toc: ["자동화 오해 3가지", "현장 언어로 요구사항 쓰기", "작은 개선부터 고르는 법", "다음 단계 체크리스트"],
  },
  {
    slug: "weekly-quiz-pack",
    business: "knowledge",
    title: "주간 실무 퀴즈",
    subtitle: "10분 퀴즈로 개념 점검",
    priceLabel: "Basic 포함",
    priceWon: 0,
    access: "basic_included",
    coverTone: "bg-emerald-800",
    previewText: "Q1. 가동률과 양품률의 차이는? (시제품 퀴즈 문항)",
    bullets: ["무료 맛보기 1문항", "Basic 회원 전체 개방", "학습 기록은 시제품에서 저장되지 않음"],
  },
  {
    slug: "free-tip-sheet",
    business: "knowledge",
    title: "무료 현장 팁 시트",
    subtitle: "누구나 볼 수 있는 짧은 안내",
    priceLabel: "무료",
    priceWon: 0,
    access: "free",
    coverTone: "bg-teal-700",
    previewText: "오늘 바로 쓸 수 있는 점검 순서 5가지 (시제품 무료 자료)",
    bullets: ["로그인 없이 열람", "공유용 요약", "유료 자료로 자연스럽게 안내"],
  },
  {
    slug: "promo-makeover",
    business: "marketing",
    title: "홍보 페이지 메이크오버",
    subtitle: "전후 비교로 설득하는 리뉴얼 패키지",
    priceLabel: "단건 49,000원",
    priceWon: 49000,
    access: "one_time",
    basicDiscountLabel: "Basic 회원 39,000원",
    coverTone: "bg-rose-800",
    previewText: "Before: 정보 나열 → After: 한 화면·한 행동 (시제품 비교)",
    bullets: ["전후 슬라이드", "맞춤 진단 질문", "제작 신청 버튼"],
  },
  {
    slug: "morning-lofi-pack",
    business: "contents",
    title: "아침 집중 사운드 팩",
    subtitle: "작업용 짧은 루프 모음",
    priceLabel: "단건 4,900원",
    priceWon: 4900,
    access: "one_time",
    coverTone: "bg-cyan-800",
    previewText: "30초 미리듣기 설명 · 파형 플레이스홀더 (시제품)",
    bullets: ["감상", "공유 안내", "구매 후 내 자료실"],
  },
  {
    slug: "basic-member-note",
    business: "knowledge",
    title: "Basic 회원 노트",
    subtitle: "정기이용 회원에게만 열리는 요약 노트",
    priceLabel: "Basic 포함",
    priceWon: 0,
    access: "basic_included",
    coverTone: "bg-emerald-900",
    previewText: "이번 주 핵심 요약 — Basic 이용 중에만 전체가 보입니다.",
    bullets: ["이용권한 허용 예시", "만료·해지 시 차단 예시", "업그레이드 안내"],
  },
];

export const previewPlans = [
  {
    id: "free",
    name: "Free",
    priceLabel: "0원",
    period: "항상",
    summary: "가입 후 무료 자료와 미리보기를 이용",
    perks: ["무료 자료 열람", "상품 미리보기", "구매 내역 확인(시제품)"],
  },
  {
    id: "basic-month",
    name: "Basic 월간",
    priceLabel: "2,000원",
    period: "매월",
    summary: "일부 자료 포함 + 단건 할인 혜택(시제품)",
    perks: ["Basic 포함 자료", "단건 할인 표시", "내 자료실 이용"],
    highlighted: true,
  },
  {
    id: "basic-year",
    name: "Basic 연간",
    priceLabel: "20,000원",
    period: "매년",
    summary: "월 환산 약 1,667원 · 같은 Basic 혜택",
    perks: ["Basic 포함 자료", "단건 할인 표시", "연간 한 번 결제(시제품)"],
  },
] as const;

export type MockMemberState = "guest" | "free" | "basic_active" | "basic_expired" | "basic_cancelled";

export const mockMemberLabels: Record<MockMemberState, string> = {
  guest: "둘러보기 (미로그인)",
  free: "Free 회원",
  basic_active: "Basic 이용 중",
  basic_expired: "Basic 만료",
  basic_cancelled: "Basic 해지(기간 종료 대기)",
};

export const mockLibraryItems = [
  {
    id: "lib-1",
    title: "현장 자동화 첫걸음",
    type: "전자책",
    status: "이용 가능",
    productSlug: "factory-start-ebook",
  },
  {
    id: "lib-2",
    title: "아침 집중 사운드 팩",
    type: "콘텐츠",
    status: "이용 가능",
    productSlug: "morning-lofi-pack",
  },
  {
    id: "lib-3",
    title: "주간 실무 퀴즈",
    type: "지식·교육",
    status: "Basic 필요",
    productSlug: "weekly-quiz-pack",
  },
];

export const mockOrders = [
  {
    id: "ord-demo-1001",
    title: "Basic 월간",
    amount: "2,000원",
    status: "결제 완료(시제품)",
    date: "2026-09-01",
  },
  {
    id: "ord-demo-1002",
    title: "현장 자동화 첫걸음",
    amount: "12,000원",
    status: "결제 완료(시제품)",
    date: "2026-09-05",
  },
  {
    id: "ord-demo-1003",
    title: "홍보 페이지 메이크오버",
    amount: "—",
    status: "취소 예시",
    date: "2026-09-08",
  },
];

export function getPreviewBusiness(slug: string) {
  return previewBusinesses.find((b) => b.slug === slug);
}

export function getPreviewProduct(slug: string) {
  return previewProducts.find((p) => p.slug === slug);
}

export function productsForBusiness(slug: PreviewBusinessSlug) {
  return previewProducts.filter((p) => p.business === slug);
}

export const previewBusinessSlugs = previewBusinesses.map((b) => b.slug);
export const previewProductSlugs = previewProducts.map((p) => p.slug);
