import type { AccessLevel, PublicationStatus } from "@/types/membership";
import { accessLevelLabels, publicationStatusLabels } from "@/data/business-access";
import { cn } from "@/lib/utils";

export function AccessLevelBadge({
  accessLevel,
  publicationStatus,
  className,
}: {
  accessLevel: AccessLevel;
  publicationStatus: PublicationStatus;
  className?: string;
}) {
  const isComingSoon = publicationStatus === "comingSoon" || publicationStatus === "draft";

  if (isComingSoon) {
    return (
      <span
        className={cn(
          "inline-flex rounded-md bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-600 ring-1 ring-surface-200",
          className,
        )}
      >
        {publicationStatusLabels[publicationStatus]}
      </span>
    );
  }

  const styles: Record<AccessLevel, string> = {
    public: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    member: "bg-brand-50 text-brand-800 ring-brand-200",
    premium: "bg-amber-50 text-amber-800 ring-amber-200",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1",
        styles[accessLevel],
        className,
      )}
    >
      {accessLevelLabels[accessLevel]}
    </span>
  );
}
