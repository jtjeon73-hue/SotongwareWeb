"use client";

import Link from "next/link";
import type { StoreLinks, ExternalLink } from "@/types/product";
import { hasValidUrl } from "@/lib/products";
import { trackEvent } from "@/lib/analytics";

interface StoreLinksProps {
  storeLinks?: StoreLinks;
  externalLinks?: ExternalLink[];
  productSlug?: string;
  productType?: string;
  showPlayStorePending?: boolean;
}

export function StoreLinksPanel({
  storeLinks,
  externalLinks,
  productSlug,
  productType,
  showPlayStorePending = false,
}: StoreLinksProps) {
  const links: { label: string; url: string; eventName: "store_link_click" | "external_product_click" }[] = [];

  const playStoreValid = storeLinks?.playStore && hasValidUrl(storeLinks.playStore);

  if (playStoreValid) {
    links.push({
      label: "Google Play",
      url: storeLinks!.playStore!,
      eventName: "store_link_click",
    });
  }
  if (storeLinks?.appStore && hasValidUrl(storeLinks.appStore)) {
    links.push({ label: "App Store", url: storeLinks.appStore, eventName: "store_link_click" });
  }
  if (storeLinks?.youtube && hasValidUrl(storeLinks.youtube)) {
    links.push({ label: "YouTube", url: storeLinks.youtube, eventName: "external_product_click" });
  }
  storeLinks?.ebookStores?.forEach((s) => {
    if (hasValidUrl(s.url)) {
      links.push({ label: s.name, url: s.url, eventName: "store_link_click" });
    }
  });
  externalLinks?.forEach((l) => {
    if (hasValidUrl(l.url)) {
      links.push({ label: l.name, url: l.url, eventName: "external_product_click" });
    }
  });

  const showPlayPending = showPlayStorePending && !playStoreValid;

  if (links.length === 0 && !showPlayPending) {
    return (
      <p className="text-sm text-surface-500">
        외부 스토어 링크는 등록 후 표시됩니다.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {showPlayPending && (
        <span
          className="inline-flex items-center rounded-lg border border-surface-200 bg-surface-50 px-4 py-2 text-sm font-medium text-surface-500"
          aria-disabled="true"
        >
          Google Play 출시 준비 중
        </span>
      )}
      <ul className="flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
              onClick={() =>
                trackEvent(link.eventName, {
                  link_name: link.label,
                  destination: link.url,
                  product_slug: productSlug,
                  product_type: productType,
                })
              }
            >
              {link.label === "Google Play" ? "Google Play에서 받기" : link.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface TrackedLinkProps {
  href: string;
  label: string;
  businessType: string;
  ctaName: string;
  className?: string;
  variant?: "primary" | "outline";
}

export function TrackedBusinessLink({
  href,
  label,
  businessType,
  ctaName,
  className,
  variant = "primary",
}: TrackedLinkProps) {
  const base =
    variant === "primary"
      ? "inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      : "inline-flex items-center rounded-lg border border-surface-200 px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50";

  return (
    <Link
      href={href}
      className={className ?? base}
      onClick={() =>
        trackEvent("business_cta_click", {
          business_type: businessType,
          cta_name: ctaName,
          destination: href,
        })
      }
    >
      {label}
    </Link>
  );
}
