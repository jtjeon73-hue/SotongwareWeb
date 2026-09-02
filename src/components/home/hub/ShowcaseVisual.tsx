interface ShowcaseVisualProps {
  type: "ebook" | "app" | "site" | "content" | "knowledge";
  title: string;
}

export function ShowcaseVisual({ type, title }: ShowcaseVisualProps) {
  if (type === "ebook") {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center" aria-label={title}>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-16 rounded-r-md border border-surface-200 bg-white shadow-md sm:w-20 ${
                i === 2 ? "scale-110 -translate-y-2" : "opacity-70"
              }`}
              style={{ height: `${100 + i * 12}px` }}
            >
              <div className="h-1/3 rounded-tr-md bg-brand-600/80" />
              <div className="space-y-1 p-2">
                <div className="h-1 w-full rounded bg-surface-200" />
                <div className="h-1 w-4/5 rounded bg-surface-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "app") {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center" aria-label={title}>
        <div className="relative">
          <div className="w-36 rounded-[1.5rem] border-4 border-surface-800 bg-surface-900 p-2 shadow-xl sm:w-40">
            <div className="rounded-xl bg-surface-800 p-3">
              <div className="h-2 w-12 rounded bg-brand-500/60" />
              <div className="mt-3 space-y-2">
                <div className="h-8 rounded-lg bg-white/10" />
                <div className="h-8 rounded-lg bg-white/10" />
                <div className="h-10 rounded-lg bg-brand-600/40" />
              </div>
            </div>
          </div>
          <div className="absolute -right-4 top-8 w-20 rounded-lg border border-surface-200 bg-white p-2 shadow-lg opacity-90">
            <div className="text-[8px] font-medium text-surface-500">Checklist</div>
            <div className="mt-1 h-1 w-full rounded bg-emerald-400" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "site") {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3" aria-label={title}>
        <div className="w-full max-w-xs rounded-lg border border-surface-200 bg-white shadow-md">
          <div className="flex items-center gap-1 border-b border-surface-100 px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-red-300" />
            <div className="h-2 w-2 rounded-full bg-amber-300" />
            <div className="h-2 w-2 rounded-full bg-emerald-300" />
            <div className="ml-2 h-2 flex-1 rounded bg-surface-100" />
          </div>
          <div className="p-4">
            <div className="h-3 w-2/3 rounded bg-surface-800" />
            <div className="mt-3 h-16 rounded bg-brand-100" />
            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="h-8 rounded bg-surface-100" />
              <div className="h-8 rounded bg-surface-100" />
              <div className="h-8 rounded bg-surface-100" />
            </div>
          </div>
        </div>
        <div className="w-24 rounded-md border-2 border-surface-300 bg-white p-1 shadow">
          <div className="h-14 rounded-sm bg-brand-50" />
        </div>
      </div>
    );
  }

  if (type === "content") {
    return (
      <div className="grid h-full min-h-[220px] grid-cols-3 gap-2 p-2" aria-label={title}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className={`relative aspect-[9/16] overflow-hidden rounded-lg ${
              i === 1 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <div
              className={`absolute inset-0 ${
                i % 3 === 0
                  ? "bg-gradient-to-br from-brand-600/40 to-surface-800"
                  : i % 3 === 1
                    ? "bg-gradient-to-br from-emerald-600/30 to-surface-800"
                    : "bg-gradient-to-br from-amber-600/30 to-surface-800"
              }`}
            />
            {i === 1 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-8 w-8 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[220px] flex-col justify-center gap-3 p-2" aria-label={title}>
      {["Beginner", "Intermediate", "Advanced"].map((level, i) => (
        <div key={level} className="flex items-center gap-3 rounded-lg border border-surface-200 bg-white p-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${
              i === 0 ? "bg-emerald-500" : i === 1 ? "bg-brand-500" : "bg-violet-500"
            }`}
          >
            {i + 1}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-surface-800">{level}</div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-100">
              <div
                className="h-full rounded-full bg-brand-500"
                style={{ width: `${(i + 1) * 30}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
