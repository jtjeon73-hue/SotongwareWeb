"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleProvider";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { HeaderNavDropdown } from "@/components/layout/HeaderNavDropdown";
import { authLabels } from "@/i18n/auth-labels";
import { localizePath } from "@/i18n/localized-path";
import { cn } from "@/lib/utils";

const dropdownLinkClass =
  "block whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-surface-800 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

const dropdownLinkDescClass =
  "block whitespace-nowrap rounded-lg px-3 py-2.5 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

export function TechnologyNavMenu() {
  const { dict } = useLocale();
  const nav = dict.site.nav;

  return (
    <HeaderNavDropdown label={nav.technology} panelClassName="w-80">
      {nav.technologyItems.map((item) => (
        <LocalizedLink
          key={item.slug}
          href={`/capabilities/${item.slug}`}
          className={dropdownLinkClass}
          role="menuitem"
        >
          {item.label}
        </LocalizedLink>
      ))}
    </HeaderNavDropdown>
  );
}

export function DigitalVenturesNavMenu() {
  const { dict } = useLocale();
  const nav = dict.site.nav;

  return (
    <HeaderNavDropdown
      label={
        <>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
          <span>{nav.digitalVentures}</span>
          <span className="hidden rounded bg-brand-100 px-1 py-px text-[9px] font-bold uppercase tracking-wide text-brand-700 2xl:inline">
            {nav.digitalVenturesBadge}
          </span>
        </>
      }
      triggerClassName="gap-1.5 font-semibold text-brand-800 hover:bg-brand-50 hover:text-brand-900"
      panelClassName="w-[min(100vw-2rem,28rem)] p-3"
    >
      <p className="px-2 pb-2 text-xs leading-relaxed text-surface-500">{nav.digitalVenturesBlurb}</p>
      <div className="grid gap-1 sm:grid-cols-2">
        {nav.ventureItems.map((item) => (
          <LocalizedLink
            key={item.href}
            href={item.href}
            className={dropdownLinkClass}
            role="menuitem"
          >
            {item.label}
          </LocalizedLink>
        ))}
      </div>
      <div className="mt-2 border-t border-surface-100 pt-2">
        <LocalizedLink
          href="/products"
          className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          role="menuitem"
        >
          {nav.digitalVenturesHubCta} →
        </LocalizedLink>
      </div>
    </HeaderNavDropdown>
  );
}

export function PortfolioNavMenu() {
  const { dict } = useLocale();
  const nav = dict.site.nav;

  return (
    <HeaderNavDropdown label={nav.portfolio} panelClassName="w-72" align="left">
      {nav.portfolioItems.map((item) => (
        <LocalizedLink key={item.label + item.href} href={item.href} className={dropdownLinkDescClass} role="menuitem">
          <span className="text-sm font-medium text-surface-800">{item.label}</span>
          <span className="mt-0.5 block text-xs text-surface-500">{item.description}</span>
        </LocalizedLink>
      ))}
    </HeaderNavDropdown>
  );
}

export function ResourcesNavMenu({ compact = false }: { compact?: boolean }) {
  const { locale, dict } = useLocale();
  const nav = dict.site.nav;
  const auth = authLabels[locale];

  const items = [
    { label: nav.about, href: "/about" },
    { label: nav.process, href: "/process" },
    { label: nav.guide, href: "/guide" },
    { label: nav.contact, href: "/contact" },
  ];

  return (
    <HeaderNavDropdown label={nav.resources} panelClassName="w-60" align="right">
      {items.map((item) => (
        <LocalizedLink key={item.href} href={item.href} className={dropdownLinkClass} role="menuitem">
          {item.label}
        </LocalizedLink>
      ))}
      {compact && (
        <>
          <div className="my-1 border-t border-surface-100" role="separator" />
          <Link href="/login" className={dropdownLinkClass} role="menuitem">
            {auth.logIn}
          </Link>
          <Link href="/signup" className={dropdownLinkClass} role="menuitem">
            {auth.signUp}
          </Link>
        </>
      )}
    </HeaderNavDropdown>
  );
}

/** Compact contact icon for lg–xl screens */
export function HeaderContactIcon({ className }: { className?: string }) {
  const { locale, dict } = useLocale();
  const nav = dict.site.nav;

  return (
    <Link
      href={localizePath("/contact", locale)}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-surface-200 text-surface-600 transition-colors hover:bg-surface-100 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        className,
      )}
      aria-label={nav.contactCtaAria}
      title={nav.contactCta}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" d="M21 15a4 4 0 01-4 4H7l-4 3V7a4 4 0 014-4h10a4 4 0 014 4z" />
      </svg>
    </Link>
  );
}
