import type { AccessTier, OpsStatus } from "@/types/access-tier";
import type { Locale } from "@/i18n/config";
import { accessTierLabels, opsStatusLabels } from "@/lib/access-tier";

const TIER_STYLES: Record<AccessTier, string> = {
  free: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  member: "bg-sky-50 text-sky-800 ring-sky-200",
  premium: "bg-violet-50 text-violet-800 ring-violet-200",
};

const STATUS_STYLES: Record<OpsStatus, string> = {
  live: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  preparing: "bg-amber-50 text-amber-900 ring-amber-200",
  comingSoon: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function AccessBadge({
  tier,
  locale,
  className = "",
}: {
  tier: AccessTier;
  locale: Locale;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${TIER_STYLES[tier]} ${className}`}
    >
      {accessTierLabels[locale][tier]}
    </span>
  );
}

export function OpsStatusBadge({
  status,
  locale,
  className = "",
}: {
  status: OpsStatus;
  locale: Locale;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${STATUS_STYLES[status]} ${className}`}
    >
      {opsStatusLabels[locale][status]}
    </span>
  );
}
