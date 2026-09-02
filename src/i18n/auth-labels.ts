import type { Locale } from "./config";

export const authLabels: Record<
  Locale,
  {
    logIn: string;
    signUp: string;
    myDashboard: string;
    member: string;
    loginTitle: string;
    loginDescription: string;
    signupTitle: string;
    signupDescription: string;
    forgotTitle: string;
    forgotDescription: string;
    noAccount: string;
    hasAccount: string;
    forgotPassword: string;
    backToLogin: string;
    email: string;
    password: string;
    confirmPassword: string;
    displayName: string;
    displayNameHint: string;
    passwordHint: string;
    submitLogin: string;
    submitSignup: string;
    submitForgot: string;
    or: string;
    googleContinue: string;
    processing: string;
    signupTerms: string;
    passwordMismatch: string;
    resetSent: string;
    authLoading: string;
    firebaseNotConfigured: string;
    firebaseNotConfiguredDetail: string;
    genericError: string;
  }
> = {
  ko: {
    logIn: "로그인",
    signUp: "회원가입",
    myDashboard: "내 대시보드",
    member: "회원",
    loginTitle: "로그인",
    loginDescription: "SotongWare 회원 계정으로 로그인하고 사업 포털을 이용하세요.",
    signupTitle: "회원가입",
    signupDescription: "무료 회원으로 SotongWare 사업 포털과 회원 전용 콘텐츠를 이용할 수 있습니다.",
    forgotTitle: "비밀번호 재설정",
    forgotDescription: "가입한 이메일 주소로 비밀번호 재설정 링크를 보내드립니다.",
    noAccount: "계정이 없으신가요?",
    hasAccount: "이미 계정이 있으신가요?",
    forgotPassword: "비밀번호를 잊으셨나요?",
    backToLogin: "로그인으로 돌아가기",
    email: "이메일",
    password: "비밀번호",
    confirmPassword: "비밀번호 확인",
    displayName: "이름 (표시명)",
    displayNameHint: "대시보드에 표시됩니다.",
    passwordHint: "6자 이상",
    submitLogin: "로그인",
    submitSignup: "무료 회원 가입",
    submitForgot: "재설정 링크 보내기",
    or: "또는",
    googleContinue: "Google로 계속하기",
    processing: "처리 중…",
    signupTerms:
      "가입 시 SotongWare 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다. 유료 결제는 별도 안내 후 진행됩니다.",
    passwordMismatch: "비밀번호가 일치하지 않습니다.",
    resetSent: "비밀번호 재설정 이메일을 발송했습니다. 받은편지함을 확인해 주세요.",
    authLoading: "로그인 상태를 확인하는 중…",
    firebaseNotConfigured: "Firebase 설정이 필요합니다.",
    firebaseNotConfiguredDetail: "인증 서비스가 아직 설정되지 않았습니다. 관리자에게 문의해 주세요.",
    genericError: "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  },
  en: {
    logIn: "Log In",
    signUp: "Sign Up",
    myDashboard: "My dashboard",
    member: "Member",
    loginTitle: "Log in",
    loginDescription: "Sign in to your SotongWare account and access the business portal.",
    signupTitle: "Create account",
    signupDescription: "Join free to access the SotongWare portal and member content.",
    forgotTitle: "Reset password",
    forgotDescription: "We'll send a password reset link to your registered email.",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    forgotPassword: "Forgot your password?",
    backToLogin: "Back to log in",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    displayName: "Display name",
    displayNameHint: "Shown on your dashboard.",
    passwordHint: "At least 6 characters",
    submitLogin: "Log in",
    submitSignup: "Create free account",
    submitForgot: "Send reset link",
    or: "or",
    googleContinue: "Continue with Google",
    processing: "Processing…",
    signupTerms:
      "By signing up you agree to SotongWare's terms of use and privacy policy. Paid checkout is introduced separately.",
    passwordMismatch: "Passwords do not match.",
    resetSent: "Password reset email sent. Please check your inbox.",
    authLoading: "Checking sign-in status…",
    firebaseNotConfigured: "Firebase setup required",
    firebaseNotConfiguredDetail: "Authentication is not configured yet. Please contact the administrator.",
    genericError: "We couldn't complete your request. Please try again shortly.",
  },
};

const FIREBASE_AUTH_MESSAGES: Record<Locale, Record<string, string>> = {
  ko: {
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
  },
  en: {
    "auth/email-already-in-use": "This email is already in use.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/operation-not-allowed": "This sign-in method is not enabled yet.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/user-disabled": "This account is disabled. Please contact support.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/popup-closed-by-user": "Sign-in window was closed. Please try again.",
    "auth/popup-blocked": "Popup was blocked. Check your browser settings.",
    "auth/network-request-failed": "Network error. Please check your connection.",
    "auth/requires-recent-login": "For security, please sign in again and retry.",
    "auth/missing-email": "Please enter your email.",
  },
};

export function getAuthErrorMessage(error: unknown, locale: Locale): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code: string }).code);
    const msg = FIREBASE_AUTH_MESSAGES[locale][code];
    if (msg) return msg;
  }
  if (error instanceof Error && error.message && locale === "ko") {
    return error.message;
  }
  return authLabels[locale].genericError;
}
