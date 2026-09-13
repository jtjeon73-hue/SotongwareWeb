import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutFailView } from "@/components/commerce/CheckoutFailView";
import { AuthLoadingScreen } from "@/components/auth/AuthFormParts";

export const metadata: Metadata = {
  title: "결제 실패 | SotongWare",
  robots: { index: false, follow: false },
};

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={<AuthLoadingScreen message="결제 결과를 확인하는 중…" />}>
      <CheckoutFailView />
    </Suspense>
  );
}
