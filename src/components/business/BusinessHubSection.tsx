import { businessAreas } from "@/data/businesses";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BusinessHubCard } from "./BusinessHubCard";

export function BusinessHubSection() {
  return (
    <section className="section-padding bg-white" aria-labelledby="business-hub-heading">
      <div className="container-main">
        <SectionHeader
          id="business-hub-heading"
          eyebrow="Digital Business Hub"
          title="6대 사업 영역"
          description="산업자동화, 앱, 전자책, 지식·교육, 마케팅, 콘텐츠 — SotongWare가 직접 운영하는 6대 전문 사업 채널"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businessAreas.map((area) => (
            <BusinessHubCard key={area.id} area={area} />
          ))}
        </div>
      </div>
    </section>
  );
}
