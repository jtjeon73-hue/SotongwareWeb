"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";
import { useAuthLocale } from "@/hooks/useAuthLocale";
import { authLabels } from "@/i18n/auth-labels";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";

function GuestAuthLinks({ locale }: { locale: Locale }) {
  const labels = authLabels[locale];
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Link
        href="/login"
        className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
      >
        {labels.logIn}
      </Link>
      <Button href="/signup" variant="outline" size="sm" className="min-h-9 whitespace-nowrap">
        {labels.signUp}
      </Button>
    </div>
  );
}

export function AuthNav({ locale: localeProp }: { locale?: Locale }) {
  const { user, profile, loading } = useAuth();
  const authLocale = useAuthLocale();
  const locale = localeProp ?? authLocale;
  const labels = authLabels[locale];

  if (loading) {
    return <GuestAuthLinks locale={locale} />;
  }

  if (user) {
    const name = profile?.displayName || user.email?.split("@")[0] || labels.member;
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="hidden rounded-lg px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900 sm:inline-flex"
        >
          {labels.myDashboard}
        </Link>
        <Button href="/account" variant="outline" size="sm" className="min-h-9">
          {name}
        </Button>
      </div>
    );
  }

  return <GuestAuthLinks locale={locale} />;
}
