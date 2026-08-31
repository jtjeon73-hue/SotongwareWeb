"use client";

import Link from "next/link";
import type { BusinessArea } from "@/types/product";
import { getPublicExternalSiteUrl } from "@/lib/business-sites";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const btnPrimary =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700";
const btnOutline =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-surface-200 px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50";
const btnExternal =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-brand-300 bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700 hover:bg-brand-100";

function trackExternalSiteClick(area: BusinessArea): void {
  const params = {
    business_type: area.id,
    destination: "external",
    external_site: area.externalSiteName ?? area.titleKo,
  };
  if (area.id === "knowledge") {
    trackEvent("knowledge_site_click", params);
  }
  trackEvent("business_site_click", params);
}

export function BusinessDetailLink({
  area,
  className,
  label = "서비스 자세히",
}: {
  area: BusinessArea;
  className?: string;
  label?: string;
}) {
  return (
    <Link
      href={area.internalPath}
      className={className ?? btnPrimary}
      onClick={() =>
        trackEvent("business_detail_click", {
          business_type: area.id,
          destination: area.internalPath,
        })
      }
    >
      {label}
    </Link>
  );
}

export function BusinessExternalSiteLink({
  area,
  className,
  label,
}: {
  area: BusinessArea;
  className?: string;
  label?: string;
}) {
  if (!getPublicExternalSiteUrl(area) || area.siteStatus === "coming-soon") return null;

  const displayLabel = label ?? area.externalSiteLabel ?? "전문 사이트 방문 ↗";
  const siteUrl = getPublicExternalSiteUrl(area)!;

  return (
    <a
      href={siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? btnExternal}
      onClick={() => trackExternalSiteClick(area)}
    >
      {displayLabel}
    </a>
  );
}

export function BusinessContactLink({
  href,
  label,
  businessType,
  className,
}: {
  href: string;
  label: string;
  businessType: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={className ?? btnOutline}
      onClick={() =>
        trackEvent("contact_cta_click", {
          business_type: businessType,
          cta_name: label,
          destination: href,
        })
      }
    >
      {label}
    </Link>
  );
}

export function BusinessSiteStatusBadge({ status }: { status: BusinessArea["siteStatus"] }) {
  if (status === "active") return null;
  const label = status === "preparing" ? "서비스 확장 중" : "준비 중";
  return (
    <span className="inline-flex rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
      {label}
    </span>
  );
}

export function RevenueModelTag({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-md bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-600 ring-1 ring-surface-200">
      {label}
    </span>
  );
}

export function ConversionHintTags({ hints }: { hints?: string[] }) {
  if (!hints?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {hints.map((hint) => (
        <span
          key={hint}
          className={cn(
            "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
            hint.includes("준비")
              ? "bg-surface-50 text-surface-500 ring-1 ring-surface-200"
              : "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
          )}
        >
          {hint}
        </span>
      ))}
    </div>
  );
}
