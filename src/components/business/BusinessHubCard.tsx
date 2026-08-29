import Link from "next/link";
import type { BusinessArea } from "@/types/product";
import { ServiceIcon } from "@/components/ui/Icons";

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
        <Link
          href={area.href}
          className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          {area.ctas[0]?.label ?? "둘러보기"}
        </Link>
        {area.ctas[1] && (
          <Link
            href={area.ctas[1].href}
            className="inline-flex items-center rounded-lg border border-surface-200 px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50"
          >
            {area.ctas[1].label}
          </Link>
        )}
      </div>
    </article>
  );
}
