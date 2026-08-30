import {
  getContactProductionStatus,
  CONTACT_STATUS_MESSAGES,
  type ContactProductionStatus,
} from "@/config/platform-status";

const STATUS_STYLES: Record<ContactProductionStatus, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-900",
  blocked_billing: "border-amber-200 bg-amber-50 text-amber-900",
  not_configured: "border-surface-200 bg-surface-50 text-surface-700",
};

export function ContactProductionBanner() {
  const status = getContactProductionStatus();

  return (
    <div className={`mb-6 rounded-xl border p-4 text-sm ${STATUS_STYLES[status]}`}>
      <p className="font-semibold">
        {status === "active" && "문의 접수 가능"}
        {status === "blocked_billing" && "문의 접수 준비 중"}
        {status === "not_configured" && "문의 시스템 설정 중"}
      </p>
      <p className="mt-1 leading-relaxed">{CONTACT_STATUS_MESSAGES[status]}</p>
      {status === "blocked_billing" && (
        <p className="mt-2 text-xs opacity-80">
          상태 코드: BLOCKED_BY_FIREBASE_BILLING — Firebase Blaze 플랜 활성화 후 Functions 배포 예정
        </p>
      )}
    </div>
  );
}
