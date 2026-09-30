/**
 * Mobile library card display only.
 * Derives a short label from the existing localized priceNote string.
 * Does not invent prices or change catalog/policy data.
 *
 * Splits on middle-dot separators and keeps the first N segments.
 */
export function compactPriceNoteForCard(priceNote: string, maxSegments = 2): string {
  const trimmed = priceNote.trim();
  if (!trimmed) return trimmed;
  const parts = trimmed
    .split(/\s*\u00b7\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length <= maxSegments) return trimmed;
  return parts.slice(0, maxSegments).join(" \u00b7 ");
}
