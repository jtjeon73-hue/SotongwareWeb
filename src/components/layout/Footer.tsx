import Link from "next/link";
import { footerNavigation, siteConfig } from "@/data/navigation";

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-surface-600 transition-colors hover:text-brand-600">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-200 bg-white" aria-label="사이트 푸터">
      <div className="container-main section-padding !py-12 sm:!py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">S</span>
              <div>
                <p className="text-sm font-bold text-surface-900">{siteConfig.name}</p>
                <p className="text-xs text-surface-500">{siteConfig.nameKo}</p>
              </div>
            </Link>
            <p className="mt-3 text-sm font-medium text-brand-700">디지털 사업 플랫폼</p>
            <p className="mt-2 text-sm leading-relaxed text-surface-600">{siteConfig.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:col-span-1 lg:col-span-8 lg:grid-cols-4">
            <FooterLinkGroup title="Business" links={footerNavigation.business} />
            <FooterLinkGroup title="Products" links={footerNavigation.products} />
            <FooterLinkGroup title="Services" links={footerNavigation.services} />
            <FooterLinkGroup title="Company" links={footerNavigation.company} />
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-surface-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {footerNavigation.legal.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-surface-500 hover:text-surface-700">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs text-surface-400">KO / EN</span>
            <p className="text-xs text-surface-500">© {year} {siteConfig.name}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
