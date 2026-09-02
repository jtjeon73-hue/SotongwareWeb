import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { SotongProduct } from "@/types/product";
import { catalogUi, REVENUE_BADGE_LABELS } from "@/i18n/product-labels";
import { getLocalizedProduct } from "@/lib/product-i18n";
import { getRevenueDisplayBadges } from "@/lib/commerce";
import { productDetailPath } from "@/lib/products";
import { localizePath } from "@/i18n/localized-path";
import { cn } from "@/lib/utils";

interface FeaturedProductShowcaseProps {
  product: SotongProduct;
  locale: Locale;
}

const BADGE_STYLES: Record<string, string> = {
  free: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  testing: "bg-amber-50 text-amber-700 ring-amber-200",
  launch_preparing: "bg-amber-50 text-amber-700 ring-amber-200",
};

function PhoneMockup({ product, locale }: { product: SotongProduct; locale: Locale }) {
  const localized = getLocalizedProduct(product, locale);
  const features = localized.features?.slice(0, 3) ?? [];

  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <div className="rounded-[2rem] border-[10px] border-surface-900 bg-surface-900 p-1 shadow-2xl">
        <div className="overflow-hidden rounded-[1.4rem] bg-white">
          <div className="flex items-center justify-between bg-brand-600 px-4 py-2.5">
            <span className="text-xs font-semibold text-white">SotongWare</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white">Beta</span>
          </div>
          <div className="space-y-2 p-4">
            <div className="h-2 w-2/3 rounded bg-surface-200" />
            <div className="h-2 w-full rounded bg-surface-100" />
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2 rounded-lg border border-surface-100 bg-surface-50 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-brand-500" aria-hidden="true" />
                <span className="line-clamp-1 text-[11px] text-surface-700">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedProductShowcase({ product, locale }: FeaturedProductShowcaseProps) {
  const ui = catalogUi[locale];
  const localized = getLocalizedProduct(product, locale);
  const href = localizePath(productDetailPath(product), locale);
  const badges = getRevenueDisplayBadges(product).slice(0, 4);
  const labels = REVENUE_BADGE_LABELS[locale];

  return (
    <article className="overflow-hidden rounded-2xl border border-surface-200 bg-gradient-to-br from-brand-50/40 via-white to-surface-50 shadow-sm">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_minmax(240px,320px)] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className={cn(
                  "inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1",
                  BADGE_STYLES[badge] ?? "bg-surface-100 text-surface-700 ring-surface-200",
                )}
              >
                {labels[badge]}
              </span>
            ))}
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">
            {localized.title}
          </h2>
          {localized.subtitle && (
            <p className="mt-2 text-base font-medium text-brand-700">{localized.subtitle}</p>
          )}
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-surface-600 sm:text-base">
            {localized.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={href}
              className="inline-flex min-h-11 items-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              {ui.viewDetails}
            </Link>
            <Link
              href={localizePath("/apps", locale)}
              className="inline-flex min-h-11 items-center rounded-lg border border-surface-300 px-4 py-2.5 text-sm font-medium text-surface-800 hover:bg-surface-50"
            >
              {ui.exploreVentures}
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <PhoneMockup product={product} locale={locale} />
        </div>
      </div>
    </article>
  );
}
