import type { BusinessArea } from "@/types/product";
import { ServiceIcon } from "@/components/ui/Icons";
import { TrackedBusinessLink } from "@/components/product/StoreLinks";

export function BusinessHubCard({ area }: { area: BusinessArea }) {
  return (
    <article className="group flex flex-col rounded-xl border border-surface-200 bg-white p-5 transition-colors hover:border-brand-300 sm:p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100">
        <ServiceIcon name={area.icon} />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-600">
        {area.title}
      </p>
      <h3 className="mt-1 text-lg font-bold text-surface-900">{area.titleKo}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600">
        {area.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <TrackedBusinessLink
          href={area.href}
          label={area.ctas[0]?.label ?? "둘러보기"}
          businessType={area.id}
          ctaName={area.ctas[0]?.label ?? "browse"}
          variant="primary"
        />
        {area.ctas[1] && (
          <TrackedBusinessLink
            href={area.ctas[1].href}
            label={area.ctas[1].label}
            businessType={area.id}
            ctaName={area.ctas[1].label}
            variant="outline"
          />
        )}
      </div>
    </article>
  );
}
