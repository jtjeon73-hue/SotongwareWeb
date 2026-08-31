import type { MemberContentPreview } from "@/types/membership";

/**
 * 회원 콘텐츠 미리보기 카탈로그 — 원문(body) 미포함
 * 실제 본문은 Firestore memberContents에서 권한 검증 후 로드
 */
export const memberContentCatalog: MemberContentPreview[] = [
  {
    id: "knowledge-welcome",
    businessId: "knowledge",
    title: "지식·교육 회원 안내",
    teaser: "회원 가입 후 이용할 수 있는 지식·교육 콘텐츠 안내입니다.",
    accessLevel: "member",
    publicationStatus: "published",
  },
  {
    id: "content-preview",
    businessId: "content",
    title: "콘텐츠 회원 미리보기",
    teaser: "회원 전용 콘텐츠 채널 소개 및 이용 방법입니다.",
    accessLevel: "member",
    publicationStatus: "published",
  },
  {
    id: "knowledge-premium-guide",
    businessId: "knowledge",
    title: "프리미엄 학습 가이드",
    teaser: "심화 학습 자료 — 프리미엄 이용 권한이 필요합니다.",
    accessLevel: "premium",
    publicationStatus: "comingSoon",
  },
];
