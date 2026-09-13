import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { AuthPageShell } from "@/components/auth/AuthFormParts";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "로그인",
    description: "SotongWare 회원 로그인 — 사업 포털과 회원 전용 콘텐츠를 이용하세요.",
    path: "/login",
  }),
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthPageShell>
      <LoginForm />
    </AuthPageShell>
  );
}
