import type { Metadata } from "next";
import { SignupForm } from "./SignupForm";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "회원가입",
    description: "SotongWare 무료 회원 가입 — 사업 포털과 회원 전용 콘텐츠를 이용하세요.",
    path: "/signup",
  }),
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="section-padding bg-surface-50">
      <SignupForm />
    </div>
  );
}
