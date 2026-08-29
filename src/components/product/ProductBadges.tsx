import { cn } from "@/lib/utils";
import type { SotongProduct } from "@/types/product";
import { ACCESS_LABELS, STATUS_LABELS, APP_RELEASE_LABELS } from "@/lib/products";

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
