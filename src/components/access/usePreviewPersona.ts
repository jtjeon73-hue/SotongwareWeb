"use client";

import { useSearchParams } from "next/navigation";
import type { PreviewPersona } from "@/types/access-tier";
import {
  isPreviewPersonaEnabled,
  parsePreviewPersona,
} from "@/lib/access-tier";

/** Production builds always resolve guest — URL ?previewAccess= cannot elevate client UX. */
export function usePreviewPersona(): PreviewPersona {
  const searchParams = useSearchParams();
  if (!isPreviewPersonaEnabled()) return "guest";
  return parsePreviewPersona(searchParams.get("previewAccess"));
}
