/**
 * Bright digital-business hero showcase — denser product mini-previews, no fake metrics.
 */
import Link from "next/link";
import { localizePath } from "@/i18n/localized-path";

const PILLARS = [
  {
    id: "app",
    href: "/apps",
    ko: "앱",
    en: "Apps",
    hint: { ko: "모바일 UI", en: "Mobile UI" },
    tone: "from-sky-100/90 via-white to-cyan-50 border-sky-200/80",
    icon: "phone" as const,
  },
  {
    id: "ebook",
    href: "/ebooks",
    ko: "전자책",
    en: "E-books",
    hint: { ko: "서재·리더", en: "Library" },
    tone: "from-amber-100/90 via-white to-orange-50 border-amber-200/80",
    icon: "book" as const,
  },
  {
    id: "marketing",
    href: "/marketing",
    ko: "홍보·마케팅",
    en: "Marketing",
    hint: { ko: "캠페인 제작", en: "Campaigns" },
    tone: "from-violet-100/90 via-white to-fuchsia-50 border-violet-200/80",
    icon: "campaign" as const,
  },
  {
    id: "content",
    href: "/contents",
    ko: "콘텐츠",
    en: "Content",
    hint: { ko: "미디어 허브", en: "Media hub" },
    tone: "from-rose-100/90 via-white to-pink-50 border-rose-200/80",
    icon: "media" as const,
  },
  {
    id: "knowledge",
    href: "/knowledge",
    ko: "지식·교육",
    en: "Knowledge",
    hint: { ko: "학습 포털", en: "Learning" },
    tone: "from-emerald-100/90 via-white to-teal-50 border-emerald-200/80",
    icon: "learn" as const,
  },
  {
    id: "automation",
    href: "/automation",
    ko: "자동화 솔루션",
    en: "Automation",
    hint: { ko: "현장 관제", en: "Field ops" },
    tone: "from-cyan-100/90 via-white to-slate-50 border-cyan-200/80",
    icon: "plant" as const,
  },
];

function MiniVisual({ icon }: { icon: (typeof PILLARS)[number]["icon"] }) {
  if (icon === "phone") {
    return (
      <div className="relative mx-auto flex h-[4.75rem] items-end justify-center gap-1.5">
        <div className="mb-1 w-7 rounded-lg border-2 border-sky-800/30 bg-white p-0.5 opacity-70 shadow">
          <div className="h-8 rounded bg-sky-50" />
        </div>
        <div className="z-10 w-10 rounded-[0.85rem] border-[2.5px] border-sky-900/40 bg-white p-1 shadow-lg shadow-sky-500/20">
          <div className="rounded-md bg-gradient-to-b from-sky-50 to-white p-1">
            <div className="h-1 w-5 rounded bg-sky-400/80" />
            <div className="mt-1 space-y-0.5">
              <div className="h-3 rounded bg-brand-100" />
              <div className="h-2 rounded bg-surface-100" />
              <div className="grid grid-cols-2 gap-0.5">
                <div className="h-2.5 rounded bg-sky-100" />
                <div className="h-2.5 rounded bg-cyan-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (icon === "book") {
    return (
      <div className="relative mx-auto h-[4.75rem] w-[4.5rem]">
        <div className="absolute bottom-1 left-0 h-14 w-9 -rotate-8 rounded-r-md border border-amber-900/15 bg-amber-100 shadow" />
        <div className="absolute bottom-0 left-3 h-16 w-10 rounded-r-md border border-amber-900/25 bg-white shadow-lg">
          <div className="absolute inset-y-0 left-0 w-1 bg-amber-800/75" />
          <div className="space-y-1 p-2 pl-2.5">
            <div className="h-1.5 w-full rounded bg-amber-700/55" />
            <div className="h-0.5 w-full rounded bg-surface-200" />
            <div className="h-0.5 w-3/4 rounded bg-surface-100" />
            <div className="mt-2 h-6 rounded bg-gradient-to-br from-amber-50 to-orange-50" />
          </div>
        </div>
      </div>
    );
  }
  if (icon === "campaign") {
    return (
      <div className="relative mx-auto h-[4.75rem] w-[5.25rem]">
        <div className="absolute inset-x-0 top-0 rounded-lg border border-violet-200 bg-white p-1.5 shadow-md">
          <div className="h-1.5 w-10 rounded bg-violet-400/80" />
          <div className="mt-1 h-5 rounded bg-gradient-to-r from-violet-100 to-fuchsia-50" />
        </div>
        <div className="absolute bottom-0 right-0 w-12 rounded-md border border-violet-200 bg-white p-1 shadow-lg">
          <div className="flex h-8 items-end gap-0.5">
            <div className="h-3 flex-1 rounded-sm bg-violet-200" />
            <div className="h-5 flex-1 rounded-sm bg-fuchsia-300/80" />
            <div className="h-4 flex-1 rounded-sm bg-violet-400/70" />
          </div>
        </div>
      </div>
    );
  }
  if (icon === "media") {
    return (
      <div className="mx-auto grid h-[4.75rem] w-[5.25rem] grid-cols-3 gap-1">
        <div className="col-span-2 row-span-2 flex items-center justify-center rounded-xl bg-gradient-to-br from-rose-400/30 to-rose-100 shadow-inner">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white shadow">
            ▶
          </span>
        </div>
        <div className="rounded-lg bg-amber-100 shadow-sm" />
        <div className="rounded-lg bg-violet-100 shadow-sm" />
      </div>
    );
  }
  if (icon === "learn") {
    return (
      <div className="mx-auto flex h-[4.75rem] w-[5.25rem] flex-col justify-center gap-1 rounded-xl border border-emerald-200 bg-white p-2 shadow-md">
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-10 rounded bg-emerald-500/80" />
          <div className="h-3 w-3 rounded bg-teal-200" />
        </div>
        {[40, 65, 85].map((pct) => (
          <div key={pct} className="h-1.5 overflow-hidden rounded-full bg-emerald-50">
            <div className="h-full rounded-full bg-emerald-400/80" style={{ width: `${pct}%` }} />
          </div>
        ))}
        <div className="mt-0.5 flex gap-1">
          <span className="rounded bg-emerald-50 px-1 text-[7px] font-medium text-emerald-800">Lab</span>
          <span className="rounded bg-teal-50 px-1 text-[7px] font-medium text-teal-800">Guide</span>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto h-[4.75rem] w-[5.25rem] rounded-xl border border-cyan-200 bg-gradient-to-br from-slate-50 via-white to-cyan-50 p-2 shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-[7px] font-semibold uppercase tracking-wide text-cyan-700">HMI</span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-1">
        {[62, 88, 47].map((v) => (
          <div key={v} className="rounded-md bg-white p-1 shadow-sm ring-1 ring-cyan-100">
            <div className="h-1 overflow-hidden rounded bg-cyan-50">
              <div className="h-full rounded bg-cyan-500" style={{ width: `${v}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1.5 h-3 rounded bg-gradient-to-r from-cyan-200/60 via-white to-sky-100 ring-1 ring-cyan-100" />
    </div>
  );
}

export function HubHeroVisual({ locale = "ko" }: { locale?: "ko" | "en" }) {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[2.25rem] bg-gradient-to-br from-sky-200/50 via-cyan-100/20 to-violet-200/30 blur-2xl"
      />
      <div className="relative rounded-3xl border border-white/90 bg-white/75 p-4 shadow-[0_24px_70px_-24px_rgba(14,165,233,0.45)] backdrop-blur-md sm:p-5">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-xs font-semibold tracking-wide text-brand-700">
            {locale === "en" ? "Digital venture showcase" : "디지털 사업 쇼케이스"}
          </p>
          <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700 ring-1 ring-sky-100">
            SotongWare
          </span>
        </div>
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
          {PILLARS.map((pillar) => (
            <li key={pillar.id}>
              <Link
                href={localizePath(pillar.href, locale)}
                className={`group flex h-full flex-col rounded-2xl border bg-gradient-to-br p-3 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_-14px_rgba(14,165,233,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${pillar.tone}`}
              >
                <MiniVisual icon={pillar.icon} />
                <p className="mt-2 text-center text-xs font-bold text-surface-900 sm:text-sm">
                  {locale === "en" ? pillar.en : pillar.ko}
                </p>
                <p className="mt-0.5 text-center text-[10px] font-medium text-surface-500">
                  {locale === "en" ? pillar.hint.en : pillar.hint.ko}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
