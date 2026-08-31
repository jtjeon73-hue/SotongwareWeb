import { EXTERNAL_SITE_SECURITY_NOTICE } from "@/data/business-access";

export function ExternalSiteSecurityNotice({ className }: { className?: string }) {
  return (
    <p className={className ?? "text-xs leading-relaxed text-surface-500"}>
      {EXTERNAL_SITE_SECURITY_NOTICE}
    </p>
  );
}
