import type { ReactNode } from "react";
import Link from "next/link";
import { PREVIEW_BANNER, PREVIEW_BASE } from "@/data/preview-commerce";
import { CompareBar } from "@/components/preview/commerce/showcase/ShowcaseChrome";

export function PreviewBanner() {
  return (
    <div
      role="status"
      className="border-b border-amber-300/80 bg-amber-50 px-4 py-2.5 text-center text-sm font-medium text-amber-950"
    >
      {PREVIEW_BANNER}
    </div>
  );
}

export function PreviewShell({
  title,
  subtitle,
  children,
  backHref,
  backLabel = "뒤로",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_40%,#f1f5f9_100%)]">
      <PreviewBanner />
      <CompareBar active="v2" />
      <div className="border-b border-surface-200/80 bg-white/80 backdrop-blur">
        <div className="container-main flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-3">
            {backHref ? (
              <Link
                href={backHref}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-surface-200 bg-white px-3 text-sm text-surface-700 hover:bg-surface-50"
              >
                {backLabel}
              </Link>
            ) : null}
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-wide text-brand-700">
                SotongWare · 시제품 V2
              </p>
              <h1 className="truncate text-lg font-semibold text-surface-900 sm:text-xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-0.5 text-sm text-surface-600">{subtitle}</p>
              ) : null}
            </div>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="시제품 바로가기">
            <Link
              href={PREVIEW_BASE}
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-surface-700 hover:bg-surface-100"
            >
              허브
            </Link>
            <Link
              href={`${PREVIEW_BASE}/pricing`}
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-surface-700 hover:bg-surface-100"
            >
              요금
            </Link>
            <Link
              href={`${PREVIEW_BASE}/library`}
              className="inline-flex min-h-11 items-center rounded-lg bg-brand-600 px-3 text-sm font-medium text-white hover:bg-brand-700"
            >
              내 자료실
            </Link>
          </nav>
        </div>
      </div>
      <div className="container-main section-padding">{children}</div>
    </div>
  );
}

export function PreviewCta({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
}) {
  const styles =
    variant === "primary"
      ? "bg-brand-600 text-white hover:bg-brand-700 border-brand-600"
      : variant === "secondary"
        ? "bg-white text-surface-800 hover:bg-surface-50 border-surface-200"
        : "bg-transparent text-surface-700 hover:bg-surface-100 border-transparent";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-xl border px-5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${styles}`}
    >
      {children}
    </Link>
  );
}

export function PreviewEmpty({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-surface-300 bg-white px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-surface-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-surface-600">{body}</p>
      {actionHref && actionLabel ? (
        <div className="mt-6">
          <PreviewCta href={actionHref}>{actionLabel}</PreviewCta>
        </div>
      ) : null}
    </div>
  );
}
