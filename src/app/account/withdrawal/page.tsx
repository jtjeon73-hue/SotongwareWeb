import type { Metadata } from "next";
import { WithdrawalView } from "./WithdrawalView";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "계정 탈퇴 안내",
    description: "SotongWare 계정 탈퇴 절차 안내 (실행 없음)",
    path: "/account/withdrawal",
  }),
  robots: { index: false, follow: false },
};

export default function WithdrawalPage() {
  return <WithdrawalView />;
}
