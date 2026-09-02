interface VenturePortfolioVisualProps {
  type: "ebook" | "app" | "site" | "content" | "knowledge";
  title: string;
}

export function VenturePortfolioVisual({ type, title }: VenturePortfolioVisualProps) {
  if (type === "ebook") {
    return (
      <div className="relative min-h-[240px] sm:min-h-[280px]" aria-label={title}>
        <div className="absolute inset-x-4 bottom-4 top-8 rounded-lg bg-gradient-to-b from-amber-900/20 to-amber-950/5" />
        <div className="relative flex h-full items-end justify-center gap-2 px-4 pb-6 pt-4 sm:gap-3">
          {[
            { h: "h-36", w: "w-14", rotate: "-rotate-6", z: "z-10" },
            { h: "h-44", w: "w-16", rotate: "", z: "z-20 scale-105" },
            { h: "h-32", w: "w-13", rotate: "rotate-6", z: "z-10" },
            { h: "h-38", w: "w-14", rotate: "-rotate-3", z: "z-0 opacity-80" },
          ].map((book, i) => (
            <div
              key={i}
              className={`${book.h} ${book.w} ${book.rotate} ${book.z} relative shrink-0 rounded-r-md border border-amber-900/20 bg-white shadow-lg`}
            >
              <div className="absolute inset-y-0 left-0 w-1.5 rounded-l-md bg-amber-800/70" />
              <div className="p-2 pl-3">
                <div className="h-2 w-full rounded bg-amber-700/60" />
                <div className="mt-2 space-y-1">
                  <div className="h-0.5 w-full rounded bg-surface-200" />
                  <div className="h-0.5 w-4/5 rounded bg-surface-100" />
                  <div className="h-0.5 w-full rounded bg-surface-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute left-6 top-4 rounded-md border border-amber-200/60 bg-white/90 px-3 py-2 text-[10px] shadow-sm">
          <div className="font-semibold text-amber-900">Table of Contents</div>
          <div className="mt-1 space-y-0.5 text-surface-500">
            <div>1. Introduction</div>
            <div>2. Core concepts</div>
            <div>3. Practice</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "app") {
    return (
      <div className="relative flex min-h-[240px] items-center justify-center gap-3 sm:min-h-[280px] sm:gap-5" aria-label={title}>
        <div className="w-[28%] max-w-[100px] rounded-[1.25rem] border-[3px] border-surface-800 bg-surface-900 p-1.5 shadow-xl">
          <div className="rounded-xl bg-surface-800 p-2">
            <div className="h-1.5 w-8 rounded bg-brand-400/70" />
            <div className="mt-2 space-y-1.5">
              <div className="h-6 rounded-md bg-white/10" />
              <div className="h-4 rounded bg-white/5" />
            </div>
          </div>
        </div>
        <div className="z-10 w-[38%] max-w-[130px] rounded-[1.5rem] border-4 border-surface-800 bg-surface-900 p-2 shadow-2xl">
          <div className="rounded-xl bg-surface-800 p-2.5">
            <div className="flex items-center justify-between">
              <div className="h-2 w-10 rounded bg-brand-500/60" />
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="rounded-lg bg-brand-600/30 p-2">
                <div className="h-1.5 w-full rounded bg-white/30" />
                <div className="mt-1 h-1.5 w-2/3 rounded bg-white/20" />
              </div>
              <div className="h-8 rounded-lg bg-white/10" />
              <div className="h-8 rounded-lg bg-white/10" />
            </div>
            <div className="mt-3 h-7 rounded-md bg-brand-500/50" />
          </div>
        </div>
        <div className="w-[28%] max-w-[100px] rounded-[1.25rem] border-[3px] border-surface-800 bg-surface-900 p-1.5 shadow-xl opacity-90">
          <div className="rounded-xl bg-surface-800 p-2">
            <div className="text-[8px] font-medium text-emerald-400">Done ✓</div>
            <div className="mt-2 h-12 rounded bg-emerald-900/30" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "site") {
    return (
      <div className="relative min-h-[240px] sm:min-h-[280px]" aria-label={title}>
        <div className="mx-auto max-w-md rounded-xl border border-surface-200 bg-white shadow-lg">
          <div className="flex items-center gap-1.5 border-b border-surface-100 px-3 py-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <div className="ml-2 h-2 flex-1 rounded-full bg-surface-100" />
          </div>
          <div className="p-4">
            <div className="h-4 w-2/3 rounded bg-surface-800" />
            <div className="mt-3 h-20 rounded-lg bg-gradient-to-r from-brand-100 to-brand-50" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-10 rounded bg-surface-100" />
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 w-24 rounded-lg border-2 border-surface-300 bg-white p-1 shadow-md sm:right-8">
          <div className="h-16 rounded bg-brand-50" />
          <div className="mt-1 h-1 w-full rounded bg-surface-200" />
        </div>
      </div>
    );
  }

  if (type === "content") {
    return (
      <div className="grid min-h-[240px] grid-cols-4 grid-rows-2 gap-2 sm:min-h-[280px] sm:gap-2.5" aria-label={title}>
        <div className="relative col-span-2 row-span-2 overflow-hidden rounded-xl bg-gradient-to-br from-rose-600/40 via-surface-800 to-surface-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-10 w-10 text-white/70" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span className="absolute bottom-2 left-2 rounded bg-black/40 px-1.5 py-0.5 text-[9px] text-white">9:16</span>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-brand-600/30 to-surface-800" />
        <div className="rounded-lg bg-gradient-to-br from-emerald-600/30 to-surface-800" />
        <div className="rounded-lg bg-gradient-to-br from-amber-600/30 to-surface-800" />
        <div className="col-span-2 rounded-lg bg-gradient-to-r from-violet-600/20 to-surface-800 flex items-center px-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-1 rounded-full bg-white/30" />
            ))}
          </div>
          <span className="ml-2 text-[9px] text-white/60">Playlist</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[240px] flex-col justify-center gap-3 sm:min-h-[280px]" aria-label={title}>
      {[
        { level: "Beginner", pct: 35, color: "bg-emerald-500" },
        { level: "Intermediate", pct: 65, color: "bg-brand-500" },
        { level: "Advanced", pct: 90, color: "bg-violet-500" },
      ].map((row) => (
        <div key={row.level} className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-surface-800">{row.level}</span>
            <span className="text-xs text-surface-400">Path</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-100">
            <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
          </div>
          <div className="mt-2 flex gap-2">
            <span className="rounded bg-surface-100 px-2 py-0.5 text-[10px] text-surface-600">E-book</span>
            <span className="rounded bg-surface-100 px-2 py-0.5 text-[10px] text-surface-600">Lab</span>
          </div>
        </div>
      ))}
    </div>
  );
}
