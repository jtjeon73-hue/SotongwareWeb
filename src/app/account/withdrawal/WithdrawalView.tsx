"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthEmulatorBanner, FormAlert } from "@/components/auth/AuthFormParts";

function WithdrawalContent() {
  return (
    <div className="section-padding bg-gradient-to-b from-slate-50 to-white">
      <div className="container-main max-w-2xl">
        <AuthEmulatorBanner />
        <h1 className="text-2xl font-bold text-slate-900">계정 탈퇴 안내</h1>
        <p className="mt-2 text-sm text-slate-600">
          Auth Phase 2A에서는 탈퇴를 설계·문서화만 합니다. 아래 버튼은 운영 데이터를 삭제하지 않습니다.
        </p>

        <FormAlert
          message="실제 탈퇴 실행은 별도 검증 단계입니다. 재인증·Auth 삭제·법적 보존·주문/결제/감사 로그 보존·복구 불가가 준비되기 전에는 활성화되지 않습니다."
          variant="info"
        />

        <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm text-slate-700">
          <li>최근 로그인(재인증) 확인</li>
          <li>Firebase Auth 계정 삭제</li>
          <li>개인정보 삭제 또는 법적 보존 처리</li>
          <li>주문·결제·감사 로그 보존</li>
          <li>탈퇴 취소 불가 안내</li>
          <li>실패 시 복구 절차</li>
        </ol>

        <button
          type="button"
          disabled
          className="mt-8 inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-slate-100 px-4 text-sm font-medium text-slate-500"
          title="Phase 2A에서 비활성"
        >
          계정 탈퇴 실행 (비활성)
        </button>

        <p className="mt-4 text-sm">
          <Link href="/account" className="font-medium text-sky-700 hover:text-sky-800">
            ← 내 계정으로
          </Link>
        </p>
      </div>
    </div>
  );
}

export function WithdrawalView() {
  return (
    <AuthGuard>
      <WithdrawalContent />
    </AuthGuard>
  );
}
