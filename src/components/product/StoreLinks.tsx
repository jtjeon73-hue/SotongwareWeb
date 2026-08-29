import type { StoreLinks, ExternalLink } from "@/types/product";
import { hasValidUrl } from "@/lib/products";

interface StoreLinksProps {
  storeLinks?: StoreLinks;
  externalLinks?: ExternalLink[];
}

export function StoreLinksPanel({ storeLinks, externalLinks }: StoreLinksProps) {
  const links: { label: string; url: string }[] = [];

  if (storeLinks?.playStore && hasValidUrl(storeLinks.playStore)) {
    links.push({ label: "Google Play", url: storeLinks.playStore });
  }
  if (storeLinks?.appStore && hasValidUrl(storeLinks.appStore)) {
    links.push({ label: "App Store", url: storeLinks.appStore });
  }
  if (storeLinks?.youtube && hasValidUrl(storeLinks.youtube)) {
    links.push({ label: "YouTube", url: storeLinks.youtube });
  }
  storeLinks?.ebookStores?.forEach((s) => {
    if (hasValidUrl(s.url)) links.push({ label: s.name, url: s.url });
  });
  externalLinks?.forEach((l) => {
    if (hasValidUrl(l.url)) links.push({ label: l.name, url: l.url });
  });

  if (links.length === 0) {
    return (
      <p className="text-sm text-surface-500">
        외부 스토어 링크는 등록 후 표시됩니다.
      </p>
    );
  }

  return (
    <ul className="flex flex-wrap gap-3">
      {links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
          >
            {link.label} ↗
          </a>
        </li>
      ))}
    </ul>
  );
}
