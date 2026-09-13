"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useAuthLocale } from "@/hooks/useAuthLocale";
import { authLabels } from "@/i18n/auth-labels";
import { AuthLoadingScreen } from "./AuthFormParts";

interface AuthGuardProps {
  children: React.ReactNode;
}

/** Client UX guard — real security is Firestore Rules */
export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useAuthLocale();
  const labels = authLabels[locale];

  useEffect(() => {
    if (!loading && !user) {
      const redirect = encodeURIComponent(pathname || "/account");
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return <AuthLoadingScreen message={labels.authLoading} />;
  }

  if (!user) {
    return <AuthLoadingScreen message={labels.redirectingToLogin} />;
  }

  return <>{children}</>;
}
