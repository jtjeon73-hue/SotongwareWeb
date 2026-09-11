import type { Metadata } from "next";
import { SignupForm } from "./SignupForm";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "회원가입",
    description: "SotongWare 무료 회원(Free) 가입 — 이메일을 최소 수집합니다.",
    path: "/signup",
  }),
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="section-padding bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      <SignupForm />
    </div>
  );
}
