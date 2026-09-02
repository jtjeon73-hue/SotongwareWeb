"use client";

import Link from "next/link";
import { footerNavigation, getFooterExternalServices, siteConfig } from "@/data/navigation";
import { getReleaseLabel } from "@/config/release-info";
import { useLocale } from "@/contexts/LocaleProvider";
import { localizePath } from "@/i18n/localized-path";

function FooterLinkGroup({
  title,
  links,
  locale,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
  locale: "ko" | "en";
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-surface-600 transition-colors hover:text-brand-600"
              >
                {link.label} ↗
              </a>
            ) : (
              <Link
                href={localizePath(link.href, locale)}
                className="text-sm text-surface-600 transition-colors hover:text-brand-600"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { locale, dict } = useLocale();
  const f = dict.site.footer;
  const nav = dict.site.nav;

  const guideLinks = footerNavigation.guide.map((l, i) => ({
    ...l,
    label: i === 0 ? nav.process : nav.guide,
  }));

  const companyLinks = [
    { label: nav.about, href: "/about" },
    { label: nav.contact, href: "/contact" },
  ];

  const legalLinks = footerNavigation.legal.map((l) => ({
    ...l,
    label: locale === "en" ? (l.href === "/privacy" ? "Privacy policy" : "Terms of use") : l.label,
  }));

  return (
    <footer className="border-t border-surface-200 bg-white" aria-label="Site footer">
      <div className="container-main section-padding !py-10 sm:!py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href={localizePath("/", locale)} className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">S</span>
              <div>
                <p className="text-sm font-bold text-surface-900">{siteConfig.name}</p>
                <p className="text-xs text-surface-500">{nav.brandSubtitle}</p>
              </div>
            </Link>
            <p className="mt-3 text-sm font-medium text-brand-700">{f.tagline}</p>
            <p className="mt-2 text-sm leading-relaxed text-surface-600">{f.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:col-span-1 lg:col-span-8 lg:grid-cols-4">
            <FooterLinkGroup title={f.externalServices} links={getFooterExternalServices(locale)} locale={locale} />
            <FooterLinkGroup title={f.guide} links={guideLinks} locale={locale} />
            <FooterLinkGroup title={f.company} links={companyLinks} locale={locale} />
            <FooterLinkGroup title={f.legal} links={legalLinks} locale={locale} />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-surface-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-surface-500">
            © {year} {siteConfig.name}. {f.rights}
          </p>
          <p className="text-xs font-medium text-brand-700">{getReleaseLabel(locale)}</p>
        </div>
      </div>
    </footer>
  );
}
