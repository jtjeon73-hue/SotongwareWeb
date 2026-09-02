"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthNav } from "@/components/auth/AuthNav";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import {
  TechnologyNavMenu,
  DigitalVenturesNavMenu,
  PortfolioNavMenu,
  ResourcesNavMenu,
  HeaderContactIcon,
} from "@/components/layout/TechnologyNavMenu";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/contexts/LocaleProvider";
import { useAuthLocale } from "@/hooks/useAuthLocale";
import { getFullDictionary } from "@/i18n/get-dictionary";
import { siteConfig } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { localizePath } from "@/i18n/localized-path";
import type { Locale } from "@/i18n/config";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const isAuthPath = /^\/(login|signup|forgot-password)(\/|$)/.test(pathname);
  const authLocale = useAuthLocale();
  const { locale: routeLocale } = useLocale();
  const locale: Locale = isAuthPath ? authLocale : routeLocale;
  const dict = getFullDictionary(locale);
  const nav = dict.site.nav;

  const resourceLinks = [
    { label: nav.about, href: "/about" },
    { label: nav.process, href: "/process" },
    { label: nav.guide, href: "/guide" },
    { label: nav.contact, href: "/contact" },
  ];

  const portfolioMobileLinks = nav.portfolioItems;

  return (
    <header
      className="sticky top-0 z-50 border-b border-surface-200/80 bg-white/95 backdrop-blur-sm"
      data-testid="site-header"
    >
      <div className="header-shell flex h-14 min-w-0 items-center gap-2 sm:h-16 sm:gap-3">
        <Link
          href={localizePath("/", locale)}
          className="flex shrink-0 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={nav.homeAria}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            S
          </span>
          <div className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="whitespace-nowrap text-sm font-bold text-surface-900">{siteConfig.name}</span>
            <span className="hidden whitespace-nowrap text-[11px] text-surface-500 2xl:block">
              {nav.brandSubtitle}
            </span>
          </div>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex"
          aria-label={nav.mainMenu}
          data-testid="header-desktop-nav"
        >
          <TechnologyNavMenu />
          <DigitalVenturesNavMenu />
          <PortfolioNavMenu />
          <div className="2xl:hidden">
            <ResourcesNavMenu compact />
          </div>
          <div className="hidden 2xl:block">
            <ResourcesNavMenu />
          </div>
        </nav>

        <div className="hidden shrink-0 items-center gap-1.5 lg:flex lg:gap-2" data-testid="header-actions">
          <LocaleSwitcher compact />
          <div className="hidden items-center gap-1.5 2xl:flex 2xl:gap-2">
            <AuthNav locale={locale} />
            <Button
              href={localizePath("/contact", locale)}
              variant="primary"
              size="sm"
              className="min-h-9 shrink-0 whitespace-nowrap px-3"
              aria-label={nav.contactCtaAria}
            >
              {nav.contactCta}
            </Button>
          </div>
          <div className="flex items-center gap-1.5 2xl:hidden">
            <HeaderContactIcon />
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
          <LocaleSwitcher compact />
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-surface-700 transition-colors hover:bg-surface-100"
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
      </div>

      <div
        id="mobile-menu"
        className={cn("border-t border-surface-200 bg-white lg:hidden", mobileOpen ? "block" : "hidden")}
        aria-hidden={!mobileOpen}
      >
        <nav className="header-shell flex max-h-[80vh] flex-col overflow-y-auto py-3" aria-label={nav.mobileMenu}>
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
          <p className="mt-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-600">{nav.digitalVentures}</p>
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
          <p className="mt-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-surface-400">{nav.portfolio}</p>
          {portfolioMobileLinks.map((item) => (
            <LocalizedLink
              key={item.label + item.href}
              href={item.href}
              className="min-h-11 rounded-lg px-3 py-3 text-base font-medium text-surface-800 hover:bg-surface-50"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </LocalizedLink>
          ))}
          <p className="mt-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-surface-400">{nav.resources}</p>
          {resourceLinks.map((item) => (
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
            <div className="pb-2">
              <AuthNav locale={locale} />
            </div>
            <Button
              href={localizePath("/contact", locale)}
              variant="primary"
              size="md"
              className="w-full min-h-11"
              aria-label={nav.contactCtaAria}
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
