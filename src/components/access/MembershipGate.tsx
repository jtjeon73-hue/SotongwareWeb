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
      ? "Sign in with a membership or purchase to unlock this content. Checkout opening is preparing."
      : "회원 또는 구매 이용권으로 로그인하면 이 콘텐츠를 열 수 있습니다. 결제 오픈은 준비 중입니다.");

  return (
    <div
      className={`rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm ${className}`}
      role="status"
    >
      <p className="text-sm font-semibold text-amber-950">{t}</p>
      <p className="mt-2 text-sm leading-relaxed text-amber-900/80">{d}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <LocalizedButton href="/signup" variant="outline" size="sm" className="min-h-10">
          {locale === "en" ? "Sign up" : "회원가입"}
        </LocalizedButton>
        <LocalizedButton href="/login" variant="primary" size="sm" className="min-h-10">
          {locale === "en" ? "Sign in" : "로그인"}
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
