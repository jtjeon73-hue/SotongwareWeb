import type { Metadata } from "next";
import { Suspense } from "react";
import { PurchaseOrderView } from "@/components/commerce/PurchaseOrderView";
import { AuthLoadingScreen } from "@/components/auth/AuthFormParts";

export const metadata: Metadata = {
  title: "주문 상세 | SotongWare",
  robots: { index: false, follow: false },
};

export default function PurchaseOrderPage() {
  return (
    <Suspense fallback={<AuthLoadingScreen message="주문 상세를 불러오는 중…" />}>
      <PurchaseOrderView />
    </Suspense>
  );
}
