"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { PreviewPersona } from "@/types/access-tier";
import { parsePreviewPersona, previewPersonaLabels } from "@/lib/access-tier";

const PERSONAS: PreviewPersona[] = ["guest", "member", "premium"];

/**
 * Explicit mock entitlement switcher — must never look like real Auth.
 */
export function PreviewPersonaBar({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const persona = parsePreviewPersona(searchParams.get("previewAccess"));

  function setPersona(next: PreviewPersona) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "guest") params.delete("previewAccess");
    else params.set("previewAccess", next);
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }

  return (
    <div
      className="rounded-2xl border border-sky-200 bg-sky-50/80 px-4 py-3"
      role="group"
      aria-label={locale === "en" ? "Preview access mode" : "Preview 권한 모드"}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">
        {locale === "en" ? "Preview access (mock only)" : "Preview 권한 (mock 전용)"}
      </p>
      <p className="mt-1 text-xs text-sky-900/80">
        {locale === "en"
          ? "Not a real membership. Does not call live Auth or payments."
          : "실제 회원 상태가 아닙니다. 운영 Auth·결제를 호출하지 않습니다."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {PERSONAS.map((p) => {
          const active = p === persona;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPersona(p)}
              className={`min-h-10 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                active
                  ? "bg-brand-600 text-white"
                  : "border border-sky-200 bg-white text-sky-900 hover:bg-sky-100"
              }`}
              aria-pressed={active}
            >
              {previewPersonaLabels[locale][p]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function usePreviewPersona(): PreviewPersona {
  const searchParams = useSearchParams();
  return parsePreviewPersona(searchParams.get("previewAccess"));
}
