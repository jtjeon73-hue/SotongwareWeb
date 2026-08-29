import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "이용약관",
  description: "SotongWare 이용약관",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PlaceholderPage
      title="이용약관"
      description="이용약관 문서는 추후 정식 법률 검토 후 게시됩니다."
      backHref="/"
      backLabel="홈으로"
    />
  );
}
