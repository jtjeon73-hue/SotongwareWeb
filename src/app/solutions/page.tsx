import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Solutions",
  description: "비즈니스 자동화, AI 활용, 디지털 사업, 산업 솔루션",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <PlaceholderPage
      title="Solutions"
      description="방문자의 목적에 맞는 솔루션을 찾을 수 있는 영역입니다. Business Automation, AI Utilization, Digital Business, Industrial Solutions로 확장됩니다."
      backHref="/"
      backLabel="홈으로"
    />
  );
}
