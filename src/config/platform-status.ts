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
    "온라인 문의 접수를 준비하고 있습니다. 각 전문 서비스 사이트를 먼저 둘러보실 수 있습니다.",
  not_configured: "온라인 문의 접수를 준비하고 있습니다.",
};
