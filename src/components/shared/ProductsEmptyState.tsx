"use client";

import { useLocale } from "@/contexts/LocaleProvider";
import { emptyStateLabels, pipelineVentures } from "@/i18n/product-labels";
import { LocalizedButton } from "@/components/locale/LocalizedButton";

interface ProductsEmptyStateProps {
  compact?: boolean;
  typeLabel?: string;
}

export function ProductsEmptyState({ compact = false, typeLabel }: ProductsEmptyStateProps) {
  const { locale } = useLocale();
  const labels = emptyStateLabels[locale];
  const pipeline = pipelineVentures[locale];

  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-surface-200 bg-gradient-to-br from-surface-50 via-white to-brand-50/20 p-6 sm:p-8"
          : "rounded-2xl border border-surface-200 bg-gradient-to-br from-surface-50 via-white to-brand-50/20 p-8 sm:p-10"
      }
    >
      <p className="text-sm font-medium text-brand-600">
        {typeLabel ? labels.catalogForType(typeLabel) : labels.catalog}
      </p>
      <h3 className="mt-2 text-xl font-bold tracking-tight text-surface-900 sm:text-2xl">
        {labels.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-surface-600 sm:text-base">{labels.description}</p>

      {!compact && (
        <>
          <div className="mt-6 rounded-xl border border-surface-200 bg-white/80 p-4 sm:p-5">
            <h4 className="text-sm font-semibold text-surface-900">{labels.criteriaTitle}</h4>
            <ul className="mt-3 space-y-2">
              {labels.criteriaItems.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-surface-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-surface-900">{labels.pipelineTitle}</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {pipeline.map((item) => (
                <LocalizedButton
                  key={item.id}
                  href={item.href}
                  variant="outline"
                  className="min-h-9 text-xs sm:text-sm"
                >
                  {item.label}
                </LocalizedButton>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-surface-500">{labels.note}</p>
        </>
      )}

      <div className="mt-8 flex flex-col gap-3 border-t border-surface-100 pt-6 sm:flex-row sm:flex-wrap">
        <LocalizedButton href="/apps" variant="primary" className="min-h-11">
          {labels.ctaServices}
        </LocalizedButton>
        <LocalizedButton href="/contact" variant="outline" className="min-h-11">
          {labels.ctaContact}
        </LocalizedButton>
        <LocalizedButton href="/works" variant="outline" className="min-h-11">
          {labels.ctaProducts}
        </LocalizedButton>
      </div>
    </div>
  );
}
