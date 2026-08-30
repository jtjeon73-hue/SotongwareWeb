"use client";

import Link from "next/link";
import type { SotongProduct } from "@/types/product";
import { getCrossSellItems } from "@/lib/cross-sell";
import { trackEvent } from "@/lib/analytics";
import { ServiceIcon } from "@/components/ui/Icons";
import { getBusinessById } from "@/data/businesses";

export function ProductCrossSell({ product }: { product: SotongProduct }) {
  const items = getCrossSellItems(product.type);

  if (items.length === 0) return null;

  return (
    <section className="mt-10 rounded-xl border border-surface-200 bg-white p-5 sm:p-6" aria-labelledby="cross-sell-heading">
      <h2 id="cross-sell-heading" className="text-lg font-bold text-surface-900">
        관련 전문 서비스
      </h2>
      <p className="mt-1 text-sm text-surface-600">
        SotongWare Business Network에서 연결된 서비스입니다.
      </p>
      <ul className="mt-5 space-y-4">
        {items.map((item) => {
          const area = getBusinessById(item.businessId);
          if (!area) return null;
          return (
            <li
              key={item.businessId}
              className="flex flex-col gap-3 rounded-lg border border-surface-100 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <ServiceIcon name={area.icon} />
                </div>
                <div>
                  <p className="font-semibold text-surface-900">{item.titleKo}</p>
                  <p className="mt-0.5 text-sm text-surface-600">{item.reason}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
                <Link
                  href={item.internalPath}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-surface-200 px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50"
                  onClick={() =>
                    trackEvent("business_detail_click", {
                      business_type: item.businessId,
                      destination: item.internalPath,
                      context: "cross_sell",
                    })
                  }
                >
                  서비스 보기
                </Link>
                {item.externalSiteUrl && area.siteStatus !== "coming-soon" && (
                  <a
                    href={item.externalSiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
                    onClick={() =>
                      trackEvent("business_site_click", {
                        business_type: item.businessId,
                        destination: "external",
                        context: "cross_sell",
                      })
                    }
                  >
                    {item.externalSiteLabel ?? "전문 사이트 ↗"}
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
