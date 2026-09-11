import type { Metadata } from "next";
import Link from "next/link";
import { AccessDenied } from "@/components/auth/AccessDenied";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "접근 제한",
    description: "요청하신 페이지에 대한 이용 권한이 없습니다.",
    path: "/access-denied",
  }),
  robots: { index: false, follow: false },
};

export default function AccessDeniedPage() {
  return (
    <div className="section-padding bg-gradient-to-b from-slate-50 to-white">
      <div className="container-main max-w-lg">
        <AccessDenied
          title="접근이 제한되었습니다"
          description="이 페이지를 보려면 로그인이 필요하거나, 현재 계정에 권한이 없습니다. 화면 가드만으로는 보안이 보장되지 않으며 서버·Rules가 실제 보호를 담당합니다."
          showLoginCta
          showDashboardCta
        />
        <p className="mt-4 text-center text-sm text-slate-500">
          <Link href="/" className="text-sky-700 hover:text-sky-800">
            홈으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
