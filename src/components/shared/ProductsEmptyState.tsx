"use client";

import { useLocale } from "@/contexts/LocaleProvider";
import { emptyStateLabels } from "@/i18n/product-labels";
import { LocalizedButton } from "@/components/locale/LocalizedButton";

interface ProductsEmptyStateProps {
  compact?: boolean;
  typeLabel?: string;
}

export function ProductsEmptyState({ compact = false, typeLabel }: ProductsEmptyStateProps) {
  const { locale } = useLocale();
  const labels = emptyStateLabels[locale];

  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-surface-200 bg-white p-6 sm:p-8"
          : "rounded-2xl border border-surface-200 bg-white p-8 sm:p-10"
      }
    >
      <p className="text-sm font-medium text-brand-600">
        {typeLabel ? `${typeLabel} Catalog` : labels.catalog}
      </p>
      <h3 className="mt-2 text-xl font-bold tracking-tight text-surface-900 sm:text-2xl">
        {labels.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-surface-600 sm:text-base">{labels.description}</p>

      {!compact && <p className="mt-4 text-sm text-surface-500">{labels.note}</p>}

      <div className="mt-8 flex flex-col gap-3 border-t border-surface-100 pt-6 sm:flex-row sm:flex-wrap">
        <LocalizedButton href="/#business-hub-heading" variant="primary" className="min-h-11">
          {labels.ctaServices}
        </LocalizedButton>
        <LocalizedButton href="/contact" variant="outline" className="min-h-11">
          {labels.ctaContact}
        </LocalizedButton>
        <LocalizedButton href="/products" variant="outline" className="min-h-11">
          {labels.ctaProducts}
        </LocalizedButton>
      </div>
    </div>
  );
}
