import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { siteConfig } from "@/data/navigation";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description: `${siteConfig.name} 소개`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="About SotongWare"
      description="기술과 디지털 자산을 만들어 실제 문제를 해결하고 지속적인 가치를 만드는 기술 기반 디지털 제작 회사, 소통웨어입니다."
      backHref="/"
      backLabel="홈으로"
    />
  );
}
