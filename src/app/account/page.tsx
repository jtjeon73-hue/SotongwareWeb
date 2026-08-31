import type { Metadata } from "next";
import { AccountView } from "./AccountView";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "계정 설정",
    description: "SotongWare 회원 계정 설정",
    path: "/account",
  }),
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountView />;
}
