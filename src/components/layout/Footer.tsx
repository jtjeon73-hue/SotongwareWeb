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
      <h3 className="text-sm font-semibold text-surface-900">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-surface-600 transition-colors hover:text-brand-600"
            >
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
      <div className="container-main section-padding !py-12 sm:!py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                S
              </span>
              <div>
                <p className="text-sm font-bold text-surface-900">{siteConfig.name}</p>
                <p className="text-xs text-surface-500">{siteConfig.nameKo}</p>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-surface-600">
              기술과 디지털 자산을 만들어 실제 문제를 해결하고 지속적인 가치를 만드는 기술 기반 디지털 제작 회사
            </p>
          </div>

          <FooterLinkGroup title="사업 분야" links={footerNavigation.services} />
          <FooterLinkGroup title="Works" links={footerNavigation.works} />
          <FooterLinkGroup title="Insights" links={footerNavigation.insights} />
          <FooterLinkGroup title="Company" links={footerNavigation.company} />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-surface-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4">
            {footerNavigation.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-surface-500 hover:text-surface-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-surface-400" aria-label="언어 전환 준비 중">
              KO / EN
            </span>
            <p className="text-xs text-surface-500">
              © {year} {siteConfig.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
