"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useAuthLocale } from "@/hooks/useAuthLocale";
import { authLabels, getAuthErrorMessage } from "@/i18n/auth-labels";
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
  const locale = useAuthLocale();
  const labels = authLabels[locale];

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "ko";
  }, [locale]);

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
      setError(labels.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email.trim(), password, displayName.trim());
      router.replace(redirect);
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

  return (
    <AuthCard
      title={labels.signupTitle}
      description={labels.signupDescription}
      footer={
        <p className="text-center text-sm text-surface-600">
          {labels.hasAccount}{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            {labels.logIn}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <FormAlert message={error} />}
        <FormField
          id="signup-name"
          label={labels.displayName}
          value={displayName}
          onChange={setDisplayName}
          autoComplete="name"
          hint={labels.displayNameHint}
        />
        <FormField
          id="signup-email"
          label={labels.email}
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
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
        />
        <FormField
          id="signup-confirm"
          label={labels.confirmPassword}
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          required
        />
        <SubmitButton loading={loading} loadingLabel={labels.processing}>
          {labels.submitSignup}
        </SubmitButton>
      </form>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-surface-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-surface-500">{labels.or}</span>
        </div>
      </div>
      <GoogleSignInButton onClick={handleGoogle} loading={loading} label={labels.googleContinue} />
      <p className="mt-4 text-xs leading-relaxed text-surface-500">{labels.signupTerms}</p>
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
