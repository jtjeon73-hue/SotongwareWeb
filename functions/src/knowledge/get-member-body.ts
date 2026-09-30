import type { AuthContext, ProductEntitlementLookup } from "../ebook/types";
import { authorizeKnowledgeMemberAccess } from "./authorize-knowledge-member";
import {
  getKnowledgeMemberRailBody,
  type KnowledgeMemberRailBody,
} from "./member-rail-content";

export class KnowledgeMemberAccessError extends Error {
  constructor(
    readonly code:
      | "unauthenticated"
      | "permission-denied"
      | "invalid-argument"
      | "not-found"
      | "failed-precondition"
      | "internal",
    message: string,
  ) {
    super(message);
    this.name = "KnowledgeMemberAccessError";
  }
}

/** Memory-friendly body lookup (tests inject a Map-backed lookup). */
export type KnowledgeMemberBodyLookup = (guideId: string) => KnowledgeMemberRailBody | null;

export type KnowledgeMemberBodyResponse = {
  guideId: string;
  title: KnowledgeMemberRailBody["title"];
  summary: KnowledgeMemberRailBody["summary"];
  accessTier: "member";
  sections: KnowledgeMemberRailBody["sections"];
};

function asNonEmptyString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

/**
 * Core handler — authorization separated from body storage.
 * Client flags (isAdmin, userTier, previewAccess, email, uid, accessLevel) are ignored.
 */
export async function handleGetKnowledgeMemberBody(input: {
  auth: AuthContext | null;
  data: Record<string, unknown>;
  entitlements: ProductEntitlementLookup;
  lookupBody?: KnowledgeMemberBodyLookup;
  now?: Date;
}): Promise<KnowledgeMemberBodyResponse> {
  const guideId = asNonEmptyString(input.data.guideId, 80);
  if (!guideId) {
    throw new KnowledgeMemberAccessError("invalid-argument", "guideId가 필요합니다.");
  }

  // Explicitly discard client-forged privilege fields (must not affect authz).
  void input.data.isAdmin;
  void input.data.userTier;
  void input.data.previewAccess;
  void input.data.email;
  void input.data.uid;
  void input.data.userId;
  void input.data.accessLevel;
  void input.data.role;
  void input.data.membership;

  if (!input.auth?.uid) {
    throw new KnowledgeMemberAccessError("unauthenticated", "로그인이 필요합니다.");
  }

  const rows = await input.entitlements.listProductEntitlements(input.auth.uid);
  const authz = authorizeKnowledgeMemberAccess({
    auth: input.auth,
    entitlements: rows,
    now: input.now,
  });
  if (!authz.ok) {
    throw new KnowledgeMemberAccessError("permission-denied", "이 콘텐츠에 접근할 권한이 없습니다.");
  }

  const lookup = input.lookupBody ?? getKnowledgeMemberRailBody;
  const body = lookup(guideId);
  if (!body) {
    throw new KnowledgeMemberAccessError("not-found", "학습 가이드를 찾을 수 없습니다.");
  }

  return {
    guideId: body.guideId,
    title: body.title,
    summary: body.summary,
    accessTier: "member",
    sections: body.sections,
  };
}
