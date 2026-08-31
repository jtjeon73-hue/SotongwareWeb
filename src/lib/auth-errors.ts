const FIREBASE_AUTH_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
  "auth/invalid-email": "올바른 이메일 주소를 입력해 주세요.",
  "auth/operation-not-allowed": "이 로그인 방식은 아직 활성화되지 않았습니다.",
  "auth/weak-password": "비밀번호는 6자 이상이어야 합니다.",
  "auth/user-disabled": "비활성화된 계정입니다. 관리자에게 문의해 주세요.",
  "auth/user-not-found": "등록되지 않은 이메일입니다.",
  "auth/wrong-password": "비밀번호가 올바르지 않습니다.",
  "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "auth/too-many-requests": "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
  "auth/popup-closed-by-user": "로그인 창이 닫혔습니다. 다시 시도해 주세요.",
  "auth/popup-blocked": "팝업이 차단되었습니다. 브라우저 설정을 확인해 주세요.",
  "auth/network-request-failed": "네트워크 오류가 발생했습니다. 연결을 확인해 주세요.",
  "auth/requires-recent-login": "보안을 위해 다시 로그인한 뒤 시도해 주세요.",
  "auth/missing-email": "이메일을 입력해 주세요.",
};

export function getAuthErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code: string }).code);
    if (FIREBASE_AUTH_MESSAGES[code]) {
      return FIREBASE_AUTH_MESSAGES[code];
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}
