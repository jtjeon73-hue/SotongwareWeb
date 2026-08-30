import type { BusinessArea } from "@/types/product";
import { ServiceIcon } from "@/components/ui/Icons";
import {
  BusinessDetailLink,
  BusinessExternalSiteLink,
  BusinessContactLink,
  BusinessSiteStatusBadge,
  RevenueModelTag,
  ConversionHintTags,
} from "./BusinessActions";

export function BusinessHubCard({ area }: { area: BusinessArea }) {
  return (
    <article className="group flex flex-col rounded-xl border border-surface-200 bg-white p-5 transition-colors hover:border-brand-300 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100">
          <ServiceIcon name={area.icon} />
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          <RevenueModelTag label={area.revenueModel} />
          <BusinessSiteStatusBadge status={area.siteStatus} />
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-600">
        {area.title}
      </p>
      <h3 className="mt-1 text-lg font-bold text-surface-900">{area.titleKo}</h3>
      <p className="mt-2 text-sm font-medium text-surface-800">{area.tagline}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600">
        {area.description}
      </p>
      {area.platforms && (
        <p className="mt-3 text-xs font-medium text-surface-500">{area.platforms}</p>
      )}
      {area.audience && (
        <p className="mt-1 text-xs text-surface-400">대상: {area.audience}</p>
      )}
      <div className="mt-4">
        <ConversionHintTags hints={area.conversionHints} />
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <BusinessDetailLink area={area} className="w-full sm:w-auto" />
        <BusinessExternalSiteLink
          area={area}
          className="w-full sm:w-auto"
          label="전문 사이트 방문 ↗"
        />
      </div>
      {area.ctas.length > 0 && (
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {area.ctas.map((cta) => (
            <BusinessContactLink
              key={cta.href + cta.label}
              href={cta.href}
              label={cta.label}
              businessType={area.id}
              className="w-full sm:w-auto"
            />
          ))}
        </div>
      )}
    </article>
  );
}
