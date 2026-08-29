import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "SotongWare 문의 및 안내",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PlaceholderPage
      title="Contact"
      description="직접 문의는 자동 안내로 해결할 수 없는 경우의 최종 수단입니다. 문의 폼과 연락 채널은 추후 추가됩니다."
      backHref="/"
      backLabel="홈으로"
    />
  );
}
