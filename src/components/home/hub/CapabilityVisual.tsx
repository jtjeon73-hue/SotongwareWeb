interface CapabilityVisualProps {
  type: string;
}

export function CapabilityVisual({ type }: CapabilityVisualProps) {
  const base = "flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border";

  if (type === "smartfarm") {
    return (
      <div className={`${base} border-emerald-200 bg-emerald-50`} aria-hidden="true">
        <svg className="h-10 w-10 text-emerald-600" viewBox="0 0 40 40" fill="none">
          <path d="M8 28 L20 12 L32 28 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
          <circle cx="20" cy="22" r="3" fill="currentColor" />
          <path d="M12 32 H28" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  if (type === "ai") {
    return (
      <div className={`${base} border-violet-200 bg-violet-50`} aria-hidden="true">
        <svg className="h-10 w-10 text-violet-600" viewBox="0 0 40 40" fill="none">
          <rect x="8" y="14" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 22 H26 M20 18 V26" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="14" cy="10" r="2" fill="currentColor" />
          <circle cx="26" cy="10" r="2" fill="currentColor" />
        </svg>
      </div>
    );
  }

  if (type === "platform") {
    return (
      <div className={`${base} border-brand-200 bg-brand-50`} aria-hidden="true">
        <svg className="h-10 w-10 text-brand-600" viewBox="0 0 40 40" fill="none">
          <rect x="6" y="10" width="18" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="22" y="16" width="10" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="26" y="20" width="6" height="10" rx="1" fill="currentColor" fillOpacity="0.2" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${base} border-surface-300 bg-surface-100`} aria-hidden="true">
      <svg className="h-10 w-10 text-surface-600" viewBox="0 0 40 40" fill="none">
        <rect x="8" y="12" width="24" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 18 H32" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="24" r="2" fill="currentColor" />
        <circle cx="22" cy="24" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}
