"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import {
  AuthCard,
  FormAlert,
  FormField,
  SubmitButton,
} from "@/components/auth/AuthFormParts";

export function ForgotPasswordForm() {
  const { resetPassword, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return (
      <AuthCard title="비밀번호 재설정" description="Firebase 설정이 필요합니다.">
        <FormAlert
          message="인증 서비스가 아직 설정되지 않았습니다."
          variant="info"
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="비밀번호 재설정"
      description="가입한 이메일 주소로 비밀번호 재설정 링크를 보내드립니다."
      footer={
        <p className="text-center text-sm text-surface-600">
          <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
            로그인으로 돌아가기
          </Link>
        </p>
      }
    >
      {success ? (
        <FormAlert
          message="비밀번호 재설정 이메일을 발송했습니다. 받은편지함을 확인해 주세요."
          variant="info"
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && <FormAlert message={error} />}
          <FormField
            id="reset-email"
            label="이메일"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          <SubmitButton loading={loading}>재설정 링크 보내기</SubmitButton>
        </form>
      )}
    </AuthCard>
  );
}
