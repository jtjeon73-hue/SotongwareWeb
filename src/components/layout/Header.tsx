"use client";

import { useState } from "react";
import Link from "next/link";
import { mainNavigation, siteConfig } from "@/data/navigation";
import { ServicesNavMenu } from "./ServicesNavMenu";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200/80 bg-white/95 backdrop-blur-sm">
      <div className="container-main flex h-14 items-center justify-between sm:h-16">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={`${siteConfig.name} 홈`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            S
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-surface-900">{siteConfig.name}</span>
            <span className="hidden text-[11px] text-surface-500 sm:block">{siteConfig.nameKo}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="주요 메뉴">
          <ServicesNavMenu />
          {mainNavigation.filter((item) => item.label !== "서비스").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Button href="/contact" variant="primary" size="sm" className="min-h-11">
            상담·제작 문의
          </Button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-surface-700 transition-colors hover:bg-surface-100 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "border-t border-surface-200 bg-white lg:hidden",
          mobileOpen ? "block" : "hidden",
        )}
        aria-hidden={!mobileOpen}
      >
        <nav className="container-main flex flex-col py-3" aria-label="모바일 메뉴">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-surface-400">서비스</p>
          {mainNavigation.find((i) => i.label === "서비스")?.children?.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-h-11 rounded-lg px-3 py-3 text-base font-medium text-surface-800 hover:bg-surface-50"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {mainNavigation.filter((item) => item.label !== "서비스").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-h-11 rounded-lg px-3 py-3 text-base font-medium text-surface-800 hover:bg-surface-50"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 space-y-2 border-t border-surface-100 px-3 pt-4">
            <Button
              href="/contact"
              variant="primary"
              size="md"
              className="w-full min-h-11"
              onClick={() => setMobileOpen(false)}
            >
              상담·제작 문의
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
