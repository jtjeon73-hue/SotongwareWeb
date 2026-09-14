/**
 * Bright digital-business hero showcase — abstract product cards, no fake metrics.
 */
import Link from "next/link";

const PILLARS = [
  {
    id: "app",
    href: "/apps",
    ko: "앱",
    en: "Apps",
    tone: "from-sky-500/20 to-brand-600/10 border-sky-200",
    icon: "phone",
  },
  {
    id: "ebook",
    href: "/ebooks",
    ko: "전자책",
    en: "E-books",
    tone: "from-amber-400/25 to-orange-100/40 border-amber-200",
    icon: "book",
  },
  {
    id: "marketing",
    href: "/marketing",
    ko: "홍보·마케팅",
    en: "Marketing",
    tone: "from-violet-400/20 to-fuchsia-100/30 border-violet-200",
    icon: "campaign",
  },
  {
    id: "content",
    href: "/contents",
    ko: "콘텐츠",
    en: "Content",
    tone: "from-rose-400/20 to-pink-100/40 border-rose-200",
    icon: "media",
  },
  {
    id: "knowledge",
    href: "/knowledge",
    ko: "지식·교육",
    en: "Knowledge",
    tone: "from-emerald-400/20 to-teal-100/40 border-emerald-200",
    icon: "learn",
  },
  {
    id: "automation",
    href: "/automation",
    ko: "자동화 솔루션",
    en: "Automation",
    tone: "from-slate-400/20 to-cyan-100/30 border-slate-200",
    icon: "plant",
  },
] as const;

function MiniVisual({ icon }: { icon: (typeof PILLARS)[number]["icon"] }) {
  if (icon === "phone") {
    return (
      <div className="mx-auto h-16 w-9 rounded-xl border-2 border-sky-700/40 bg-white shadow-md shadow-sky-500/10">
        <div className="m-1 h-2 rounded bg-sky-200/80" />
        <div className="mx-1 mt-1 space-y-1">
          <div className="h-3 rounded bg-brand-100" />
          <div className="h-2 rounded bg-surface-100" />
        </div>
      </div>
    );
  }
  if (icon === "book") {
    return (
      <div className="relative mx-auto h-16 w-12">
        <div className="absolute inset-y-1 left-1 w-9 -rotate-6 rounded-r-md border border-amber-800/20 bg-amber-50 shadow" />
        <div className="absolute inset-y-0 left-2 w-9 rounded-r-md border border-amber-800/30 bg-white shadow-md">
          <div className="absolute inset-y-0 left-0 w-1 bg-amber-800/70" />
          <div className="space-y-1 p-2 pl-2.5">
            <div className="h-1.5 w-full rounded bg-amber-700/50" />
            <div className="h-0.5 w-full rounded bg-surface-200" />
            <div className="h-0.5 w-3/4 rounded bg-surface-100" />
          </div>
        </div>
      </div>
    );
  }
  if (icon === "campaign") {
    return (
      <div className="mx-auto w-16 space-y-1.5 rounded-lg border border-violet-200 bg-white p-2 shadow-md">
        <div className="h-2 w-10 rounded bg-violet-400/70" />
        <div className="h-6 rounded bg-gradient-to-r from-violet-100 to-fuchsia-50" />
        <div className="flex gap-0.5">
          <div className="h-3 flex-1 rounded bg-violet-200/80" />
          <div className="h-2 flex-1 self-end rounded bg-fuchsia-200/70" />
          <div className="h-4 flex-1 rounded bg-violet-300/70" />
        </div>
      </div>
    );
  }
  if (icon === "media") {
    return (
      <div className="mx-auto flex h-16 w-14 items-center justify-center rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white shadow-md">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/90 text-white shadow">
          <span className="ml-0.5 text-[10px]">▶</span>
        </div>
      </div>
    );
  }
  if (icon === "learn") {
    return (
      <div className="mx-auto w-16 rounded-lg border border-emerald-200 bg-white p-2 shadow-md">
        <div className="h-1.5 w-8 rounded bg-emerald-500/70" />
        <div className="mt-2 space-y-1">
          <div className="h-1.5 rounded bg-emerald-100" />
          <div className="h-1.5 w-4/5 rounded bg-surface-100" />
          <div className="mt-1 flex gap-1">
            <div className="h-3 w-3 rounded bg-emerald-200" />
            <div className="h-3 w-3 rounded bg-teal-200" />
            <div className="h-3 w-3 rounded bg-emerald-100" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto w-16 rounded-lg border border-slate-200 bg-slate-900 p-2 shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-[7px] font-semibold uppercase tracking-wide text-cyan-300">Monitor</span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-0.5">
        {[70, 85, 55].map((v) => (
          <div key={v} className="rounded bg-white/10 p-1">
            <div className="h-0.5 w-full rounded bg-cyan-400/80" style={{ width: `${v}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HubHeroVisual({ locale = "ko" }: { locale?: "ko" | "en" }) {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none" aria-hidden="true">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-sky-200/40 via-white/0 to-cyan-200/30 blur-2xl" />
      <div className="relative rounded-3xl border border-white/80 bg-white/70 p-4 shadow-[0_20px_60px_-20px_rgba(14,165,233,0.35)] backdrop-blur-md sm:p-5">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-xs font-semibold tracking-wide text-brand-700">
            {locale === "en" ? "Digital ventures" : "디지털 사업 쇼케이스"}
          </p>
          <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700 ring-1 ring-sky-100">
            SotongWare
          </span>
        </div>
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
          {PILLARS.map((pillar) => (
            <li key={pillar.id}>
              <Link
                href={pillar.href}
                className={`group flex h-full flex-col rounded-2xl border bg-gradient-to-br p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${pillar.tone}`}
              >
                <MiniVisual icon={pillar.icon} />
                <p className="mt-2 text-center text-xs font-semibold text-surface-800 sm:text-sm">
                  {locale === "en" ? pillar.en : pillar.ko}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
