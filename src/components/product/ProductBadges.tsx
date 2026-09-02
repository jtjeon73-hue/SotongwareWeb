"use client";

import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { SotongProduct } from "@/types/product";
import { getRevenueDisplayBadges, type RevenueDisplayBadge } from "@/lib/commerce";
import { REVENUE_BADGE_LABELS, ACCESS_LABELS, STATUS_LABELS, APP_RELEASE_LABELS } from "@/i18n/product-labels";
import { useLocale } from "@/contexts/LocaleProvider";

const REVENUE_BADGE_STYLES: Record<RevenueDisplayBadge, string> = {
  free: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paid: "bg-brand-50 text-brand-700 ring-brand-200",
  subscription: "bg-violet-50 text-violet-700 ring-violet-200",
  inquiry: "bg-surface-100 text-surface-700 ring-surface-200",
  member: "bg-amber-50 text-amber-800 ring-amber-200",
  launch_preparing: "bg-amber-50 text-amber-700 ring-amber-200",
  on_sale: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  testing: "bg-amber-50 text-amber-700 ring-amber-200",
};

export function RevenueStatusBadges({
  product,
  className,
  max = 4,
  locale: localeProp,
}: {
  product: SotongProduct;
  className?: string;
  max?: number;
  locale?: Locale;
}) {
  const { locale: ctxLocale } = useLocale();
  const locale = localeProp ?? ctxLocale;
  const badges = getRevenueDisplayBadges(product).slice(0, max);
  const labels = REVENUE_BADGE_LABELS[locale];

  if (badges.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {badges.map((badge) => (
        <span
          key={badge}
          className={cn(
            "inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1",
            REVENUE_BADGE_STYLES[badge],
          )}
        >
          {labels[badge]}
        </span>
      ))}
    </div>
  );
}

export function ProductStatusBadge({
  status,
  className,
  locale: localeProp,
}: {
  status: SotongProduct["status"];
  className?: string;
  locale?: Locale;
}) {
  const { locale: ctxLocale } = useLocale();
  const locale = localeProp ?? ctxLocale;

  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
        status === "published" && "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        status === "ready" && "bg-brand-50 text-brand-700 ring-1 ring-brand-200",
        status === "testing" && "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        (status === "draft" || status === "archived") && "bg-surface-100 text-surface-600 ring-1 ring-surface-200",
        className,
      )}
    >
      {STATUS_LABELS[locale][status]}
    </span>
  );
}

export function AccessModeBadge({
  accessMode,
  className,
  locale: localeProp,
}: {
  accessMode: SotongProduct["accessMode"];
  className?: string;
  locale?: Locale;
}) {
  const { locale: ctxLocale } = useLocale();
  const locale = localeProp ?? ctxLocale;

  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium bg-surface-100 text-surface-700 ring-1 ring-surface-200",
        accessMode === "free" && "bg-emerald-50 text-emerald-700 ring-emerald-200",
        accessMode === "paid" && "bg-brand-50 text-brand-700 ring-brand-200",
        className,
      )}
    >
      {ACCESS_LABELS[locale][accessMode]}
    </span>
  );
}

export function AppReleaseBadge({ status, locale: localeProp }: { status?: string; locale?: Locale }) {
  const { locale: ctxLocale } = useLocale();
  const locale = localeProp ?? ctxLocale;
  if (!status) return null;
  return (
    <span className="inline-flex rounded-md bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-700">
      {APP_RELEASE_LABELS[locale][status] ?? status}
    </span>
  );
}
