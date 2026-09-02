"use client";

import { useState, useRef, useEffect, type RefObject } from "react";
import { useLocale } from "@/contexts/LocaleProvider";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { cn } from "@/lib/utils";

const navTriggerClass =
  "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900 break-keep";

function NavChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function useDismissOnOutsideClick(ref: RefObject<HTMLDivElement | null>, onClose: () => void) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClose]);
}

export function TechnologyNavMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { dict } = useLocale();
  const nav = dict.site.nav;

  useDismissOnOutsideClick(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        className={navTriggerClass}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        {nav.technology}
        <NavChevron open={open} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-surface-200 bg-white p-2 shadow-lg">
          {nav.technologyItems.map((item) => (
            <LocalizedLink
              key={item.slug}
              href={`/capabilities/${item.slug}`}
              className="block whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-surface-800 hover:bg-brand-50"
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

  useDismissOnOutsideClick(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        className={cn(
          navTriggerClass,
          "gap-1.5 font-semibold text-brand-800 hover:bg-brand-50 hover:text-brand-900",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
        <span>{nav.digitalVentures}</span>
        <span className="rounded bg-brand-100 px-1 py-px text-[9px] font-bold uppercase tracking-wide text-brand-700">
          {nav.digitalVenturesBadge}
        </span>
        <NavChevron open={open} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[min(100vw-2rem,28rem)] rounded-xl border border-brand-200/60 bg-white p-3 shadow-xl">
          <p className="px-2 pb-2 text-xs leading-relaxed text-surface-500">{nav.digitalVenturesBlurb}</p>
          <div className="grid gap-1 sm:grid-cols-2">
            {nav.ventureItems.map((item) => (
              <LocalizedLink
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-surface-800 hover:bg-brand-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </LocalizedLink>
            ))}
          </div>
          <div className="mt-2 border-t border-surface-100 pt-2">
            <LocalizedLink
              href="/products"
              className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
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

export function ResourcesNavMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { dict } = useLocale();
  const nav = dict.site.nav;

  const items = [
    { label: nav.about, href: "/about" },
    { label: nav.process, href: "/process" },
    { label: nav.guide, href: "/guide" },
  ];

  useDismissOnOutsideClick(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        className={navTriggerClass}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        {nav.resources}
        <NavChevron open={open} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-surface-200 bg-white p-2 shadow-lg">
          {items.map((item) => (
            <LocalizedLink
              key={item.href}
              href={item.href}
              className="block whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-surface-800 hover:bg-brand-50"
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
