import type { Locale } from "./config";

export const authLabels: Record<
  Locale,
  {
    logIn: string;
    signUp: string;
    signUpPreparing: string;
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
    redirectingToLogin: string;
    firebaseNotConfigured: string;
    firebaseNotConfiguredDetail: string;
    genericError: string;
    invalidEmail: string;
    consentLabel: string;
    consentRequired: string;
    privacyLink: string;
    policyVersionLabel: string;
    signupDisabled: string;
    signupDisabledDetail: string;
    authServicePreparing: string;
    authServicePreparingDetail: string;
    forgotDisabledDetail: string;
    showPassword: string;
    hidePassword: string;
  }
> = {
  ko: {
    logIn: "로그인",
    signUp: "회원가입",
    signUpPreparing: "회원가입 준비 중",
    myDashboard: "내 대시보드",
    member: "회원",
    loginTitle: "로그인",
    loginDescription: "SotongWare 회원 계정으로 안전하게 로그인하세요.",
    signupTitle: "회원가입",
    signupDescription: "이메일로 무료 회원(Free)에 가입합니다.",
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
    displayNameHint: "이번 단계에서는 수집하지 않습니다.",
    passwordHint: "6자 이상",
    submitLogin: "로그인",
    submitSignup: "무료 회원 가입",
    submitForgot: "재설정 링크 보내기",
    or: "또는",
    googleContinue: "Google로 계속하기",
    processing: "처리 중…",
    signupTerms: "회원 서비스가 준비되는 동안 일부 기능은 순차적으로 열립니다.",
    passwordMismatch: "비밀번호가 일치하지 않습니다.",
    resetSent: "비밀번호 재설정 이메일을 발송했습니다. 받은편지함을 확인해 주세요.",
    authLoading: "로그인 상태를 확인하는 중…",
    redirectingToLogin: "로그인 페이지로 이동하는 중…",
    firebaseNotConfigured: "인증 서비스를 준비하고 있습니다.",
    firebaseNotConfiguredDetail: "잠시 후 다시 시도해 주시거나 관리자에게 문의해 주세요.",
    genericError: "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    invalidEmail: "올바른 이메일 주소를 입력해 주세요.",
    consentLabel: "이용약관 및 개인정보처리방침에 동의합니다.",
    consentRequired: "동의 후 가입할 수 있습니다.",
    privacyLink: "개인정보처리방침",
    policyVersionLabel: "정책 버전",
    signupDisabled: "회원가입 준비 중",
    signupDisabledDetail:
      "회원가입 서비스를 준비하고 있습니다.\n서비스가 시작되면 이 화면에서 가입하실 수 있습니다.",
    authServicePreparing: "회원 로그인 준비 중",
    authServicePreparingDetail:
      "로그인 서비스를 준비하고 있습니다. 서비스가 시작되면 이메일로 로그인할 수 있습니다.",
    forgotDisabledDetail: "비밀번호 재설정 서비스를 준비하고 있습니다.",
    showPassword: "표시",
    hidePassword: "숨기기",
  },
  en: {
    logIn: "Log In",
    signUp: "Sign Up",
    signUpPreparing: "Sign-up coming soon",
    myDashboard: "My dashboard",
    member: "Member",
    loginTitle: "Log in",
    loginDescription: "Sign in securely to your SotongWare account.",
    signupTitle: "Create account",
    signupDescription: "Create a Free account with email.",
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
    displayNameHint: "Not collected in this phase.",
    passwordHint: "At least 6 characters",
    submitLogin: "Log in",
    submitSignup: "Create free account",
    submitForgot: "Send reset link",
    or: "or",
    googleContinue: "Continue with Google",
    processing: "Processing…",
    signupTerms: "Some member features will open gradually as the service becomes ready.",
    passwordMismatch: "Passwords do not match.",
    resetSent: "Password reset email sent. Please check your inbox.",
    authLoading: "Checking sign-in status…",
    redirectingToLogin: "Taking you to log in…",
    firebaseNotConfigured: "Authentication is being prepared",
    firebaseNotConfiguredDetail: "Please try again shortly or contact the administrator.",
    genericError: "We couldn't complete your request. Please try again shortly.",
    invalidEmail: "Please enter a valid email address.",
    consentLabel: "I agree to the terms of use and privacy policy.",
    consentRequired: "Consent is required to sign up.",
    privacyLink: "Privacy policy",
    policyVersionLabel: "Policy version",
    signupDisabled: "Sign-up coming soon",
    signupDisabledDetail:
      "We're preparing member sign-up.\nYou'll be able to create an account here when the service opens.",
    authServicePreparing: "Sign-in coming soon",
    authServicePreparingDetail:
      "We're preparing member sign-in. You'll be able to log in with email when the service opens.",
    forgotDisabledDetail: "Password reset is being prepared.",
    showPassword: "Show",
    hidePassword: "Hide",
  },
};

const AUTH_CODE_MESSAGES: Record<Locale, Record<string, string>> = {
  ko: {
    "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
    "auth/invalid-email": "올바른 이메일 주소를 입력해 주세요.",
    "auth/operation-not-allowed":
      "로그인 서비스를 준비하고 있습니다. 서비스가 시작되면 이용해 주세요.",
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
    "sw/signup-disabled":
      "회원가입 서비스를 준비하고 있습니다. 서비스가 시작되면 이 화면에서 가입하실 수 있습니다.",
    "sw/email-auth-disabled":
      "로그인 서비스를 준비하고 있습니다. 서비스가 시작되면 이용해 주세요.",
    "sw/reset-disabled": "비밀번호 재설정 서비스를 준비하고 있습니다.",
    "sw/google-disabled": "Google 로그인은 아직 준비 중입니다.",
    "sw/auth-env-unsafe": "인증 환경을 확인하고 있습니다. 잠시 후 다시 시도해 주세요.",
    "sw/not-configured": "인증 서비스를 준비하고 있습니다.",
    "sw/consent-required": "이용약관 및 개인정보처리방침에 동의해 주세요.",
    "sw/login-required": "로그인이 필요합니다.",
    "sw/verify-cooldown": "인증 메일은 1분에 한 번만 다시 보낼 수 있습니다.",
  },
  en: {
    "auth/email-already-in-use": "This email is already in use.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/operation-not-allowed":
      "Sign-in is being prepared. Please try again when the service opens.",
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
    "sw/signup-disabled":
      "We're preparing member sign-up. You'll be able to create an account here when the service opens.",
    "sw/email-auth-disabled":
      "Sign-in is being prepared. Please try again when the service opens.",
    "sw/reset-disabled": "Password reset is being prepared.",
    "sw/google-disabled": "Google sign-in is not available yet.",
    "sw/auth-env-unsafe": "We're checking the sign-in environment. Please try again shortly.",
    "sw/not-configured": "Authentication is being prepared.",
    "sw/consent-required": "Please agree to the terms and privacy policy.",
    "sw/login-required": "Please sign in.",
    "sw/verify-cooldown": "You can resend the verification email once per minute.",
  },
};

/** Never expose Firebase codes, stack traces, or env/dev instructions to customers. */
export function getAuthErrorMessage(error: unknown, locale: Locale): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code: string }).code);
    const msg = AUTH_CODE_MESSAGES[locale][code];
    if (msg) return msg;
  }
  return authLabels[locale].genericError;
}
