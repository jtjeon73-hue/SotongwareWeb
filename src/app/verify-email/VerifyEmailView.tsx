"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthCard, FormAlert } from "@/components/auth/AuthFormParts";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { sanitizeRedirectPath } from "@/lib/safe-redirect";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirectPath(searchParams.get("redirect"));
  const { user, usingEmulator, sendVerificationEmail, refreshProfile } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await sendVerificationEmail();
      setMessage(
        usingEmulator
          ? "에뮬레이터: 재전송 요청이 기록되었습니다."
          : "인증 메일을 다시 보냈습니다. 잠시 후 받은편지함을 확인해 주세요.",
      );
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setError(null);
    setLoading(true);
    try {
      await refreshProfile();
      setMessage("인증 상태를 새로고침했습니다.");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (user?.emailVerified) {
    return (
      <AuthCard title="이메일 인증 완료" description="이메일 인증이 확인되었습니다.">
        <FormAlert message="이제 계정 화면에서 회원 정보를 확인할 수 있습니다." variant="success" />
        <div className="mt-4">
          <Link
            href={redirect || "/account"}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#0f2744] px-4 text-sm font-medium text-white"
          >
            계속하기
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="이메일 인증 안내"
      description="가입하신 이메일로 인증 링크를 보냈습니다. 인증을 완료하면 계정 상태가 업데이트됩니다."
      footer={
        <p className="text-center text-sm text-slate-600">
          <Link href="/account" className="font-medium text-sky-700 hover:text-sky-800">
            내 계정으로
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        {message && <FormAlert message={message} variant="info" />}
        {error && <FormAlert message={error} />}
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>미인증: 둘러보기·계정 확인 가능</li>
          <li>미인증만으로 관리자·유료 권한은 부여되지 않습니다</li>
          <li>재전송은 1분에 한 번만 가능합니다</li>
        </ul>
        <button
          type="button"
          onClick={() => void handleResend()}
          disabled={loading}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-60"
        >
          {loading ? "처리 중…" : "인증 메일 다시 보내기"}
        </button>
        <button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={loading}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#0f2744] px-4 text-sm font-medium text-white hover:bg-[#163556] disabled:opacity-60"
        >
          인증 완료 확인
        </button>
      </div>
    </AuthCard>
  );
}

function VerifyEmailGuarded() {
  return (
    <AuthGuard>
      <VerifyEmailInner />
    </AuthGuard>
  );
}

export function VerifyEmailView() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailGuarded />
    </Suspense>
  );
}
