import { isFirebaseConfigured } from "@/lib/firebase";

export type ContactProductionStatus =
  | "active"
  | "blocked_billing"
  | "not_configured";

/**
 * Contact production 상태.
 * Blaze 업그레이드 + Functions 배포 후 NEXT_PUBLIC_CONTACT_PRODUCTION_READY=true 로 활성화.
 */
export function getContactProductionStatus(): ContactProductionStatus {
  if (!isFirebaseConfigured()) return "not_configured";
  if (process.env.NEXT_PUBLIC_CONTACT_PRODUCTION_READY === "true") {
    return "active";
  }
  return "blocked_billing";
}

export function isContactSubmissionAvailable(): boolean {
  return getContactProductionStatus() === "active";
}

export const CONTACT_STATUS_MESSAGES: Record<ContactProductionStatus, string> = {
  active: "문의가 접수되면 담당자가 영업일 기준으로 순차 답변합니다.",
  blocked_billing:
    "문의 접수 시스템은 준비되었으나 Firebase Blaze 플랜 활성화 후 배포 예정입니다. 긴급 문의는 전문 사이트 또는 이메일로 연락해 주세요.",
  not_configured: "문의 시스템 설정이 진행 중입니다.",
};
