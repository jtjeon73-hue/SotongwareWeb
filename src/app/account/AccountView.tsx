"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { FormAlert } from "@/components/auth/AuthFormParts";
import { Button } from "@/components/ui/Button";

function AccountContent() {
  const router = useRouter();
  const { user, profile, signOut, sendVerificationEmail } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  async function handleVerifyEmail() {
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await sendVerificationEmail();
      setMessage("인증 이메일을 발송했습니다. 받은편지함을 확인해 주세요.");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-padding bg-white">
      <div className="container-main max-w-2xl">
        <h1 className="text-2xl font-bold text-surface-900">계정 설정</h1>
        <p className="mt-2 text-sm text-surface-600">
          회원 정보와 이메일 인증 상태를 관리합니다.
        </p>

        <div className="mt-8 space-y-6">
          {message && <FormAlert message={message} variant="info" />}
          {error && <FormAlert message={error} />}

          <section className="rounded-xl border border-surface-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-500">
              기본 정보
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-surface-500">이름</dt>
                <dd className="font-medium text-surface-900">
                  {profile?.displayName || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-surface-500">이메일</dt>
                <dd className="font-medium text-surface-900">{user?.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-surface-500">이메일 인증</dt>
                <dd className="font-medium text-surface-900">
                  {user?.emailVerified ? (
                    <span className="text-emerald-700">인증 완료</span>
                  ) : (
                    <span className="text-amber-700">미인증</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-surface-500">회원 상태</dt>
                <dd className="font-medium text-surface-900">
                  {profile?.status === "active" ? "정상" : profile?.status}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-surface-500">가입일</dt>
                <dd className="font-medium text-surface-900">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("ko-KR")
                    : "—"}
                </dd>
              </div>
            </dl>
            {!user?.emailVerified && (
              <button
                type="button"
                onClick={handleVerifyEmail}
                disabled={loading}
                className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100 disabled:opacity-60"
              >
                {loading ? "발송 중…" : "인증 이메일 다시 보내기"}
              </button>
            )}
          </section>

          <section className="rounded-xl border border-surface-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-500">
              계정 관리
            </h2>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button href="/dashboard" variant="outline" className="min-h-11">
                대시보드로
              </Button>
              <Button href="/guide" variant="outline" className="min-h-11">
                이용 안내
              </Button>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-surface-300 px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50"
              >
                로그아웃
              </button>
            </div>
          </section>

          <p className="text-xs text-surface-500">
            유료·프리미엄 이용 권한은 결제 연동 후 자동으로 반영됩니다.{" "}
            <Link href="/privacy" className="text-brand-600 hover:text-brand-700">
              개인정보처리방침
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function AccountView() {
  return (
    <AuthGuard>
      <AccountContent />
    </AuthGuard>
  );
}
