import type { ReactNode } from "react";
import Link from "next/link";
import { PREVIEW_BANNER, PREVIEW_BASE } from "@/data/preview-commerce";

export const SHOWCASE_PATH = `${PREVIEW_BASE}/showcase`;
export const SHOWCASE_V4_PATH = `${PREVIEW_BASE}/showcase-v4`;

type CompareActive = "v2" | "v3" | "v4";

function chipClass(active: CompareActive, self: CompareActive, dark: boolean) {
  if (active === self) {
    if (self === "v4") return "bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-blue-400 text-[#071428]";
    if (self === "v3") return "bg-gradient-to-r from-cyan-400 to-blue-500 text-[#071428]";
    return dark ? "bg-white text-[#071428]" : "bg-brand-600 text-white";
  }
  if (dark) return "border border-white/25 bg-white/5 text-white hover:bg-white/10";
  return "border border-surface-200 bg-surface-50 text-surface-800 hover:bg-white";
}

export function CompareBar({ active }: { active: CompareActive }) {
  const dark = active === "v3" || active === "v4";
  return (
    <div
      className={
        dark
          ? "border-b border-white/10 bg-[#071428]/90 backdrop-blur"
          : "border-b border-surface-200 bg-white/90 backdrop-blur"
      }
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p
          className={`text-xs font-medium tracking-wide ${
            dark ? "text-cyan-200/90" : "text-surface-600"
          }`}
        >
          시안 비교 · 실제 결제 없음
        </p>
        <div className="flex flex-wrap gap-2" role="navigation" aria-label="시안 비교">
          <Link
            href={PREVIEW_BASE}
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${chipClass(active, "v2", dark)}`}
            aria-current={active === "v2" ? "page" : undefined}
          >
            깔끔한 V2 보기
          </Link>
          <Link
            href={SHOWCASE_PATH}
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${chipClass(active, "v3", dark)}`}
            aria-current={active === "v3" ? "page" : undefined}
          >
            화려한 V3 보기
          </Link>
          <Link
            href={SHOWCASE_V4_PATH}
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 ${chipClass(active, "v4", dark)}`}
            aria-current={active === "v4" ? "page" : undefined}
          >
            입체 V4 보기
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ShowcaseBanner() {
  return (
    <div
      role="status"
      className="border-b border-amber-400/30 bg-amber-400/15 px-4 py-2.5 text-center text-sm font-medium text-amber-100"
    >
      {PREVIEW_BANNER}
    </div>
  );
}

export function ShowcaseShell({
  children,
  active = "v3",
}: {
  children: ReactNode;
  active?: CompareActive;
}) {
  return (
    <div className="min-h-full bg-[#050d1c] text-slate-100">
      <ShowcaseBanner />
      <CompareBar active={active} />
      {children}
    </div>
  );
}
