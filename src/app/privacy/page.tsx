import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "개인정보처리방침",
  description: "SotongWare 개인정보처리방침",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      title="개인정보처리방침"
      description="개인정보처리방침 문서는 추후 정식 법률 검토 후 게시됩니다."
      backHref="/"
      backLabel="홈으로"
    />
  );
}
