import type { User } from "firebase/auth";
import type { UserProfile, MembershipUxGrade } from "@/types/membership";

/** Admin privilege for UI/gating display — custom claims only, never email string compare. */
export function isAdminFromClaims(claims: Record<string, unknown> | null | undefined): boolean {
  return Boolean(claims && claims.role === "admin");
}

/**
 * Customer-facing grade for Phase 2A.
 * Guest / Free / Admin. Basic is reserved and never activated here.
 * profile is accepted for API stability but privileges never trust client-writable fields.
 */
export function resolveMembershipUxGrade(
  user: User | null,
  claims: Record<string, unknown> | null | undefined,
  profile?: UserProfile | null,
): MembershipUxGrade {
  void profile;
  if (!user) return "guest";
  if (isAdminFromClaims(claims)) return "admin";
  return "free";
}

export function membershipGradeLabel(grade: MembershipUxGrade, locale: "ko" | "en" = "ko"): string {
  if (locale === "en") {
    if (grade === "guest") return "Guest";
    if (grade === "admin") return "Admin";
    return "Free";
  }
  if (grade === "guest") return "비회원";
  if (grade === "admin") return "관리자";
  return "무료 회원";
}
