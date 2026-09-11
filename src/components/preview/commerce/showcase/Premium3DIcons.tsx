import type { ReactElement, ReactNode } from "react";
import type { PreviewBusinessSlug } from "@/data/preview-commerce";
import { cn } from "@/lib/utils";

type Size = "md" | "lg" | "xl";
const sizeClass: Record<Size, string> = {
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
};

type IconProps = {
  size?: Size;
  className?: string;
  title?: string;
  decorative?: boolean;
};

function Frame({
  size = "xl",
  className,
  title,
  decorative = true,
  children,
}: IconProps & { children: ReactNode }) {
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": title };
  return (
    <svg
      viewBox="0 0 80 80"
      className={cn(sizeClass[size], "shrink-0 overflow-visible", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...a11y}
    >
      {!decorative && title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

/** Soft ground shadow shared by all premium icons */
function GroundShadow() {
  return (
    <ellipse cx="40" cy="70" rx="22" ry="4.5" fill="#020617" opacity="0.28" />
  );
}

export function PremiumAutomation(props: IconProps) {
  return (
    <Frame {...props} title={props.title ?? "산업자동화"}>
      <defs>
        <linearGradient id="autoFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <linearGradient id="autoSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#164e63" />
          <stop offset="100%" stopColor="#083344" />
        </linearGradient>
        <linearGradient id="autoMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
      <GroundShadow />
      {/* isometric PLC block */}
      <g className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/card:-translate-y-0.5 motion-safe:group-focus-visible/card:-translate-y-0.5">
        <path d="M28 34l16-8 16 8v18l-16 8-16-8V34z" fill="url(#autoFace)" />
        <path d="M28 34v18l16 8V42L28 34z" fill="url(#autoSide)" />
        <path d="M44 42v18l16-8V34L44 42z" fill="#155e75" opacity="0.85" />
        <path d="M28 34l16-8 16 8-16 8-16-8z" fill="url(#autoMetal)" opacity="0.55" />
        <path d="M36 40h4v3h-4zM42 40h4v3h-4zM48 40h4v3h-4z" fill="#ecfeff" opacity="0.9" />
        <circle cx="54" cy="28" r="7" fill="#0f172a" stroke="#67e8f9" strokeWidth="1.5" />
        <path d="M54 23v3M54 30v3M49 28h3M56 28h3" stroke="#a5f3fc" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M22 48h8M22 52h6" stroke="#22d3ee" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
        <circle cx="40" cy="36" r="1.5" fill="#f0fdfa" />
      </g>
      <path d="M30 36l12-2" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
    </Frame>
  );
}

export function PremiumApps(props: IconProps) {
  return (
    <Frame {...props} title={props.title ?? "앱개발"}>
      <defs>
        <linearGradient id="phoneBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="phoneSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <GroundShadow />
      <g className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/card:-translate-y-1 motion-safe:group-focus-visible/card:-translate-y-1">
        {/* back card layer */}
        <rect x="34" y="14" width="28" height="44" rx="5" fill="#1e40af" opacity="0.45" transform="rotate(8 48 36)" />
        {/* phone */}
        <path d="M26 16h22c2.2 0 4 1.8 4 4v40c0 2.2-1.8 4-4 4H26c-2.2 0-4-1.8-4-4V20c0-2.2 1.8-4 4-4z" fill="url(#phoneBody)" />
        <path d="M48 20v40c0 2.2-1.8 4-4 4h2c2.2 0 4-1.8 4-4V20c0-2.2-1.8-4-4-4h-2c2.2 0 4 1.8 4 4z" fill="url(#phoneSide)" opacity="0.5" />
        <rect x="28" y="22" width="18" height="28" rx="2" fill="#0f172a" opacity="0.55" />
        <rect x="29" y="24" width="7" height="7" rx="1.2" fill="#7dd3fc" />
        <rect x="38" y="24" width="7" height="7" rx="1.2" fill="#bae6fd" />
        <rect x="29" y="33" width="7" height="7" rx="1.2" fill="#38bdf8" />
        <rect x="38" y="33" width="7" height="7" rx="1.2" fill="#e0f2fe" opacity="0.85" />
        <path d="M33 56h8" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="56" cy="22" r="4" fill="#fbbf24" opacity="0.95" />
        <path d="M56 20.2v3.6M54.2 22h3.6" stroke="#1e3a8a" strokeWidth="1.1" strokeLinecap="round" />
      </g>
      <path d="M28 20h14" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" />
    </Frame>
  );
}

export function PremiumEbooks(props: IconProps) {
  return (
    <Frame {...props} title={props.title ?? "전자책"}>
      <defs>
        <linearGradient id="bookCover" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="pageFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
      </defs>
      <GroundShadow />
      <g className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/card:-translate-y-0.5 motion-safe:group-focus-visible/card:-translate-y-0.5">
        <path d="M18 24l18-6 26 10v32L36 70 18 56V24z" fill="url(#bookCover)" />
        <path d="M36 28l26 10v32L36 70V28z" fill="#9a3412" opacity="0.55" />
        <path d="M22 28l14-4 4 14-14 6-4-16z" fill="url(#pageFace)" />
        <path d="M26 34h8M26 38h6" stroke="#c2410c" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
        <path d="M40 18c2 4 3 8 3 12" stroke="#fde68a" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M40 18c-2 4-3 8-3 12" stroke="#fdba74" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="40" cy="16" r="2.2" fill="#fff7ed" />
      </g>
      <path d="M24 30l10-2" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.2" />
    </Frame>
  );
}

export function PremiumKnowledge(props: IconProps) {
  return (
    <Frame {...props} title={props.title ?? "지식·교육"}>
      <defs>
        <linearGradient id="compFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="pathStep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#99f6e4" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      <GroundShadow />
      <g className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/card:-translate-y-0.5 motion-safe:group-focus-visible/card:-translate-y-0.5">
        <circle cx="40" cy="32" r="16" fill="url(#compFace)" />
        <circle cx="40" cy="32" r="16" fill="#042f2e" opacity="0.15" />
        <circle cx="40" cy="32" r="6" fill="#ecfdf5" stroke="#134e4a" strokeWidth="1.2" />
        <path d="M40 18v5M40 41v5M24 32h5M51 32h5" stroke="#ecfdf5" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M29 21l3.5 3.5M47.5 39.5l3.5 3.5M29 43l3.5-3.5M47.5 24.5l3.5-3.5" stroke="#a7f3d0" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M40 38l4-6" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />
        <rect x="22" y="52" width="10" height="8" rx="1.5" fill="url(#pathStep)" />
        <rect x="35" y="50" width="10" height="10" rx="1.5" fill="#5eead4" />
        <rect x="48" y="48" width="10" height="12" rx="1.5" fill="#2dd4bf" />
      </g>
      <path d="M30 24h8" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" />
    </Frame>
  );
}

export function PremiumMarketing(props: IconProps) {
  return (
    <Frame {...props} title={props.title ?? "마케팅"}>
      <defs>
        <linearGradient id="megFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#9d174d" />
        </linearGradient>
      </defs>
      <GroundShadow />
      <g className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/card:-translate-y-0.5 motion-safe:group-focus-visible/card:-translate-y-0.5">
        <path d="M18 34h14l16-12v32L32 42H18V34z" fill="url(#megFace)" />
        <path d="M32 42l16 12V22L32 34v8z" fill="#831843" opacity="0.55" />
        <path d="M18 34v8h8l2-4-2-4H18z" fill="#fda4af" opacity="0.5" />
        <path d="M52 28c4 2.5 6.5 6 6.5 10S56 43.5 52 46" stroke="#f9a8d4" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M58 24c6 3.5 9.5 8 9.5 14S64 48.5 58 52" stroke="#f472b6" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.75" />
        <path d="M26 48l4 10M34 46l3 8" stroke="#fecdd3" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 22l6 3M28 18l2 4" stroke="#fda4af" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="44" cy="24" r="2" fill="#fff1f2" />
      </g>
      <path d="M22 36h8" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" />
    </Frame>
  );
}

export function PremiumContents(props: IconProps) {
  return (
    <Frame {...props} title={props.title ?? "콘텐츠"}>
      <defs>
        <linearGradient id="screenFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="55%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
      <GroundShadow />
      <g className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/card:-translate-y-0.5 motion-safe:group-focus-visible/card:-translate-y-0.5">
        <rect x="14" y="18" width="36" height="28" rx="4" fill="url(#screenFace)" />
        <rect x="14" y="18" width="36" height="28" rx="4" fill="#020617" opacity="0.2" />
        <path d="M26 26l12 6-12 6V26z" fill="#ecfeff" opacity="0.95" />
        <rect x="18" y="50" width="24" height="14" rx="2" fill="#312e81" />
        <path d="M22 54h12M22 58h8" stroke="#c7d2fe" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <path d="M54 28c0-4 3-7 7-7s7 3 7 7v18" stroke="#f0abfc" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="61" cy="50" r="5" fill="#db2777" stroke="#fce7f3" strokeWidth="1.2" />
        <path d="M48 20l2 3 3.5.4-2.6 2.2.7 3.4L48 27.2 45.4 29l.7-3.4-2.6-2.2 3.5-.4L48 20z" fill="#fbbf24" />
      </g>
      <path d="M18 22h16" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" />
    </Frame>
  );
}

export const premiumBusinessIcons: Record<
  PreviewBusinessSlug,
  (props: IconProps) => ReactElement
> = {
  automation: PremiumAutomation,
  apps: PremiumApps,
  ebooks: PremiumEbooks,
  knowledge: PremiumKnowledge,
  marketing: PremiumMarketing,
  contents: PremiumContents,
};

export function PremiumBusinessIcon({
  slug,
  ...rest
}: { slug: PreviewBusinessSlug } & IconProps) {
  const Cmp = premiumBusinessIcons[slug];
  return <Cmp {...rest} />;
}

export function PremiumIconStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "group/card inline-flex items-center justify-center rounded-[1.35rem] border border-white/20 bg-gradient-to-br from-white/15 to-white/5 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_12px_30px_-16px_rgba(34,211,238,0.55)] backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
