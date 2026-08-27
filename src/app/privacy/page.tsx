import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "개인정보처리방침",
};

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
