/**
 * Hero capability visualization — abstract schematic graphics, not fake product screenshots.
 */
export function HeroCapabilityVisual() {
  return (
    <div
      className="relative mx-auto w-full max-w-lg lg:max-w-none"
      aria-hidden="true"
    >
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm">
        {/* Industrial dashboard schematic */}
        <div className="rounded-xl border border-white/10 bg-surface-900/80 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-brand-300">
              Industrial Monitor
            </span>
            <span className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
              <span className="h-2 w-2 rounded-full bg-amber-400/60" />
            </span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[72, 58, 91, 64].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-full rounded bg-white/5 p-1">
                  <div
                    className="w-full rounded-sm bg-brand-500/70"
                    style={{ height: `${h * 0.35}px` }}
                  />
                </div>
                <span className="text-[9px] text-surface-500">Line {i + 1}</span>
              </div>
            ))}
          </div>
          <svg className="mt-3 w-full text-brand-400/40" viewBox="0 0 200 40" fill="none">
            <path
              d="M0 30 L40 25 L80 18 L120 22 L160 10 L200 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="160" cy="10" r="3" fill="currentColor" className="text-brand-400" />
          </svg>
        </div>

        {/* Floating capability cards */}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* App device frame */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">
            <div className="mx-auto w-12 rounded-md border border-white/20 bg-surface-800 p-1">
              <div className="h-16 rounded-sm bg-surface-700/80 p-1.5">
                <div className="h-2 w-8 rounded bg-brand-500/50" />
                <div className="mt-1.5 space-y-1">
                  <div className="h-1 w-full rounded bg-white/20" />
                  <div className="h-1 w-3/4 rounded bg-white/15" />
                  <div className="mt-2 h-6 rounded bg-brand-600/30" />
                </div>
              </div>
            </div>
            <p className="mt-2 text-center text-[10px] text-surface-400">App</p>
          </div>

          {/* Website card */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">
            <div className="rounded-md border border-white/15 bg-surface-800 p-1.5">
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
              </div>
              <div className="mt-1.5 h-2 w-10 rounded bg-white/25" />
              <div className="mt-1 space-y-1">
                <div className="h-1 w-full rounded bg-white/15" />
                <div className="h-8 rounded bg-brand-700/40" />
              </div>
            </div>
            <p className="mt-2 text-center text-[10px] text-surface-400">Website</p>
          </div>

          {/* E-book */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">
            <div className="mx-auto flex w-14 gap-0.5">
              <div className="h-16 w-2 rounded-l bg-brand-800/60" />
              <div className="flex-1 rounded-r border border-white/10 bg-surface-700/60 p-1">
                <div className="h-2 w-full rounded bg-white/20" />
                <div className="mt-1 space-y-0.5">
                  <div className="h-0.5 w-full rounded bg-white/10" />
                  <div className="h-0.5 w-full rounded bg-white/10" />
                  <div className="h-0.5 w-2/3 rounded bg-white/10" />
                </div>
              </div>
            </div>
            <p className="mt-2 text-center text-[10px] text-surface-400">E-book</p>
          </div>

          {/* Content / Shorts */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">
            <div className="relative mx-auto h-16 w-12 rounded-md border border-white/15 bg-surface-800">
              <div className="absolute inset-1 rounded bg-gradient-to-b from-brand-600/30 to-surface-700/50" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <svg className="h-4 w-4 text-white/70" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-center text-[10px] text-surface-400">Content</p>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] text-surface-500">
          Capability visualization — 실제 제작 역량을 상징하는 구성
        </p>
      </div>
    </div>
  );
}
