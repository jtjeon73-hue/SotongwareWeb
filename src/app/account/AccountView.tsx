"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { AuthEmulatorBanner, FormAlert } from "@/components/auth/AuthFormParts";
import { membershipGradeLabel } from "@/lib/membership-grade";
import { Button } from "@/components/ui/Button";

function AccountContent() {
  const router = useRouter();
  const {
    user,
    profile,
    membershipGrade,
    isAdmin,
    usingEmulator,
    signOut,
    sendVerificationEmail,
    refreshProfile,
  } = useAuth();
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
      setMessage(
        usingEmulator
          ? "에뮬레이터 모드: 인증 메일 요청을 기록했습니다. 실제 이메일은 발송되지 않을 수 있습니다."
          : "인증 이메일을 발송했습니다. 받은편지함을 확인해 주세요.",
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
      setMessage("계정 상태를 새로고침했습니다.");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-padding bg-gradient-to-b from-slate-50 to-white">
      <div className="container-main max-w-2xl">
        <AuthEmulatorBanner />
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">내 계정</h1>
        <p className="mt-2 text-sm text-slate-600">이메일 인증과 회원 등급을 확인합니다.</p>

        <div className="mt-8 space-y-6">
          {message && <FormAlert message={message} variant="info" />}
          {error && <FormAlert message={error} />}

          <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">회원 정보</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">이메일</dt>
                <dd className="font-medium text-slate-900">{user?.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">회원 등급</dt>
                <dd className="font-medium text-slate-900">
                  {membershipGradeLabel(membershipGrade)}
                  {isAdmin ? " (claims)" : ""}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">이메일 인증</dt>
                <dd className="font-medium text-slate-900">
                  {user?.emailVerified ? (
                    <span className="text-emerald-700">인증 완료</span>
                  ) : (
                    <span className="text-amber-700">미인증</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">동의 정책</dt>
                <dd className="font-medium text-slate-900">{profile?.policyVersion || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">화면 언어</dt>
                <dd className="font-medium text-slate-900">{profile?.locale === "en" ? "English" : "한국어"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">가입일</dt>
                <dd className="font-medium text-slate-900">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("ko-KR") : "—"}
                </dd>
              </div>
            </dl>

            {!user?.emailVerified && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                <p>이메일 미인증 상태입니다. 둘러보기·계정 확인은 가능하지만, 일부 보호 기능은 제한될 수 있습니다.</p>
                <p className="mt-1 text-xs">이메일 인증만으로 관리자·유료 권한이 부여되지 않습니다.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    disabled={loading}
                    className="inline-flex min-h-11 items-center rounded-lg border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-800 hover:bg-sky-100 disabled:opacity-60"
                  >
                    {loading ? "처리 중…" : "인증 메일 다시 보내기"}
                  </button>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    인증 상태 새로고침
                  </button>
                  <Link
                    href="/verify-email"
                    className="inline-flex min-h-11 items-center text-sm font-medium text-sky-700 hover:text-sky-800"
                  >
                    인증 안내 →
                  </Link>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">계정 관리</h2>
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
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                로그아웃
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5">
            <h2 className="text-sm font-semibold text-slate-800">계정 탈퇴</h2>
            <p className="mt-2 text-sm text-slate-600">
              탈퇴는 재인증·데이터 보존·복구 불가 안내가 필요합니다. 이번 단계에서는 실제 삭제를 실행하지 않습니다.
            </p>
            <Link
              href="/account/withdrawal"
              className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-slate-700 underline-offset-2 hover:underline"
            >
              탈퇴 안내 보기 (실행 없음)
            </Link>
          </section>

          <p className="text-xs text-slate-500">
            Basic 구독·결제 권한은 아직 활성화되지 않았습니다.{" "}
            <Link href="/privacy" className="text-sky-700 hover:text-sky-800">
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
