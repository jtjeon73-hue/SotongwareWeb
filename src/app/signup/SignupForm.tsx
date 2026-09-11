"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useAuthLocale } from "@/hooks/useAuthLocale";
import { authLabels, getAuthErrorMessage } from "@/i18n/auth-labels";
import { sanitizeRedirectPath } from "@/lib/safe-redirect";
import { CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION } from "@/lib/auth-safety";
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
  const {
    signUpWithEmail,
    signInWithGoogle,
    user,
    configured,
    googleAuthEnabled,
    emailSignupEnabled,
  } = useAuth();
  const locale = useAuthLocale();
  const labels = authLabels[locale];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "ko";
  }, [locale]);

  useEffect(() => {
    if (user) {
      router.replace(`/verify-email?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [user, redirect, router]);

  if (user) {
    return null;
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = labels.invalidEmail;
    }
    if (password.length < 6) {
      next.password = labels.passwordHint;
    }
    if (password !== confirmPassword) {
      next.confirm = labels.passwordMismatch;
    }
    if (!consent) {
      next.consent = labels.consentRequired;
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await signUpWithEmail({
        email: email.trim(),
        password,
        locale,
        consentAccepted: consent,
      });
      router.replace(`/verify-email?redirect=${encodeURIComponent(redirect)}`);
    } catch (err) {
      setError(getAuthErrorMessage(err, locale));
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
      setError(getAuthErrorMessage(err, locale));
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return (
      <AuthCard title={labels.signupTitle} description={labels.firebaseNotConfigured}>
        <FormAlert message={labels.firebaseNotConfiguredDetail} variant="info" />
      </AuthCard>
    );
  }

  if (!emailSignupEnabled) {
    return (
      <AuthCard title={labels.signupTitle} description={labels.signupDisabled}>
        <FormAlert message={labels.signupDisabledDetail} variant="info" />
        <p className="mt-4 text-center text-sm">
          <Link href="/login" className="font-medium text-sky-700 hover:text-sky-800">
            {labels.backToLogin}
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={labels.signupTitle}
      description={labels.signupDescription}
      footer={
        <p className="text-center text-sm text-slate-600">
          {labels.hasAccount}{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="font-medium text-sky-700 hover:text-sky-800"
          >
            {labels.logIn}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <FormAlert message={error} />}
        <FormField
          id="signup-email"
          label={labels.email}
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="username"
          required
          error={fieldErrors.email}
        />
        <FormField
          id="signup-password"
          label={labels.password}
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
          hint={labels.passwordHint}
          error={fieldErrors.password}
        />
        <FormField
          id="signup-confirm"
          label={labels.confirmPassword}
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          required
          error={fieldErrors.confirm}
        />
        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-500"
            required
          />
          <span>
            {labels.consentLabel}{" "}
            <Link href="/privacy" className="font-medium text-sky-700 hover:underline">
              {labels.privacyLink}
            </Link>
            <span className="mt-1 block text-xs text-slate-500">
              약관 {CURRENT_TERMS_VERSION} · 개인정보 {CURRENT_PRIVACY_VERSION}
            </span>
          </span>
        </label>
        {fieldErrors.consent && (
          <p className="text-xs text-red-600" role="alert">
            {fieldErrors.consent}
          </p>
        )}
        <SubmitButton loading={loading} loadingLabel={labels.processing}>
          {labels.submitSignup}
        </SubmitButton>
      </form>
      {googleAuthEnabled && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">{labels.or}</span>
            </div>
          </div>
          <GoogleSignInButton onClick={handleGoogle} loading={loading} label={labels.googleContinue} />
        </>
      )}
      <p className="mt-4 text-xs leading-relaxed text-slate-500">{labels.signupTerms}</p>
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
