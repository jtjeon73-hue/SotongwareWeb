import type { Metadata } from "next";
import { DashboardView } from "./DashboardView";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "내 대시보드",
    description: "SotongWare 회원 대시보드 — 이용 가능한 사업과 회원 콘텐츠",
    path: "/dashboard",
  }),
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardView />;
}
