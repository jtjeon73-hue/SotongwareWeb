import type { Locale } from "@/i18n/config";
import type {
  MarketingPackageId,
  MarketingServiceId,
  MarketingWorkOrderDraft,
} from "@/types/marketing-order";

export type Localized = Record<Locale, string>;

export interface MarketingOfferService {
  id: MarketingServiceId;
  title: Localized;
  summary: Localized;
  tone: "violet" | "sky" | "rose" | "amber" | "emerald" | "fuchsia";
}

export interface MarketingPackage {
  id: MarketingPackageId;
  name: Localized;
  priceFromKrw: number | null;
  priceLabel: Localized;
  blurb: Localized;
  features: Localized[];
  revisionAllowance: number;
  suggestedServiceIds: MarketingServiceId[];
  highlighted?: boolean;
}

export interface MarketingSample {
  id: string;
  title: Localized;
  kind: Localized;
  status: "sample" | "preparing";
  tone: string;
}

export const marketingOfferServices: MarketingOfferService[] = [
  {
    id: "sns",
    title: { ko: "SNS 홍보 콘텐츠", en: "SNS promo content" },
    summary: {
      ko: "피드·스토리용 카피와 카드형 홍보 소재를 제작합니다.",
      en: "Feed/story copy and card-style promo assets.",
    },
    tone: "violet",
  },
  {
    id: "cardnews",
    title: { ko: "카드뉴스", en: "Card news" },
    summary: {
      ko: "핵심 메시지를 슬라이드형으로 정리한 카드뉴스입니다.",
      en: "Slide-style card news that clarifies the core message.",
    },
    tone: "sky",
  },
  {
    id: "blog",
    title: { ko: "블로그/정보 콘텐츠", en: "Blog / info content" },
    summary: {
      ko: "검색·공유용 정보형 글과 구조화된 홍보 문구를 만듭니다.",
      en: "Search- and share-friendly informational posts and promo copy.",
    },
    tone: "emerald",
  },
  {
    id: "detail-page",
    title: { ko: "상세페이지", en: "Product detail page" },
    summary: {
      ko: "상품·서비스 설득 구조를 담은 상세페이지 초안을 제작합니다.",
      en: "Detail-page drafts built around a clear persuasion structure.",
    },
    tone: "amber",
  },
  {
    id: "landing",
    title: { ko: "랜딩페이지", en: "Landing page" },
    summary: {
      ko: "전환 중심 랜딩 섹션 구성과 카피를 설계합니다.",
      en: "Conversion-focused landing sections and copy.",
    },
    tone: "fuchsia",
  },
  {
    id: "shorts",
    title: { ko: "Shorts/영상 홍보 소재", en: "Shorts / video assets" },
    summary: {
      ko: "숏폼·영상용 훅·장면 구성·썸네일 방향을 정리합니다.",
      en: "Hooks, scene outlines, and thumbnail direction for short video.",
    },
    tone: "rose",
  },
  {
    id: "campaign",
    title: { ko: "캠페인 홍보 패키지", en: "Campaign package" },
    summary: {
      ko: "채널별 소재를 한 캠페인 흐름으로 묶습니다.",
      en: "Bundles multi-channel assets into one campaign flow.",
    },
    tone: "violet",
  },
  {
    id: "custom-promo",
    title: { ko: "맞춤형 홍보 제작", en: "Custom promo production" },
    summary: {
      ko: "업종·목표에 맞춘 맞춤 제작 범위를 협의합니다.",
      en: "Custom scope aligned to your industry and goals.",
    },
    tone: "sky",
  },
];

export const marketingPackages: MarketingPackage[] = [
  {
    id: "lite",
    name: { ko: "Lite", en: "Lite" },
    priceFromKrw: 39000,
    priceLabel: { ko: "39,000원부터", en: "From ₩39,000" },
    blurb: {
      ko: "간단 홍보 카피·소형 SNS 결과물 중심의 최소 범위",
      en: "Minimal scope for light copy and small SNS assets",
    },
    features: [
      { ko: "소형 SNS/카피 결과물", en: "Small SNS / copy deliverables" },
      { ko: "수정 1회", en: "1 revision" },
      { ko: "빠른 착수 구조", en: "Fast-start structure" },
    ],
    revisionAllowance: 1,
    suggestedServiceIds: ["sns", "cardnews"],
  },
  {
    id: "standard",
    name: { ko: "Standard", en: "Standard" },
    priceFromKrw: 99000,
    priceLabel: { ko: "99,000원부터", en: "From ₩99,000" },
    blurb: {
      ko: "SNS + 블로그/홍보문구 등 중간 묶음",
      en: "Mid bundle: SNS + blog / promo copy",
    },
    features: [
      { ko: "SNS + 정보형 콘텐츠 묶음", en: "SNS + informational content bundle" },
      { ko: "수정 1회", en: "1 revision" },
      { ko: "채널 메시지 정렬", en: "Aligned channel messaging" },
    ],
    revisionAllowance: 1,
    suggestedServiceIds: ["sns", "blog", "cardnews"],
    highlighted: true,
  },
  {
    id: "pro",
    name: { ko: "Pro", en: "Pro" },
    priceFromKrw: 199000,
    priceLabel: { ko: "199,000원부터", en: "From ₩199,000" },
    blurb: {
      ko: "상세·랜딩 기반 + 여러 홍보 결과물 묶음",
      en: "Detail/landing-based bundle with multiple assets",
    },
    features: [
      { ko: "상세페이지 또는 랜딩 중심", en: "Detail page or landing focus" },
      { ko: "멀티 소재 묶음", en: "Multi-asset bundle" },
      { ko: "수정 2회", en: "2 revisions" },
    ],
    revisionAllowance: 2,
    suggestedServiceIds: ["landing", "detail-page", "sns", "shorts"],
  },
  {
    id: "custom",
    name: { ko: "Custom", en: "Custom" },
    priceFromKrw: null,
    priceLabel: { ko: "별도 견적", en: "Custom quote" },
    blurb: {
      ko: "캠페인·맞춤 범위는 상담 후 견적",
      en: "Campaign / custom scope quoted after review",
    },
    features: [
      { ko: "맞춤 범위 협의", en: "Scoped after consultation" },
      { ko: "캠페인 패키지 가능", en: "Campaign packages available" },
      { ko: "수정 횟수 협의", en: "Revisions agreed in scope" },
    ],
    revisionAllowance: 0,
    suggestedServiceIds: ["campaign", "custom-promo"],
  },
];

export const marketingProcessSteps: { step: number; title: Localized; desc: Localized }[] = [
  {
    step: 1,
    title: { ko: "요구사항 입력", en: "Share requirements" },
    desc: { ko: "목표·대상·원하는 제작물을 간단히 정리합니다.", en: "Capture goals, audience, and desired assets." },
  },
  {
    step: 2,
    title: { ko: "주문/견적 확인", en: "Confirm order / quote" },
    desc: { ko: "패키지와 범위를 확인하고 예상 주문을 정리합니다.", en: "Confirm package, scope, and expected order." },
  },
  {
    step: 3,
    title: { ko: "제작 시작", en: "Production starts" },
    desc: {
      ko: "AI 자동화 + 전문가 검토형 제작 프로세스로 진행합니다.",
      en: "AI-assisted production with expert review.",
    },
  },
  {
    step: 4,
    title: { ko: "품질 검토", en: "Quality review" },
    desc: { ko: "내부 기준으로 메시지·완성도를 점검합니다.", en: "Internal review of message and finish." },
  },
  {
    step: 5,
    title: { ko: "고객 확인", en: "Customer review" },
    desc: { ko: "패키지 수정 횟수 안에서 확인·조율을 진행합니다.", en: "Review and adjust within revision allowance." },
  },
  {
    step: 6,
    title: { ko: "결과물 전달", en: "Delivery" },
    desc: { ko: "확정 결과물을 등록·전달합니다.", en: "Deliver and register finalized assets." },
  },
];

export const marketingSamples: MarketingSample[] = [
  {
    id: "landing-sample",
    title: { ko: "랜딩페이지 화면 Sample", en: "Landing page sample" },
    kind: { ko: "랜딩", en: "Landing" },
    status: "sample",
    tone: "from-violet-200 to-white",
  },
  {
    id: "sns-sample",
    title: { ko: "SNS 카드 Sample", en: "SNS card sample" },
    kind: { ko: "SNS", en: "SNS" },
    status: "sample",
    tone: "from-sky-200 to-white",
  },
  {
    id: "shorts-sample",
    title: { ko: "Shorts 썸네일 Sample", en: "Shorts thumbnail sample" },
    kind: { ko: "Shorts", en: "Shorts" },
    status: "preparing",
    tone: "from-rose-200 to-white",
  },
  {
    id: "detail-sample",
    title: { ko: "상세페이지 Sample", en: "Detail page sample" },
    kind: { ko: "상세", en: "Detail" },
    status: "sample",
    tone: "from-amber-200 to-white",
  },
  {
    id: "blog-sample",
    title: { ko: "블로그/콘텐츠 Sample", en: "Blog / content sample" },
    kind: { ko: "콘텐츠", en: "Content" },
    status: "preparing",
    tone: "from-emerald-200 to-white",
  },
  {
    id: "campaign-sample",
    title: { ko: "캠페인 소재 Sample", en: "Campaign asset sample" },
    kind: { ko: "캠페인", en: "Campaign" },
    status: "preparing",
    tone: "from-fuchsia-200 to-white",
  },
];

export const memberPricingPreview = {
  free: { ko: "Free", en: "Free", fee: { ko: "0원", en: "₩0" } },
  basicMonthly: {
    ko: "Basic 월간",
    en: "Basic monthly",
    fee: { ko: "월 2,000원", en: "₩2,000 / month" },
  },
  basicYearly: {
    ko: "Basic 연간",
    en: "Basic yearly",
    fee: { ko: "연 20,000원", en: "₩20,000 / year" },
  },
  note: {
    ko: "회원료와 제작비는 별도입니다. 유료회원 할인·우선처리·전용 패키지는 정식 오픈 후 적용 예정입니다.",
    en: "Membership fees and production fees are separate. Member discounts, priority, and exclusive packages apply after official launch.",
  },
  benefits: {
    ko: ["제작상품 할인(예정)", "우선 처리(예정)", "일부 콘텐츠/자료 이용권(예정)", "회원 전용 패키지(예정)"],
    en: ["Production discount (planned)", "Priority handling (planned)", "Content/pass access (planned)", "Member-only packages (planned)"],
  },
};

export const intakeChannelOptions: Localized[] = [
  { ko: "인스타그램", en: "Instagram" },
  { ko: "블로그", en: "Blog" },
  { ko: "유튜브/Shorts", en: "YouTube / Shorts" },
  { ko: "자사 사이트", en: "Owned website" },
  { ko: "기타", en: "Other" },
];

export const budgetRangeOptions: Localized[] = [
  { ko: "5만 원 이하", en: "Under ₩50,000" },
  { ko: "5–15만 원", en: "₩50k–150k" },
  { ko: "15–30만 원", en: "₩150k–300k" },
  { ko: "30만 원 이상 / 별도 견적", en: "₩300k+ / custom quote" },
];

export function getPackageById(id: MarketingPackageId): MarketingPackage | undefined {
  return marketingPackages.find((p) => p.id === id);
}

export function buildWorkOrderDraft(input: {
  packageId: MarketingPackageId;
  requirement: MarketingWorkOrderDraft["customerRequirement"];
  membershipTier?: MarketingWorkOrderDraft["memberBenefitPreview"];
}): MarketingWorkOrderDraft {
  const pkg = getPackageById(input.packageId);
  return {
    schemaVersion: 1,
    serviceType: "marketing_promo_production",
    packageId: input.packageId,
    serviceIds: input.requirement.deliverables.length
      ? input.requirement.deliverables
      : pkg?.suggestedServiceIds ?? [],
    customerRequirement: input.requirement,
    revisionAllowance: pkg?.revisionAllowance ?? 0,
    memberBenefitPreview: input.membershipTier,
    previewGeneratedAt: new Date().toISOString(),
  };
}
