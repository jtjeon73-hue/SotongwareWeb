"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthLoadingScreen } from "./AuthFormParts";

interface AuthGuardProps {
  children: React.ReactNode;
}

/** 클라이언트 UX 가드 — 실제 보안은 Firestore Rules */
export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const redirect = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <AuthLoadingScreen message="로그인 페이지로 이동하는 중…" />;
  }

  return <>{children}</>;
}
