import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { siteConfig } from "@/data/navigation";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.name} 소개`,
};

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
