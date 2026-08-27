"use client";

import { useState } from "react";
import Link from "next/link";
import { mainNavigation, siteConfig } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200/80 bg-white/95 backdrop-blur-sm">
      <div className="container-main flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={`${siteConfig.name} 홈`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            S
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-surface-900">{siteConfig.name}</span>
            <span className="text-xs text-surface-500">{siteConfig.nameKo}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="주요 메뉴">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span
            className="text-xs text-surface-400"
            aria-label="언어 전환 준비 중"
          >
            KO
          </span>
          <Button href="/contact" variant="outline" size="sm">
            문의·안내
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-200 text-surface-700 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label="메뉴 열기"
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
        <nav className="container-main flex flex-col gap-1 px-4 py-4 sm:px-6" aria-label="모바일 메뉴">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-3 text-base font-medium text-surface-700 hover:bg-surface-100"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-surface-100 pt-3">
            <Button href="/contact" variant="outline" size="md" className="w-full">
              문의·안내
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
