import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commerce 시제품 | SotongWare",
  description: "검토용 시각 시제품 — 실제 가입·결제·구매는 진행되지 않습니다.",
  robots: { index: false, follow: false },
};

export default function PreviewCommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
