"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { businessAreas } from "@/data/businesses";
import { trackEvent } from "@/lib/analytics";
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
        Services
        <svg className={cn("h-4 w-4 transition-transform", open && "rotate-180")} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-surface-200 bg-white py-2 shadow-lg">
          {businessAreas.map((area) => (
            <div key={area.id} className="px-2">
              <Link
                href={area.internalPath}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-surface-800 hover:bg-surface-50"
                onClick={() => {
                  trackEvent("business_detail_click", { business_type: area.id, destination: area.internalPath });
                  setOpen(false);
                }}
              >
                {area.titleKo}
              </Link>
              {area.externalSiteUrl && area.siteStatus !== "coming-soon" && (
                <a
                  href={area.externalSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-1 block rounded-lg px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50"
                  onClick={() => {
                    trackEvent("business_site_click", { business_type: area.id, destination: "external" });
                    setOpen(false);
                  }}
                >
                  {area.externalSiteLabel ?? "전문 사이트"} ↗
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
