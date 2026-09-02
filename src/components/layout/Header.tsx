"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthNav } from "@/components/auth/AuthNav";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { TechnologyNavMenu, DigitalVenturesNavMenu } from "@/components/layout/TechnologyNavMenu";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/contexts/LocaleProvider";
import { siteConfig } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { localizePath } from "@/i18n/localized-path";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, dict } = useLocale();
  const nav = dict.site.nav;

  const topLinks = [
    { label: nav.portfolio, href: "/products" },
    { label: nav.about, href: "/about" },
    { label: nav.process, href: "/process" },
    { label: nav.guide, href: "/guide" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200/80 bg-white/95 backdrop-blur-sm">
      <div className="container-main flex h-14 items-center justify-between sm:h-16">
        <Link
          href={localizePath("/", locale)}
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={nav.homeAria}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            S
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-surface-900">{siteConfig.name}</span>
            <span className="hidden text-[11px] text-surface-500 sm:block">{siteConfig.nameKo}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label={nav.mainMenu}>
          <TechnologyNavMenu />
          <DigitalVenturesNavMenu />
          {topLinks.map((item) => (
            <LocalizedLink
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
            >
              {item.label}
            </LocalizedLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher />
          <AuthNav />
          <Button href={localizePath("/contact", locale)} variant="primary" size="sm" className="min-h-11">
            {nav.contactCta}
          </Button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-surface-700 transition-colors hover:bg-surface-100 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? nav.closeMenu : nav.openMenu}
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn("border-t border-surface-200 bg-white lg:hidden", mobileOpen ? "block" : "hidden")}
        aria-hidden={!mobileOpen}
      >
        <nav className="container-main flex max-h-[80vh] flex-col overflow-y-auto py-3" aria-label={nav.mobileMenu}>
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-surface-400">{nav.technology}</p>
          {nav.technologyItems.map((item) => (
            <LocalizedLink
              key={item.slug}
              href={`/capabilities/${item.slug}`}
              className="min-h-11 rounded-lg px-3 py-3 text-base font-medium text-surface-800 hover:bg-surface-50"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </LocalizedLink>
          ))}
          <p className="mt-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-surface-400">{nav.digitalVentures}</p>
          {nav.ventureItems.map((item) => (
            <LocalizedLink
              key={item.href}
              href={item.href}
              className="min-h-11 rounded-lg px-3 py-3 text-base font-medium text-surface-800 hover:bg-surface-50"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </LocalizedLink>
          ))}
          {topLinks.map((item) => (
            <LocalizedLink
              key={item.href}
              href={item.href}
              className="min-h-11 rounded-lg px-3 py-3 text-base font-medium text-surface-800 hover:bg-surface-50"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </LocalizedLink>
          ))}
          <div className="mt-2 space-y-2 border-t border-surface-100 px-3 pt-4">
            <LocaleSwitcher className="w-full justify-center" />
            <div className="pb-2">
              <AuthNav />
            </div>
            <Button
              href={localizePath("/contact", locale)}
              variant="primary"
              size="md"
              className="w-full min-h-11"
              onClick={() => setMobileOpen(false)}
            >
              {nav.contactCta}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
