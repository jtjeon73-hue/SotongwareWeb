"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/contexts/LocaleProvider";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { cn } from "@/lib/utils";

export function TechnologyNavMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { dict } = useLocale();
  const nav = dict.site.nav;

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
        className="flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        {nav.technology}
        <svg className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-surface-200 bg-white p-2 shadow-lg">
          {nav.technologyItems.map((item) => (
            <LocalizedLink
              key={item.slug}
              href={`/capabilities/${item.slug}`}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-surface-800 hover:bg-brand-50"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </LocalizedLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function DigitalVenturesNavMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { dict } = useLocale();
  const nav = dict.site.nav;

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
        className={cn(
          "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
          "bg-gradient-to-r from-brand-50 to-violet-50 text-brand-800 ring-1 ring-brand-200/80",
          "hover:from-brand-100 hover:to-violet-100 hover:text-brand-900",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500 xl:inline" aria-hidden="true" />
        <span>{nav.digitalVentures}</span>
        <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {nav.digitalVenturesBadge}
        </span>
        <svg className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[min(100vw-2rem,22rem)] rounded-xl border border-brand-200/60 bg-white p-3 shadow-xl sm:w-[28rem]">
          <p className="px-2 pb-2 text-xs leading-relaxed text-surface-500">{nav.digitalVenturesBlurb}</p>
          <div className="grid gap-1 sm:grid-cols-2">
            {nav.ventureItems.map((item) => (
              <LocalizedLink
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-surface-800 hover:bg-brand-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </LocalizedLink>
            ))}
          </div>
          <div className="mt-2 border-t border-surface-100 pt-2">
            <LocalizedLink
              href="/products"
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
              onClick={() => setOpen(false)}
            >
              {nav.digitalVenturesHubCta} →
            </LocalizedLink>
          </div>
        </div>
      )}
    </div>
  );
}
