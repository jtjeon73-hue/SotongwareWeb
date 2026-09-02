"use client";

import type { Locale } from "@/i18n/config";
import { isLocale } from "@/i18n/config";
import { LocaleRouteProvider } from "@/contexts/LocaleRouteContext";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

function SiteLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const segment = pathname.split("/")[1];
  const routeLocale: Locale | null = isLocale(segment) ? segment : null;

  if (routeLocale) {
    return (
      <LocaleRouteProvider locale={routeLocale}>
        <SiteLayoutInner>{children}</SiteLayoutInner>
      </LocaleRouteProvider>
    );
  }

  return <SiteLayoutInner>{children}</SiteLayoutInner>;
}
