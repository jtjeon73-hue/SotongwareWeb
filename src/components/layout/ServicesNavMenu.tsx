"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { businessAreas } from "@/data/businesses";
import { getExternalSiteUrl } from "@/lib/business-sites";
import { trackEvent } from "@/lib/analytics";
import { ServiceIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function ServicesNavMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        서비스
        <svg className={cn("h-4 w-4 transition-transform", open && "rotate-180")} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[min(100vw-2rem,42rem)] rounded-xl border border-surface-200 bg-white p-3 shadow-lg">
          <div className="grid gap-2 sm:grid-cols-2">
            {businessAreas.map((area) => (
              <div
                key={area.id}
                className="rounded-lg border border-surface-100 p-3 hover:border-brand-200 hover:bg-brand-50/30"
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <ServiceIcon name={area.icon} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-surface-900">{area.titleKo}</p>
                    <p className="mt-0.5 text-xs leading-snug text-surface-600">{area.tagline}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-1.5 sm:flex-row">
                  <Link
                    href={area.internalPath}
                    className="inline-flex min-h-9 flex-1 items-center justify-center rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
                    onClick={() => {
                      trackEvent("business_detail_click", { business_type: area.id, destination: area.internalPath });
                      setOpen(false);
                    }}
                  >
                    서비스 보기
                  </Link>
                  {getExternalSiteUrl(area) && area.siteStatus !== "coming-soon" && (
                    <a
                      href={getExternalSiteUrl(area)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 flex-1 items-center justify-center rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50"
                      onClick={() => {
                        if (area.id === "knowledge") {
                          trackEvent("knowledge_site_click", { business_type: area.id, destination: "external" });
                        }
                        trackEvent("business_site_click", { business_type: area.id, destination: "external" });
                        setOpen(false);
                      }}
                    >
                      {area.externalSiteLabel ?? "전문 사이트 ↗"}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 border-t border-surface-100 pt-2">
            <Link
              href="/services"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
              onClick={() => setOpen(false)}
            >
              전체 서비스 보기 →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
