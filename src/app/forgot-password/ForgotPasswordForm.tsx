"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";
import { useAuthLocale } from "@/hooks/useAuthLocale";
import { authLabels, getAuthErrorMessage } from "@/i18n/auth-labels";
import {
  AuthCard,
  FormAlert,
  FormField,
  SubmitButton,
} from "@/components/auth/AuthFormParts";

export function ForgotPasswordForm() {
  const { resetPassword, configured, emailPasswordAuthEnabled } = useAuth();
  const locale = useAuthLocale();
  const labels = authLabels[locale];
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "ko";
  }, [locale]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!emailPasswordAuthEnabled) {
      setError(labels.forgotDisabledDetail);
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(getAuthErrorMessage(err, locale));
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return (
      <AuthCard title={labels.forgotTitle} description={labels.firebaseNotConfigured}>
        <FormAlert message={labels.firebaseNotConfiguredDetail} variant="info" />
      </AuthCard>
    );
  }

  if (!emailPasswordAuthEnabled) {
    return (
      <AuthCard title={labels.forgotTitle} description={labels.forgotDisabledDetail}>
        <FormAlert message={labels.forgotDisabledDetail} variant="info" />
        <p className="mt-4 text-center text-sm">
          <Link
            href="/login"
            className="font-medium text-sky-700 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-sm"
          >
            {labels.backToLogin}
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={labels.forgotTitle}
      description={labels.forgotDescription}
      footer={
        <p className="text-center text-sm text-slate-600">
          <Link
            href="/login"
            className="font-medium text-sky-700 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-sm"
          >
            {labels.backToLogin}
          </Link>
        </p>
      }
    >
      {success ? (
        <FormAlert message={labels.resetSent} variant="success" />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && <FormAlert message={error} />}
          <FormField
            id="reset-email"
            label={labels.email}
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
            showPasswordLabel={labels.showPassword}
            hidePasswordLabel={labels.hidePassword}
          />
          <SubmitButton loading={loading} loadingLabel={labels.processing}>
            {labels.submitForgot}
          </SubmitButton>
        </form>
      )}
    </AuthCard>
  );
}
