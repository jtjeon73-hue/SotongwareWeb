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
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { ensureUserProfile, fetchUserEntitlements } from "@/lib/user-profile";
import type { Entitlement, UserProfile } from "@/types/membership";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  entitlements: Entitlement[];
  loading: boolean;
  configured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  const loadUserData = useCallback(async (authUser: User) => {
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
        }
      } else {
        setProfile(null);
        setEntitlements([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadUserData]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase가 설정되지 않았습니다.");
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName: string) => {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Firebase가 설정되지 않았습니다.");
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName.trim()) {
        await updateProfile(credential.user, { displayName: displayName.trim() });
      }
      await sendEmailVerification(credential.user);
      await ensureUserProfile(credential.user, displayName.trim());
    },
    [],
  );

  const signInWithGoogle = useCallback(async () => {
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
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase가 설정되지 않았습니다.");
    await sendPasswordResetEmail(auth, email);
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) throw new Error("로그인이 필요합니다.");
    await sendEmailVerification(auth.currentUser);
  }, []);

  const refreshProfile = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) return;
    await loadUserData(auth.currentUser);
  }, [loadUserData]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      entitlements,
      loading,
      configured,
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
      loading,
      configured,
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
