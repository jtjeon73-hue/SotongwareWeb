import type { Locale } from "@/i18n/config";
import { placeholderLabels, pageLabels } from "@/i18n/page-labels";
import { localizePath } from "@/i18n/localized-path";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export function PrivacyTermsPageView({
  locale,
  kind,
}: {
  locale: Locale;
  kind: "privacy" | "terms";
}) {
  const meta = pageLabels[locale][kind];
  const labels = placeholderLabels[locale];
  const pending =
    kind === "privacy"
      ? locale === "en"
        ? "The privacy policy will be published after formal legal review."
        : "개인정보처리방침 문서는 추후 정식 법률 검토 후 게시됩니다."
      : locale === "en"
        ? "The terms of use will be published after formal legal review."
        : "이용약관 문서는 추후 정식 법률 검토 후 게시됩니다.";

  return (
    <PlaceholderPage
      title={meta.title}
      description={pending}
      backHref={localizePath("/", locale)}
      backLabel={labels.backHome}
      skeletonNote={labels.skeletonNote}
    />
  );
}
