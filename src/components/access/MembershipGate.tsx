import type { Locale } from "@/i18n/config";
import { LocalizedButton } from "@/components/locale/LocalizedButton";
import { LocalizedLink } from "@/components/locale/LocalizedLink";

export function MembershipGate({
  locale,
  title,
  description,
  className = "",
}: {
  locale: Locale;
  title?: string;
  description?: string;
  className?: string;
}) {
  const t =
    title ??
    (locale === "en" ? "Membership or a pass is required" : "회원 또는 이용권이 필요합니다");
  const d =
    description ??
    (locale === "en"
      ? "This is a preview lock. Real sign-up and payments are not open yet—use the preview persona or check pricing when ready."
      : "Preview 잠금 안내입니다. 실제 회원가입·결제는 아직 열리지 않았습니다. Preview 권한을 바꾸거나 요금·결제 준비 현황을 확인하세요.");

  return (
    <div
      className={`rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm ${className}`}
      role="status"
    >
      <p className="text-sm font-semibold text-amber-950">{t}</p>
      <p className="mt-2 text-sm leading-relaxed text-amber-900/80">{d}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <LocalizedButton href="/signup" variant="outline" size="sm" className="min-h-10">
          {locale === "en" ? "Sign up (preparing)" : "회원가입 (준비중)"}
        </LocalizedButton>
        <LocalizedButton href="/preview/commerce/service" variant="primary" size="sm" className="min-h-10">
          {locale === "en" ? "Pricing preview" : "요금·결제 Preview"}
        </LocalizedButton>
        <LocalizedLink
          href="/guide"
          className="inline-flex min-h-10 items-center px-2 text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          {locale === "en" ? "Usage guide" : "이용 안내"}
        </LocalizedLink>
      </div>
    </div>
  );
}

export function ComingSoonCta({ locale, label }: { locale: Locale; label?: string }) {
  return (
    <span className="inline-flex min-h-10 items-center rounded-lg border border-surface-200 bg-surface-50 px-3 text-sm font-medium text-surface-600">
      {label ?? (locale === "en" ? "Available after official launch" : "정식 서비스 오픈 후 이용 가능")}
    </span>
  );
}
