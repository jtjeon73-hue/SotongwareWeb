import { businessAreas } from "@/data/businesses";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceIcon } from "@/components/ui/Icons";
import { BusinessExternalSiteLink, BusinessDetailLink } from "./BusinessActions";

export function BusinessNetworkSection() {
  return (
    <section className="section-padding bg-surface-50" aria-labelledby="business-network-heading">
      <div className="container-main">
        <SectionHeader
          id="business-network-heading"
          eyebrow="SotongWare Business Network"
          title="하나의 SotongWare, 여섯 개의 전문 서비스"
          description="6개 사업은 별도 회사가 아니라 SotongWare Business Network 안의 전문 채널입니다. 필요한 분야를 선택하면 각 서비스와 결과물로 바로 연결됩니다."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businessAreas.map((area) => (
            <article
              key={area.id}
              className="flex flex-col rounded-xl border border-surface-200 bg-white p-5 transition-colors hover:border-brand-300"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <ServiceIcon name={area.icon} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-surface-900">{area.titleKo}</h3>
                  <p className="mt-1 text-sm font-medium text-brand-700">{area.tagline}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-surface-600">{area.revenueModel}</p>
              {area.platforms && (
                <p className="mt-2 text-xs text-surface-500">{area.platforms}</p>
              )}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <BusinessDetailLink
                  area={area}
                  className="!min-h-11 w-full sm:w-auto !px-3 !py-2 !text-sm"
                />
                {area.externalSiteUrl && area.siteStatus !== "coming-soon" && (
                  <BusinessExternalSiteLink
                    area={area}
                    className="!min-h-11 w-full sm:w-auto !px-3 !py-2 !text-sm"
                    label="전문 사이트 ↗"
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
