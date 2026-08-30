import { cn } from "@/lib/utils";
import type { SotongProduct } from "@/types/product";
import {
  getRevenueDisplayBadges,
  REVENUE_BADGE_LABELS,
  type RevenueDisplayBadge,
} from "@/lib/commerce";
import { ACCESS_LABELS, STATUS_LABELS, APP_RELEASE_LABELS } from "@/lib/products";

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
}: {
  product: SotongProduct;
  className?: string;
  max?: number;
}) {
  const badges = getRevenueDisplayBadges(product).slice(0, max);

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
          {REVENUE_BADGE_LABELS[badge]}
        </span>
      ))}
    </div>
  );
}

/** @deprecated RevenueStatusBadges 사용 권장 — 하위 호환 */
export function ProductStatusBadge({
  status,
  className,
}: {
  status: SotongProduct["status"];
  className?: string;
}) {
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
      {STATUS_LABELS[status]}
    </span>
  );
}

export function AccessModeBadge({
  accessMode,
  className,
}: {
  accessMode: SotongProduct["accessMode"];
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium bg-surface-100 text-surface-700 ring-1 ring-surface-200",
        accessMode === "free" && "bg-emerald-50 text-emerald-700 ring-emerald-200",
        accessMode === "paid" && "bg-brand-50 text-brand-700 ring-brand-200",
        className,
      )}
    >
      {ACCESS_LABELS[accessMode]}
    </span>
  );
}

export function AppReleaseBadge({ status }: { status?: string }) {
  if (!status) return null;
  return (
    <span className="inline-flex rounded-md bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-700">
      {APP_RELEASE_LABELS[status] ?? status}
    </span>
  );
}
