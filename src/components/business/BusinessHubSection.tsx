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
          description="무엇을 해주는지, 누구에게 필요한지, 다음 행동이 무엇인지 — 각 사업을 판매 가능한 서비스처럼 안내합니다."
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
