import Link from "next/link";
import {
  getContactProductionStatus,
  CONTACT_STATUS_MESSAGES,
  type ContactProductionStatus,
} from "@/config/platform-status";

const STATUS_STYLES: Record<ContactProductionStatus, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-900",
  blocked_billing: "border-surface-200 bg-surface-50 text-surface-800",
  not_configured: "border-surface-200 bg-surface-50 text-surface-700",
};

const STATUS_TITLES: Record<ContactProductionStatus, string> = {
  active: "문의 접수 가능",
  blocked_billing: "문의 서비스 준비 중",
  not_configured: "문의 서비스 준비 중",
};

export function ContactProductionBanner() {
  const status = getContactProductionStatus();

  return (
    <div className={`mb-6 rounded-xl border p-4 text-sm ${STATUS_STYLES[status]}`}>
      <p className="font-semibold">{STATUS_TITLES[status]}</p>
      <p className="mt-1 leading-relaxed">{CONTACT_STATUS_MESSAGES[status]}</p>
      {status !== "active" && (
        <p className="mt-3 text-sm">
          <Link
            href="/#business-hub-heading"
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            6대 전문 서비스 둘러보기 →
          </Link>
        </p>
      )}
    </div>
  );
}
