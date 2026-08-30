import { businessAreas } from "@/data/businesses";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BusinessExternalSiteLink, BusinessDetailLink } from "./BusinessActions";
import { siteConfig } from "@/data/navigation";

export function BusinessNetworkSection() {
  const topRow = businessAreas.slice(0, 4);
  const bottomRow = businessAreas.slice(4);

  return (
    <section className="section-padding bg-surface-50" aria-labelledby="business-network-heading">
      <div className="container-main">
        <SectionHeader
          id="business-network-heading"
          eyebrow="SotongWare Business Network"
          title="한 곳에서 시작해 필요한 전문 서비스로 바로 연결됩니다"
          description={`${siteConfig.name}는 6개 전문 사업 채널을 직접 운영합니다. 내부 소개에서 시작해 각 전문 사이트로 이동할 수 있습니다.`}
        />

        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center">
            <div className="rounded-xl border-2 border-brand-600 bg-white px-6 py-3 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Central Hub</p>
              <p className="mt-1 text-lg font-bold text-surface-900">{siteConfig.name}</p>
            </div>
            <div className="h-8 w-px bg-brand-300" aria-hidden="true" />
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
              {topRow.map((area) => (
                <NetworkNode key={area.id} area={area} />
              ))}
            </div>
            <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-3">
              {bottomRow.map((area) => (
                <NetworkNode key={area.id} area={area} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NetworkNode({ area }: { area: (typeof businessAreas)[number] }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-surface-200 bg-white p-3 text-center sm:p-4">
      <p className="text-sm font-semibold text-surface-900">{area.titleKo}</p>
      <p className="mt-1 text-xs text-surface-500">{area.revenueModel}</p>
      <div className="mt-3 flex w-full flex-col gap-1.5">
        <BusinessDetailLink
          area={area}
          className="!min-h-9 w-full !px-2 !py-1.5 !text-xs"
        />
        {area.externalSiteUrl && area.siteStatus !== "coming-soon" && (
          <BusinessExternalSiteLink
            area={area}
            className="!min-h-9 w-full !px-2 !py-1.5 !text-xs"
          />
        )}
      </div>
    </div>
  );
}
