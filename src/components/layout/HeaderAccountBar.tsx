"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";
import { useAuthLocale } from "@/hooks/useAuthLocale";
import { authLabels } from "@/i18n/auth-labels";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";

/**
 * Desktop/mobile account + commerce-preview entry.
 * Does not enable Auth or real payments — routes stay fail-closed.
 */
export function HeaderAccountBar({
  locale: localeProp,
  compact = false,
  onNavigate,
}: {
  locale?: Locale;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { user, profile, loading } = useAuth();
  const authLocale = useAuthLocale();
  const locale = localeProp ?? authLocale;
  const labels = authLabels[locale];
  const pricingLabel = locale === "en" ? "Pricing" : "요금·결제";
  const pricingHint = locale === "en" ? "Preview · coming soon" : "미리보기 · 준비중";

  if (loading) {
    return (
      <div className={`flex shrink-0 items-center ${compact ? "flex-col gap-2 w-full" : "gap-1.5"}`}>
        <GuestLinks locale={locale} compact={compact} pricingLabel={pricingLabel} pricingHint={pricingHint} onNavigate={onNavigate} />
      </div>
    );
  }

  if (user) {
    const name = user.email?.split("@")[0] || profile?.displayName || labels.member;
    return (
      <div className={`flex shrink-0 items-center ${compact ? "w-full flex-col gap-2" : "gap-1.5"}`}>
        <Link
          href="/preview/commerce/service"
          onClick={onNavigate}
          className={
            compact
              ? "flex min-h-11 w-full items-center justify-between rounded-lg border border-brand-200 bg-brand-50 px-3 text-sm font-medium text-brand-800"
              : "hidden whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 xl:inline-flex"
          }
          title={pricingHint}
        >
          <span>{pricingLabel}</span>
          {compact ? <span className="text-xs text-brand-600">{pricingHint}</span> : null}
        </Link>
        {!compact ? (
          <Link
            href="/dashboard"
            className="hidden rounded-lg px-2.5 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900 sm:inline-flex"
          >
            {labels.myDashboard}
          </Link>
        ) : (
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="flex min-h-11 w-full items-center rounded-lg px-3 text-base font-medium text-surface-800 hover:bg-surface-50"
          >
            {labels.myDashboard}
          </Link>
        )}
        <Button
          href="/account"
          variant="outline"
          size="sm"
          className={compact ? "min-h-11 w-full" : "min-h-9 max-w-[7.5rem] truncate"}
          onClick={onNavigate}
        >
          {name}
        </Button>
      </div>
    );
  }

  return (
    <GuestLinks
      locale={locale}
      compact={compact}
      pricingLabel={pricingLabel}
      pricingHint={pricingHint}
      onNavigate={onNavigate}
    />
  );
}

function GuestLinks({
  locale,
  compact,
  pricingLabel,
  pricingHint,
  onNavigate,
}: {
  locale: Locale;
  compact: boolean;
  pricingLabel: string;
  pricingHint: string;
  onNavigate?: () => void;
}) {
  const labels = authLabels[locale];

  if (compact) {
    return (
      <div className="flex w-full flex-col gap-2">
        <Link
          href="/preview/commerce/service"
          onClick={onNavigate}
          className="flex min-h-11 w-full items-center justify-between rounded-lg border border-brand-200 bg-brand-50 px-3 text-sm font-medium text-brand-800"
        >
          <span>{pricingLabel}</span>
          <span className="text-xs text-brand-600">{pricingHint}</span>
        </Link>
        <Link
          href="/login"
          onClick={onNavigate}
          className="flex min-h-11 w-full items-center rounded-lg px-3 text-base font-medium text-surface-800 hover:bg-surface-50"
        >
          {labels.logIn}
        </Link>
        <Button href="/signup" variant="outline" size="md" className="min-h-11 w-full" onClick={onNavigate}>
          {labels.signUp}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Link
        href="/preview/commerce/service"
        className="whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
        title={pricingHint}
        aria-label={`${pricingLabel} (${pricingHint})`}
      >
        {pricingLabel}
        <span className="ml-1 hidden text-[10px] font-semibold text-amber-700 2xl:inline">{locale === "en" ? "Soon" : "준비중"}</span>
      </Link>
      <Link
        href="/login"
        className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
      >
        {labels.logIn}
      </Link>
      <Button href="/signup" variant="outline" size="sm" className="min-h-9 whitespace-nowrap px-2.5">
        {labels.signUp}
      </Button>
    </div>
  );
}
