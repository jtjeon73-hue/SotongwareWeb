import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "Insights",
  description: "기술자료, 사업정보, AI 활용, 산업자동화 인사이트",
};

export default function InsightsPage() {
  return (
    <PlaceholderPage
      title="Insights"
      description="기술자료, 사업 정보, AI 활용, 산업자동화, 앱·웹·콘텐츠 관련 인사이트가 제공됩니다."
      backHref="/"
      backLabel="홈으로"
    />
  );
}
