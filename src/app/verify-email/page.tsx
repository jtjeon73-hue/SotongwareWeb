import type { Metadata } from "next";
import { VerifyEmailView } from "./VerifyEmailView";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "이메일 인증",
    description: "SotongWare 이메일 인증 안내",
    path: "/verify-email",
  }),
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <div className="section-padding bg-gradient-to-b from-slate-50 to-white">
      <VerifyEmailView />
    </div>
  );
}
