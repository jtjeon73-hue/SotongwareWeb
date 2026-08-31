"use client";

import { AuthProvider } from "@/contexts/AuthProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
