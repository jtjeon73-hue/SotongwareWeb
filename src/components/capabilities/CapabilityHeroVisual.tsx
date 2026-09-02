interface CapabilityHeroVisualProps {
  slug: string;
}

export function CapabilityHeroVisual({ slug }: CapabilityHeroVisualProps) {
  if (slug === "smart-farm") {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-5" aria-hidden="true">
        <div className="grid grid-cols-3 gap-2">
          {["24.2°C", "62%", "Auto"].map((v, i) => (
            <div key={i} className="rounded-lg bg-emerald-900/40 p-3 text-center">
              <div className="text-lg font-bold text-emerald-300">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 h-24 rounded-lg bg-gradient-to-t from-emerald-800/30 to-transparent" />
      </div>
    );
  }

  if (slug === "ai-software") {
    return (
      <div className="rounded-2xl border border-violet-500/20 bg-violet-950/30 p-5" aria-hidden="true">
        <div className="flex justify-between gap-1">
          {["Analyze", "Build", "Validate", "Ship"].map((s) => (
            <div key={s} className="flex-1 rounded bg-violet-800/40 py-2 text-center text-[10px] font-medium text-violet-200">
              {s}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-violet-500/20 bg-violet-900/20 p-4">
          <div className="h-2 w-1/2 rounded bg-violet-400/50" />
          <div className="mt-2 h-16 rounded bg-violet-800/20" />
        </div>
      </div>
    );
  }

  if (slug === "multiplatform-control") {
    return (
      <div className="flex justify-center gap-3" aria-hidden="true">
        <div className="h-28 w-40 rounded-lg border border-brand-500/30 bg-surface-800" />
        <div className="h-36 w-16 rounded-xl border-2 border-surface-600 bg-surface-800" />
        <div className="h-24 w-14 rounded-lg border border-brand-500/30 bg-surface-800" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-500/20 bg-surface-900/80 p-5" aria-hidden="true">
      <div className="grid grid-cols-4 gap-2">
        {[72, 58, 91, 64].map((v, i) => (
          <div key={i} className="rounded bg-white/5 p-2 text-center">
            <div className="text-sm font-bold text-white">{v}%</div>
            <div className="mt-1 h-1 rounded-full bg-brand-500" style={{ width: `${v}%` }} />
          </div>
        ))}
      </div>
      <svg className="mt-4 w-full text-brand-400/50" viewBox="0 0 200 40" fill="none">
        <path d="M0 30 L50 20 L100 25 L150 12 L200 18" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}
