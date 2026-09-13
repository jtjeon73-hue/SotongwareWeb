import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutView } from "@/components/commerce/CheckoutView";
import { AuthLoadingScreen } from "@/components/auth/AuthFormParts";

export const metadata: Metadata = {
  title: "결제 | SotongWare",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<AuthLoadingScreen message="결제 화면을 준비하는 중…" />}>
      <CheckoutView />
    </Suspense>
  );
}
