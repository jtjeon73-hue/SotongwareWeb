import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WorksEmptyState } from "@/components/shared/WorksEmptyState";

export const metadata: Metadata = {
  title: "Works",
  description: "SotongWare 결과물 — 앱, 전자책, 웹사이트, 자동화, 콘텐츠",
};

export default function WorksPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow="Portfolio"
          title="Works"
          description="SotongWare가 제작하고 배포한 앱, 전자책, 웹사이트, 산업 프로그램, 음악, Shorts 등 모든 결과물입니다."
        />
        <WorksEmptyState />
      </div>
    </div>
  );
}
