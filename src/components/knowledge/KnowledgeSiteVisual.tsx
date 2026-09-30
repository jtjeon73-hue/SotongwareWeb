import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Soft premium hub icons — same family as preview/commerce Premium3DIcons
 * (soft gradients + ground shadow), kept flat and calm for a knowledge portal.
 * Decorative only: always aria-hidden, never the sole carrier of meaning.
 */

export const KNOWLEDGE_SITE_VISUAL_SLUGS = [
  "ai-story",
  "electric",
  "car",
  "finance",
  "language",
  "health",
  "plc",
  "smart-farm",
  "development",
  "web-app-dev",
  "country-ai",
  "save-live",
] as const;

export type KnowledgeSiteVisualSlug = (typeof KNOWLEDGE_SITE_VISUAL_SLUGS)[number];

type Tone = {
  /** Plate (icon background) classes — theme colored */
  plate: string;
  from: string;
  to: string;
  accent: string;
};

const TONES: Record<KnowledgeSiteVisualSlug, Tone> = {
  "ai-story": {
    plate: "bg-gradient-to-br from-violet-50 to-violet-100 ring-violet-200/70",
    from: "#a78bfa",
    to: "#6d28d9",
    accent: "#ede9fe",
  },
  electric: {
    plate: "bg-gradient-to-br from-amber-50 to-amber-100 ring-amber-200/70",
    from: "#fcd34d",
    to: "#d97706",
    accent: "#fffbeb",
  },
  car: {
    plate: "bg-gradient-to-br from-slate-50 to-slate-200/80 ring-slate-300/70",
    from: "#94a3b8",
    to: "#334155",
    accent: "#f1f5f9",
  },
  finance: {
    plate: "bg-gradient-to-br from-emerald-50 to-emerald-100 ring-emerald-200/70",
    from: "#34d399",
    to: "#047857",
    accent: "#ecfdf5",
  },
  language: {
    plate: "bg-gradient-to-br from-sky-50 to-sky-100 ring-sky-200/70",
    from: "#7dd3fc",
    to: "#0369a1",
    accent: "#f0f9ff",
  },
  health: {
    plate: "bg-gradient-to-br from-rose-50 to-rose-100 ring-rose-200/70",
    from: "#fda4af",
    to: "#be123c",
    accent: "#fff1f2",
  },
  plc: {
    plate: "bg-gradient-to-br from-cyan-50 to-cyan-100 ring-cyan-200/70",
    from: "#67e8f9",
    to: "#0e7490",
    accent: "#ecfeff",
  },
  "smart-farm": {
    plate: "bg-gradient-to-br from-lime-50 to-lime-100 ring-lime-200/70",
    from: "#bef264",
    to: "#4d7c0f",
    accent: "#f7fee7",
  },
  development: {
    plate: "bg-gradient-to-br from-indigo-50 to-indigo-100 ring-indigo-200/70",
    from: "#a5b4fc",
    to: "#4338ca",
    accent: "#eef2ff",
  },
  "web-app-dev": {
    plate: "bg-gradient-to-br from-blue-50 to-blue-100 ring-blue-200/70",
    from: "#93c5fd",
    to: "#1d4ed8",
    accent: "#eff6ff",
  },
  "country-ai": {
    plate: "bg-gradient-to-br from-teal-50 to-teal-100 ring-teal-200/70",
    from: "#5eead4",
    to: "#0f766e",
    accent: "#f0fdfa",
  },
  "save-live": {
    plate: "bg-gradient-to-br from-orange-50 to-orange-100 ring-orange-200/70",
    from: "#fdba74",
    to: "#c2410c",
    accent: "#fff7ed",
  },
};

export function isKnowledgeSiteVisualSlug(slug: string): slug is KnowledgeSiteVisualSlug {
  return (KNOWLEDGE_SITE_VISUAL_SLUGS as readonly string[]).includes(slug);
}

function Glyph({
  slug,
  tone,
  children,
}: {
  slug: string;
  tone: Tone;
  children: ReactNode;
}) {
  const g = `ksv-${slug}-g`;
  const s = `ksv-${slug}-s`;
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-10 w-10 shrink-0 overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={tone.from} />
          <stop offset="100%" stopColor={tone.to} />
        </linearGradient>
        <linearGradient id={s} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="13" ry="2.6" fill="#0f172a" opacity="0.14" />
      {children}
    </svg>
  );
}

function icon(slug: KnowledgeSiteVisualSlug, tone: Tone): ReactElement {
  const fill = `url(#ksv-${slug}-g)`;
  const sheen = `url(#ksv-${slug}-s)`;
  const a = tone.accent;
  switch (slug) {
    case "ai-story":
      return (
        <>
          <path d="M9 12a6 6 0 0 1 6-6h18a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H22l-9 7v-7h-1a3 3 0 0 1-3-3V12z" fill={fill} />
          <path d="M9 12a6 6 0 0 1 6-6h18a6 6 0 0 1 6 6v6H9v-6z" fill={sheen} />
          <path d="M24 12l1.9 5.1L31 19l-5.1 1.9L24 26l-1.9-5.1L17 19l5.1-1.9L24 12z" fill={a} />
        </>
      );
    case "electric":
      return (
        <>
          <path d="M27 4L11 26h10l-3 16 19-24H26l1-14z" fill={fill} />
          <path d="M27 4L11 26h10l2-9 4-13z" fill={sheen} />
          <path d="M26 12l-6 9h6" stroke={a} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        </>
      );
    case "car":
      return (
        <>
          <path d="M6 28l3-9a5 5 0 0 1 4.7-3.4h20.6A5 5 0 0 1 39 19l3 9v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6z" fill={fill} />
          <path d="M12 19.5h24l2 6H10l2-6z" fill={a} opacity="0.85" />
          <path d="M9 19a5 5 0 0 1 4.7-3.4h20.6A5 5 0 0 1 39 19H9z" fill={sheen} />
          <circle cx="14" cy="35" r="4.2" fill="#1e293b" />
          <circle cx="34" cy="35" r="4.2" fill="#1e293b" />
          <circle cx="14" cy="35" r="1.6" fill={a} />
          <circle cx="34" cy="35" r="1.6" fill={a} />
        </>
      );
    case "finance":
      return (
        <>
          <rect x="8" y="26" width="7" height="14" rx="2" fill={fill} opacity="0.75" />
          <rect x="19" y="18" width="7" height="22" rx="2" fill={fill} opacity="0.9" />
          <rect x="30" y="9" width="7" height="31" rx="2" fill={fill} />
          <path d="M30 11a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v6H30v-6z" fill={sheen} />
          <path d="M9 18l8-6 7 4 9-9" stroke={a} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case "language":
      return (
        <>
          <path d="M5 11a5 5 0 0 1 5-5h16a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5H16l-6 5v-5a5 5 0 0 1-5-5v-9z" fill={fill} />
          <path d="M20 22a5 5 0 0 1 5-5h13a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5v4l-6-4H25a5 5 0 0 1-5-5v-8z" fill={tone.to} opacity="0.85" />
          <path d="M5 11a5 5 0 0 1 5-5h16a5 5 0 0 1 5 5v3H5v-3z" fill={sheen} />
          <path d="M12 19l3.5-8 3.5 8M13.2 16.5h4.6" stroke={a} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case "health":
      return (
        <>
          <path d="M24 41S7 31 7 18.5A9.5 9.5 0 0 1 24 13a9.5 9.5 0 0 1 17 5.5C41 31 24 41 24 41z" fill={fill} />
          <path d="M7 18.5A9.5 9.5 0 0 1 24 13a9.5 9.5 0 0 1 17 5.5c0 2-.4 3.7-1 5.2H8c-.6-1.5-1-3.2-1-5.2z" fill={sheen} />
          <path d="M11 24h8l3-6 4 10 3-4h8" stroke={a} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case "plc":
      return (
        <>
          <rect x="6" y="9" width="36" height="30" rx="5" fill={fill} />
          <rect x="6" y="9" width="36" height="11" rx="5" fill={sheen} />
          <rect x="11" y="15" width="10" height="18" rx="2" fill={a} opacity="0.9" />
          <rect x="24" y="15" width="10" height="18" rx="2" fill={a} opacity="0.55" />
          <circle cx="16" cy="20" r="1.6" fill={tone.to} />
          <circle cx="16" cy="26" r="1.6" fill={tone.to} opacity="0.6" />
          <circle cx="29" cy="20" r="1.6" fill={tone.to} opacity="0.6" />
          <circle cx="38" cy="18" r="1.8" fill="#bbf7d0" />
          <circle cx="38" cy="24" r="1.8" fill="#fde68a" />
        </>
      );
    case "smart-farm":
      return (
        <>
          <path d="M24 38V22" stroke={tone.to} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M24 26C24 16 16 10 8 10c0 10 6 16 16 16z" fill={fill} />
          <path d="M24 22c0-8 6-13 14-13 0 8-5 13-14 13z" fill={fill} opacity="0.85" />
          <path d="M8 10c4 0 8 1.8 11 4.5L8 10z" fill={sheen} />
          <path d="M8 39c4-4 12-4 16 0 4-4 12-4 16 0" stroke={tone.to} strokeWidth="2.4" strokeLinecap="round" opacity="0.65" />
        </>
      );
    case "development":
      return (
        <>
          <rect x="5" y="9" width="38" height="30" rx="6" fill={fill} />
          <rect x="5" y="9" width="38" height="11" rx="6" fill={sheen} />
          <path d="M18 18l-6 6 6 6M30 18l6 6-6 6" stroke={a} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26 16l-4 16" stroke={a} strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
        </>
      );
    case "web-app-dev":
      return (
        <>
          <rect x="5" y="8" width="38" height="32" rx="6" fill={fill} />
          <path d="M5 14a6 6 0 0 1 6-6h26a6 6 0 0 1 6 6v3H5v-3z" fill={a} opacity="0.92" />
          <circle cx="11" cy="12.5" r="1.4" fill={tone.to} />
          <circle cx="16" cy="12.5" r="1.4" fill={tone.to} opacity="0.65" />
          <rect x="10" y="22" width="13" height="12" rx="2.5" fill={a} opacity="0.85" />
          <rect x="27" y="22" width="11" height="4.5" rx="2" fill={a} opacity="0.6" />
          <rect x="27" y="29.5" width="11" height="4.5" rx="2" fill={a} opacity="0.4" />
        </>
      );
    case "country-ai":
      return (
        <>
          <path d="M6 23L24 7l18 16v14a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V23z" fill={fill} />
          <path d="M6 23L24 7l18 16H6z" fill={sheen} />
          <rect x="19" y="27" width="10" height="13" rx="2" fill={a} opacity="0.88" />
          <path d="M35 6l1.3 3.5L40 11l-3.7 1.5L35 16l-1.3-3.5L30 11l3.7-1.5L35 6z" fill="#fde68a" />
        </>
      );
    case "save-live":
      return (
        <>
          <path d="M8 14a4 4 0 0 1 4-4h22l-2 6H12a4 4 0 0 0-4 4v-6z" fill={tone.to} opacity="0.7" />
          <rect x="6" y="15" width="36" height="25" rx="6" fill={fill} />
          <rect x="6" y="15" width="36" height="9" rx="6" fill={sheen} />
          <rect x="29" y="23" width="13" height="10" rx="4" fill={a} opacity="0.9" />
          <circle cx="34" cy="28" r="1.8" fill={tone.to} />
          <path d="M14 33c2.5 2 5.5 2 8 0" stroke={a} strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
        </>
      );
  }
}

/**
 * Plate + icon for hub cards. Fixed ~64px icon area (shrink-0) so card typography
 * keeps the remaining width (pair with min-w-0 on the text column).
 */
export function KnowledgeSiteVisual({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  if (!isKnowledgeSiteVisualSlug(slug)) return null;
  const tone = TONES[slug];
  return (
    <div
      aria-hidden="true"
      data-knowledge-visual={slug}
      className={cn(
        "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ring-inset",
        tone.plate,
        className,
      )}
    >
      <Glyph slug={slug} tone={tone}>
        {icon(slug, tone)}
      </Glyph>
    </div>
  );
}
