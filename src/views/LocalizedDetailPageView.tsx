import type { Locale } from "@/i18n/config";
import { placeholderLabels } from "@/i18n/page-labels";
import { localizePath } from "@/i18n/localized-path";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export function LocalizedDetailPageView({
  locale,
  title,
  description,
  backPath,
}: {
  locale: Locale;
  title: string;
  description: string;
  backPath: string;
}) {
  const labels = placeholderLabels[locale];
  return (
    <PlaceholderPage
      title={title}
      description={description}
      backHref={localizePath(backPath, locale)}
      backLabel={`${labels.backToList}`}
      skeletonNote={labels.skeletonNote}
    />
  );
}
