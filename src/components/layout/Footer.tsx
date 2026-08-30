import Link from "next/link";
import { footerNavigation, siteConfig } from "@/data/navigation";

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
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
              <Link href={link.href} className="text-sm text-surface-600 transition-colors hover:text-brand-600">
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

  return (
    <footer className="border-t border-surface-200 bg-white" aria-label="사이트 푸터">
      <div className="container-main section-padding !py-10 sm:!py-12">
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
            <FooterLinkGroup title="전문 서비스" links={footerNavigation.externalServices} />
            <FooterLinkGroup title="디지털 상품" links={footerNavigation.products} />
            <FooterLinkGroup title="회사" links={footerNavigation.company} />
            <FooterLinkGroup title="법적 안내" links={footerNavigation.legal} />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-surface-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-surface-500">© {year} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
