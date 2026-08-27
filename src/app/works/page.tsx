import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "Works",
  description: "SotongWare 결과물 — 앱, 전자책, 웹사이트, 자동화, 콘텐츠",
};

export default function WorksPage() {
  return (
    <PlaceholderPage
      title="Works"
      description="SotongWare가 제작한 앱, 전자책, 웹사이트, 자동화 프로그램, 음악, Shorts 등 모든 결과물이 이곳에 표시됩니다."
      backHref="/"
      backLabel="홈으로"
    />
  );
}
