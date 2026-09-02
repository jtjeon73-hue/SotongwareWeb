/**
 * Field operations dashboard schematic — industrial + smart farm + AI pipeline.
 * Abstract visualization, not fake product screenshots.
 */
export function HubHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none" aria-hidden="true">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5">
        {/* Industrial monitor */}
        <div className="rounded-xl border border-white/10 bg-surface-900/90 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-300">
              Plant Floor Monitor
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[68, 82, 45, 91].map((v, i) => (
              <div key={i} className="rounded-lg bg-white/5 p-2">
                <div className="text-[9px] text-surface-500">Line {i + 1}</div>
                <div className="mt-1 text-sm font-bold text-white">{v}%</div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart farm strip */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: "Temp", value: "24.2°C", color: "text-amber-300" },
            { label: "Humidity", value: "62%", color: "text-sky-300" },
            { label: "Irrigation", value: "Auto", color: "text-emerald-300" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-2.5">
              <div className="text-[9px] uppercase tracking-wide text-emerald-400/80">{item.label}</div>
              <div className={`mt-0.5 text-sm font-semibold ${item.color}`}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* AI pipeline */}
        <div className="mt-3 flex items-center gap-1 overflow-hidden rounded-lg border border-white/10 bg-surface-900/60 p-3">
          {["Analyze", "Build", "Validate", "Deploy", "Sell"].map((step, i) => (
            <div key={step} className="flex flex-1 items-center gap-1">
              <div className="flex-1 rounded bg-brand-600/30 px-1 py-1.5 text-center text-[8px] font-medium text-brand-200 sm:text-[9px]">
                {step}
              </div>
              {i < 4 && <span className="text-[8px] text-surface-600">→</span>}
            </div>
          ))}
        </div>

        {/* Device row */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-white/10 p-2 text-center">
            <div className="mx-auto h-8 w-12 rounded border border-white/15 bg-surface-800" />
            <p className="mt-1 text-[9px] text-surface-500">Desktop</p>
          </div>
          <div className="rounded-lg border border-white/10 p-2 text-center">
            <div className="mx-auto h-10 w-7 rounded border border-white/15 bg-surface-800" />
            <p className="mt-1 text-[9px] text-surface-500">Tablet</p>
          </div>
          <div className="rounded-lg border border-white/10 p-2 text-center">
            <div className="mx-auto h-10 w-5 rounded-md border border-white/15 bg-surface-800" />
            <p className="mt-1 text-[9px] text-surface-500">Mobile</p>
          </div>
        </div>
      </div>
    </div>
  );
}
