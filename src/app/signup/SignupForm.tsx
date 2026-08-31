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

function SignupFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirectPath(searchParams.get("redirect"));
  const { signUpWithEmail, signInWithGoogle, user, configured } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email.trim(), password, displayName.trim());
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
      <AuthCard title="회원가입" description="Firebase 설정이 필요합니다.">
        <FormAlert
          message="인증 서비스가 아직 설정되지 않았습니다. 관리자에게 문의해 주세요."
          variant="info"
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="회원가입"
      description="무료 회원으로 SotongWare 사업 포털과 회원 전용 콘텐츠를 이용할 수 있습니다."
      footer={
        <p className="text-center text-sm text-surface-600">
          이미 계정이 있으신가요?{" "}
          <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="font-medium text-brand-600 hover:text-brand-700">
            로그인
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <FormAlert message={error} />}
        <FormField
          id="signup-name"
          label="이름 (표시명)"
          value={displayName}
          onChange={setDisplayName}
          autoComplete="name"
          hint="대시보드에 표시됩니다."
        />
        <FormField
          id="signup-email"
          label="이메일"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <FormField
          id="signup-password"
          label="비밀번호"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
          hint="6자 이상"
        />
        <FormField
          id="signup-confirm"
          label="비밀번호 확인"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          required
        />
        <SubmitButton loading={loading}>무료 회원 가입</SubmitButton>
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
      <p className="mt-4 text-xs leading-relaxed text-surface-500">
        가입 시 SotongWare 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.
        유료 결제는 별도 안내 후 진행됩니다.
      </p>
    </AuthCard>
  );
}

export function SignupForm() {
  return (
    <Suspense fallback={null}>
      <SignupFormInner />
    </Suspense>
  );
}
