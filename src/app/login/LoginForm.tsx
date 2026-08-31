"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { sanitizeRedirectPath } from "@/lib/safe-redirect";
import {
  AuthCard,
  FormAlert,
  FormField,
  GoogleSignInButton,
  SubmitButton,
} from "@/components/auth/AuthFormParts";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirectPath(searchParams.get("redirect"));
  const { signInWithEmail, signInWithGoogle, user, configured } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace(redirect);
    }
  }, [user, redirect, router]);

  if (user) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      router.replace(redirect);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace(redirect);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return (
      <AuthCard title="로그인" description="Firebase 설정이 필요합니다.">
        <FormAlert
          message="인증 서비스가 아직 설정되지 않았습니다. 관리자에게 문의해 주세요."
          variant="info"
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="로그인"
      description="SotongWare 회원 계정으로 로그인하고 사업 포털을 이용하세요."
      footer={
        <p className="text-center text-sm text-surface-600">
          계정이 없으신가요?{" "}
          <Link href={`/signup?redirect=${encodeURIComponent(redirect)}`} className="font-medium text-brand-600 hover:text-brand-700">
            회원가입
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <FormAlert message={error} />}
        <FormField
          id="login-email"
          label="이메일"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <FormField
          id="login-password"
          label="비밀번호"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>
        <SubmitButton loading={loading}>로그인</SubmitButton>
      </form>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-surface-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-surface-500">또는</span>
        </div>
      </div>
      <GoogleSignInButton onClick={handleGoogle} loading={loading} />
    </AuthCard>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  );
}
