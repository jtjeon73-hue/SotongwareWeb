"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { ensureUserProfile, fetchUserEntitlements } from "@/lib/user-profile";
import {
  assertAuthEnvironmentSafe,
  AUTH_POLICY_VERSION,
  isAuthEmulatorEnabled,
  isEmailSignupEnabled,
  isGoogleAuthUiEnabled,
} from "@/lib/auth-safety";
import { isAdminFromClaims, resolveMembershipUxGrade } from "@/lib/membership-grade";
import type { Entitlement, MembershipUxGrade, UserProfile } from "@/types/membership";

const VERIFY_COOLDOWN_MS = 60_000;
const VERIFY_STORAGE_KEY = "sw_verify_email_last_sent";

export interface SignUpOptions {
  email: string;
  password: string;
  locale?: "ko" | "en";
  consentAccepted: boolean;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  entitlements: Entitlement[];
  claims: Record<string, unknown> | null;
  loading: boolean;
  configured: boolean;
  usingEmulator: boolean;
  membershipGrade: MembershipUxGrade;
  isAdmin: boolean;
  emailSignupEnabled: boolean;
  googleAuthEnabled: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (options: SignUpOptions) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [claims, setClaims] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();
  const usingEmulator = isAuthEmulatorEnabled();
  const emailSignupEnabled = isEmailSignupEnabled();
  const googleAuthEnabled = isGoogleAuthUiEnabled();

  const loadUserData = useCallback(async (authUser: User) => {
    const token = await authUser.getIdTokenResult();
    setClaims(token.claims as Record<string, unknown>);
    const userProfile = await ensureUserProfile(authUser);
    const userEntitlements = await fetchUserEntitlements(authUser.uid);
    setProfile(userProfile);
    setEntitlements(userEntitlements);
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      if (authUser) {
        try {
          await loadUserData(authUser);
        } catch {
          setProfile(null);
          setEntitlements([]);
          setClaims(null);
        }
      } else {
        setProfile(null);
        setEntitlements([]);
        setClaims(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadUserData]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    assertAuthEnvironmentSafe();
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase가 설정되지 않았습니다.");
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUpWithEmail = useCallback(async (options: SignUpOptions) => {
    assertAuthEnvironmentSafe();
    if (!isEmailSignupEnabled()) {
      throw new Error("회원가입이 아직 활성화되지 않았습니다.");
    }
    if (!options.consentAccepted) {
      throw new Error("이용약관 및 개인정보처리방침에 동의해 주세요.");
    }
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase가 설정되지 않았습니다.");
    const credential = await createUserWithEmailAndPassword(auth, options.email, options.password);
    const consentAt = new Date().toISOString();
    try {
      await sendEmailVerification(credential.user);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(VERIFY_STORAGE_KEY, String(Date.now()));
      }
    } catch {
      // Emulator / unset email templates — profile still provisions
    }
    await ensureUserProfile(credential.user, {
      locale: options.locale ?? "ko",
      consentAt,
      policyVersion: AUTH_POLICY_VERSION,
    });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    assertAuthEnvironmentSafe();
    if (!isGoogleAuthUiEnabled()) {
      throw new Error("Google 로그인은 아직 활성화되지 않았습니다.");
    }
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase가 설정되지 않았습니다.");
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, []);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await firebaseSignOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    assertAuthEnvironmentSafe();
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase가 설정되지 않았습니다.");
    await sendPasswordResetEmail(auth, email);
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    assertAuthEnvironmentSafe();
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) throw new Error("로그인이 필요합니다.");
    if (typeof window !== "undefined") {
      const last = Number(window.sessionStorage.getItem(VERIFY_STORAGE_KEY) || "0");
      if (Date.now() - last < VERIFY_COOLDOWN_MS) {
        throw new Error("인증 메일은 1분에 한 번만 다시 보낼 수 있습니다.");
      }
    }
    await sendEmailVerification(auth.currentUser);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(VERIFY_STORAGE_KEY, String(Date.now()));
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) return;
    await auth.currentUser.reload();
    await loadUserData(auth.currentUser);
  }, [loadUserData]);

  const membershipGrade = resolveMembershipUxGrade(user, claims, profile);
  const isAdmin = isAdminFromClaims(claims);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      entitlements,
      claims,
      loading,
      configured,
      usingEmulator,
      membershipGrade,
      isAdmin,
      emailSignupEnabled,
      googleAuthEnabled,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      resetPassword,
      sendVerificationEmail,
      refreshProfile,
    }),
    [
      user,
      profile,
      entitlements,
      claims,
      loading,
      configured,
      usingEmulator,
      membershipGrade,
      isAdmin,
      emailSignupEnabled,
      googleAuthEnabled,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      resetPassword,
      sendVerificationEmail,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용해야 합니다.");
  }
  return context;
}
