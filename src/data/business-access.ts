import type { BusinessPortalAccess } from "@/types/membership";
import type { ProductType } from "@/types/product";

/**
 * 사업별 포털 접근 정책 — 공개 마케팅 데이터와 분리
 * 가격·결제 상태는 포함하지 않음
 */
export const businessPortalAccess: Record<ProductType, BusinessPortalAccess> = {
  automation: {
    businessId: "automation",
    accessLevel: "public",
    publicationStatus: "published",
    memberCtaLabel: "서비스 상세 보기",
    memberCtaHref: "/automation",
  },
  app: {
    businessId: "app",
    accessLevel: "public",
    publicationStatus: "published",
    memberCtaLabel: "앱 서비스 보기",
    memberCtaHref: "/apps",
  },
  ebook: {
    businessId: "ebook",
    accessLevel: "public",
    publicationStatus: "published",
    memberCtaLabel: "전자책 서비스 보기",
    memberCtaHref: "/ebooks",
  },
  knowledge: {
    businessId: "knowledge",
    accessLevel: "member",
    publicationStatus: "published",
    memberCtaLabel: "무료 회원으로 보기",
    memberCtaHref: "/signup?redirect=/dashboard",
  },
  marketing: {
    businessId: "marketing",
    accessLevel: "public",
    publicationStatus: "published",
    memberCtaLabel: "마케팅 서비스 보기",
    memberCtaHref: "/marketing",
  },
  content: {
    businessId: "content",
    accessLevel: "member",
    publicationStatus: "published",
    memberCtaLabel: "무료 콘텐츠 이용하기",
    memberCtaHref: "/signup?redirect=/dashboard",
  },
};

export function getBusinessPortalAccess(businessId: ProductType): BusinessPortalAccess {
  return businessPortalAccess[businessId];
}

/**
 * 공유 Firebase Auth 연동 전까지 회원/프리미엄 사업의 외부 사이트 직접 링크 비노출
 */
export function canExposeExternalSiteLink(businessId: ProductType): boolean {
  return businessPortalAccess[businessId].accessLevel === "public";
}

export const EXTERNAL_SITE_SECURITY_NOTICE =
  "전문 사이트 링크는 해당 사이트 접근을 보호하지 않습니다. 회원·프리미엄 콘텐츠는 공유 인증이 연동된 후에만 외부 사이트에서 이용할 수 있습니다.";

export const EXTERNAL_SITE_MEMBER_NOTICE =
  "이 사업의 외부 전문 사이트는 공유 인증이 아직 연동되지 않았습니다. 회원·프리미엄 콘텐츠는 SotongWare 포털에서 이용해 주세요.";

export const accessLevelLabels: Record<BusinessPortalAccess["accessLevel"], string> = {
  public: "공개",
  member: "회원 무료",
  premium: "프리미엄",
};

export const publicationStatusLabels: Record<BusinessPortalAccess["publicationStatus"], string> = {
  draft: "준비 중",
  published: "이용 가능",
  comingSoon: "준비 중",
};
