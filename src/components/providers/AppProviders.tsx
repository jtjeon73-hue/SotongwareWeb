"use client";

import { AuthProvider } from "@/contexts/AuthProvider";
import { LocaleProvider } from "@/contexts/LocaleProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <AuthProvider>{children}</AuthProvider>
    </LocaleProvider>
  );
}
