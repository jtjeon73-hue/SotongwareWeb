import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface AccessDeniedProps {
  title?: string;
  description?: string;
  showLoginCta?: boolean;
  showDashboardCta?: boolean;
}

export function AccessDenied({
  title = "이용 권한이 필요합니다",
  description = "이 콘텐츠를 보려면 회원 가입 또는 프리미엄 이용 권한이 필요합니다.",
  showLoginCta = true,
  showDashboardCta = false,
}: AccessDeniedProps) {
  return (
    <div className="rounded-xl border border-surface-200 bg-surface-50 p-6 text-center">
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-200 text-surface-500"
        aria-hidden="true"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 018 0v4" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold text-surface-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-surface-600">{description}</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        {showLoginCta && (
          <Button href="/login" variant="primary" className="min-h-11">
            로그인
          </Button>
        )}
        {showDashboardCta && (
          <Button href="/dashboard" variant="outline" className="min-h-11">
            대시보드로
          </Button>
        )}
        <Link
          href="/guide"
          className="inline-flex min-h-11 items-center justify-center text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          이용 안내 보기 →
        </Link>
      </div>
    </div>
  );
}
