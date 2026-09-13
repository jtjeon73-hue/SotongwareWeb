import type { Metadata } from "next";
import { PurchasesView } from "@/components/commerce/PurchasesView";

export const metadata: Metadata = {
  title: "구매내역 | SotongWare",
  robots: { index: false, follow: false },
};

export default function PurchasesPage() {
  return <PurchasesView />;
}
