import type { Metadata } from "next";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "비밀번호 재설정",
    description: "SotongWare 계정 비밀번호 재설정",
    path: "/forgot-password",
  }),
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="section-padding bg-surface-50">
      <ForgotPasswordForm />
    </div>
  );
}
