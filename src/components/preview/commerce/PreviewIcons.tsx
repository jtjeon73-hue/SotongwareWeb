import type { ReactElement, ReactNode } from "react";
import type { PreviewBusinessSlug } from "@/data/preview-commerce";
import type { MockMemberState } from "@/data/preview-commerce";
import { cn } from "@/lib/utils";

export type IconSize = "sm" | "md" | "lg" | "xl";

const sizeClass: Record<IconSize, string> = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-10 w-10",
  xl: "h-14 w-14",
};

type SvgProps = {
  size?: IconSize;
  className?: string;
  title?: string;
  decorative?: boolean;
};

function BaseSvg({
  size = "md",
  className,
  title,
  decorative = true,
  children,
}: SvgProps & { children: ReactNode }) {
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": title };

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClass[size], "shrink-0", className)}
      {...a11y}
    >
      {!decorative && title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Shared soft plate behind glyphs for depth without looking toy-like */
export function IconPlate({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/15 p-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* —— Business family —— */

export function IconAutomation(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "산업자동화"}>
      <circle cx="30" cy="18" r="7" {...stroke} />
      <path d="M30 11v2.5M30 22.5V25M23 18h2.5M34.5 18H37" {...stroke} />
      <path d="M27.2 13.2l1.8 1.8M31 20.8l1.8 1.8M27.2 22.8l1.8-1.8M31 15.2l1.8-1.8" {...stroke} />
      <rect x="8" y="28" width="10" height="8" rx="1.5" {...stroke} />
      <rect x="20" y="28" width="10" height="8" rx="1.5" {...stroke} />
      <rect x="32" y="28" width="8" height="8" rx="1.5" {...stroke} />
      <path d="M13 28v-4h8v4M25 28v-4h8v4" {...stroke} />
      <path d="M18 36h4M30 36h4" {...stroke} />
    </BaseSvg>
  );
}

export function IconApps(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "앱개발"}>
      <rect x="15" y="6" width="18" height="36" rx="3.5" {...stroke} />
      <path d="M21 10h6" {...stroke} />
      <rect x="19" y="15" width="5" height="5" rx="1" {...stroke} />
      <rect x="26" y="15" width="5" height="5" rx="1" {...stroke} />
      <rect x="19" y="22" width="5" height="5" rx="1" {...stroke} />
      <rect x="26" y="22" width="5" height="5" rx="1" {...stroke} />
      <path d="M36 12l1.2 2.4L40 15.2l-2.4 1.2L36 19l-1.2-2.6L32 15.2l2.8-.8L36 12z" fill="currentColor" opacity="0.9" />
      <path d="M22 38h4" {...stroke} />
    </BaseSvg>
  );
}

export function IconEbooks(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "전자책"}>
      <path d="M10 14c4-2 8-2 14 0v22c-6-2-10-2-14 0V14z" {...stroke} />
      <path d="M38 14c-4-2-8-2-14 0v22c6-2 10-2 14 0V14z" {...stroke} />
      <path d="M24 14v22" {...stroke} />
      <path d="M24 8c1.5 2.5 2 5 2 7" {...stroke} />
      <path d="M24 8c-1.5 2.5-2 5-2 7" {...stroke} />
      <circle cx="24" cy="7" r="1.5" fill="currentColor" />
      <path d="M20 20h3M28 20h3M20 25h3M28 25h3" {...stroke} opacity="0.7" />
    </BaseSvg>
  );
}

export function IconKnowledge(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "지식·교육"}>
      <circle cx="24" cy="20" r="9" {...stroke} />
      <path d="M24 11v3M24 26v3M15 20h3M30 20h3" {...stroke} />
      <path d="M18.5 14.5l2 2M27.5 23.5l2 2M18.5 25.5l2-2M27.5 14.5l2-2" {...stroke} />
      <circle cx="24" cy="20" r="2.5" {...stroke} />
      <path d="M24 29v5" {...stroke} />
      <path d="M16 38c2.5-4 5.5-6 8-6s5.5 2 8 6" {...stroke} />
      <path d="M20 34h8" {...stroke} />
    </BaseSvg>
  );
}

export function IconMarketing(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "마케팅"}>
      <path d="M8 22h8l10-8v20L16 26H8v-4z" {...stroke} />
      <path d="M30 18c2.5 1.5 4 3.5 4 6s-1.5 4.5-4 6" {...stroke} />
      <path d="M34 14c4 2.5 6.5 5.5 6.5 10S38 31.5 34 34" {...stroke} />
      <path d="M14 34l4 6M22 30l3 5" {...stroke} />
      <path d="M10 12l3 2M12 8l1.5 3" {...stroke} opacity="0.8" />
    </BaseSvg>
  );
}

export function IconContents(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "콘텐츠"}>
      <rect x="7" y="10" width="20" height="16" rx="2" {...stroke} />
      <path d="M14 15l7 3.5-7 3.5V15z" fill="currentColor" opacity="0.85" />
      <path d="M32 18c0-2 1.5-3.5 3.5-3.5S39 16 39 18v10" {...stroke} />
      <circle cx="35.5" cy="30" r="3" {...stroke} />
      <rect x="10" y="30" width="14" height="9" rx="1.5" {...stroke} />
      <path d="M13 33h8M13 36h5" {...stroke} opacity="0.7" />
    </BaseSvg>
  );
}

export const businessIcons: Record<
  PreviewBusinessSlug,
  (props: SvgProps) => ReactElement
> = {
  automation: IconAutomation,
  apps: IconApps,
  ebooks: IconEbooks,
  knowledge: IconKnowledge,
  marketing: IconMarketing,
  contents: IconContents,
};

export function BusinessIcon({
  slug,
  size = "lg",
  className,
  decorative = true,
  title,
}: {
  slug: PreviewBusinessSlug;
  size?: IconSize;
  className?: string;
  decorative?: boolean;
  title?: string;
}) {
  const Cmp = businessIcons[slug];
  return <Cmp size={size} className={className} decorative={decorative} title={title} />;
}

/* —— Journey —— */

export function IconJourneyDiscover(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "상품 발견"}>
      <circle cx="21" cy="21" r="10" {...stroke} />
      <path d="M28.5 28.5L38 38" {...stroke} />
      <path d="M17 21h8M21 17v8" {...stroke} />
    </BaseSvg>
  );
}

export function IconJourneyPreview(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "무료 미리보기"}>
      <rect x="8" y="10" width="32" height="24" rx="3" {...stroke} />
      <path d="M8 16h32" {...stroke} />
      <circle cx="12" cy="13" r="1" fill="currentColor" />
      <circle cx="16" cy="13" r="1" fill="currentColor" />
      <path d="M14 24l8 4.5L14 33V24z" fill="currentColor" opacity="0.85" />
      <path d="M26 23h10M26 28h7" {...stroke} opacity="0.7" />
    </BaseSvg>
  );
}

export function IconJourneyPay(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "요금·결제"}>
      <rect x="7" y="14" width="34" height="22" rx="3" {...stroke} />
      <path d="M7 22h34" {...stroke} />
      <path d="M12 18h8" {...stroke} />
      <rect x="12" y="27" width="10" height="5" rx="1" {...stroke} />
      <path d="M30 29h6M30 32h4" {...stroke} />
    </BaseSvg>
  );
}

export function IconJourneyLibrary(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "내 자료실"}>
      <path d="M10 14h12l3 3h13v19a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V14z" {...stroke} />
      <path d="M16 24h16M16 29h12" {...stroke} />
      <path d="M22 8v5" {...stroke} />
      <path d="M18 11h8" {...stroke} />
    </BaseSvg>
  );
}

export type JourneyKind = "discover" | "preview" | "pay" | "library";

export function JourneyIcon({
  kind,
  ...rest
}: { kind: JourneyKind } & SvgProps) {
  const map = {
    discover: IconJourneyDiscover,
    preview: IconJourneyPreview,
    pay: IconJourneyPay,
    library: IconJourneyLibrary,
  } as const;
  const Cmp = map[kind];
  return <Cmp {...rest} />;
}

/* —— Membership / access status —— */

export function IconStatusFree(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "Free"}>
      <circle cx="24" cy="24" r="14" {...stroke} />
      <path d="M16 24h16" {...stroke} />
      <path d="M24 16v16" {...stroke} opacity="0.35" />
    </BaseSvg>
  );
}

export function IconStatusBasicActive(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "Basic 이용 중"}>
      <path d="M24 8l4 8h9l-7 6 2.5 9L24 26l-8.5 5 2.5-9-7-6h9L24 8z" {...stroke} />
    </BaseSvg>
  );
}

export function IconStatusExpired(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "만료"}>
      <circle cx="24" cy="24" r="14" {...stroke} />
      <path d="M24 14v11l7 4" {...stroke} />
    </BaseSvg>
  );
}

export function IconStatusCancelled(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "해지 예정"}>
      <circle cx="24" cy="24" r="14" {...stroke} />
      <path d="M17 17l14 14M31 17L17 31" {...stroke} />
    </BaseSvg>
  );
}

export function IconStatusAllowed(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "접근 허용"}>
      <circle cx="24" cy="24" r="14" {...stroke} />
      <path d="M15 24l6 6 12-13" {...stroke} />
    </BaseSvg>
  );
}

export function IconStatusBlocked(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "접근 제한"}>
      <circle cx="24" cy="24" r="14" {...stroke} />
      <rect x="18" y="20" width="12" height="10" rx="1.5" {...stroke} />
      <path d="M21 20v-3a3 3 0 0 1 6 0v3" {...stroke} />
    </BaseSvg>
  );
}

export function IconStatusGuest(props: SvgProps) {
  return (
    <BaseSvg {...props} title={props.title ?? "둘러보기"}>
      <circle cx="24" cy="18" r="6" {...stroke} />
      <path d="M12 38c2.5-7 7-11 12-11s9.5 4 12 11" {...stroke} />
    </BaseSvg>
  );
}

export function MemberStatusIcon({
  state,
  ...rest
}: { state: MockMemberState } & SvgProps) {
  switch (state) {
    case "free":
      return <IconStatusFree {...rest} />;
    case "basic_active":
      return <IconStatusBasicActive {...rest} />;
    case "basic_expired":
      return <IconStatusExpired {...rest} />;
    case "basic_cancelled":
      return <IconStatusCancelled {...rest} />;
    default:
      return <IconStatusGuest {...rest} />;
  }
}

export const previewCardMotion =
  "motion-safe:transition motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";
