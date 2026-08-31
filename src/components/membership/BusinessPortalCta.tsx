"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";
import { getBusinessPortalAccess } from "@/data/business-access";
import type { BusinessArea } from "@/types/product";
import { AccessLevelBadge } from "@/components/membership/AccessLevelBadge";
import { cn } from "@/lib/utils";

export function BusinessPortalCta({
  area,
  className,
}: {
  area: BusinessArea;
  className?: string;
}) {
  const { user, loading } = useAuth();
  const portal = getBusinessPortalAccess(area.id);

  if (portal.publicationStatus !== "published") {
    return (
      <span
        className={cn(
          "inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-surface-200 bg-surface-50 px-4 py-2 text-sm font-medium text-surface-500 sm:w-auto",
          className,
        )}
      >
        준비 중
      </span>
    );
  }

  let href = portal.memberCtaHref;
  let label = portal.memberCtaLabel;

  if (portal.accessLevel === "member") {
    if (user) {
      href = "/dashboard";
      label = "대시보드에서 보기";
    } else {
      href = "/signup?redirect=/dashboard";
      label = "무료 회원으로 보기";
    }
  } else if (portal.accessLevel === "premium") {
    href = user ? "/dashboard" : "/signup?redirect=/dashboard";
    label = user ? "프리미엄 이용 안내" : "로그인하고 자세히 보기";
  }

  if (loading) {
    return (
      <span
        className={cn(
          "inline-flex min-h-11 w-full animate-pulse rounded-lg bg-surface-100 sm:w-auto",
          className,
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100 sm:w-auto",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export function BusinessAccessBadges({ area }: { area: BusinessArea }) {
  const portal = getBusinessPortalAccess(area.id);
  return (
    <AccessLevelBadge
      accessLevel={portal.accessLevel}
      publicationStatus={portal.publicationStatus}
    />
  );
}
