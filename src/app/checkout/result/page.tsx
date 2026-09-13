import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutResultView } from "@/components/commerce/CheckoutResultView";
import { AuthLoadingScreen } from "@/components/auth/AuthFormParts";

export const metadata: Metadata = {
  title: "결제 결과 | SotongWare",
  robots: { index: false, follow: false },
};

export default function CheckoutResultPage() {
  return (
    <Suspense fallback={<AuthLoadingScreen message="결제 결과를 확인하는 중…" />}>
      <CheckoutResultView />
    </Suspense>
  );
}
