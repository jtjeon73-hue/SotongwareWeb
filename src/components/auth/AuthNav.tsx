"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/Button";

export function AuthNav() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="h-9 w-20 animate-pulse rounded-lg bg-surface-100"
        aria-hidden="true"
      />
    );
  }

  if (user) {
    const name = profile?.displayName || user.email?.split("@")[0] || "회원";
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="hidden rounded-lg px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900 sm:inline-flex"
        >
          내 대시보드
        </Link>
        <Button href="/account" variant="outline" size="sm" className="min-h-9">
          {name}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-lg px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
      >
        로그인
      </Link>
      <Button href="/signup" variant="outline" size="sm" className="min-h-9">
        회원가입
      </Button>
    </div>
  );
}
