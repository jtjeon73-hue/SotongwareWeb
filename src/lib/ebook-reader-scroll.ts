/** Pure helpers for Reader chapter scroll positioning (mobile sticky bar offset). */

export function isMobileReaderViewportWidth(widthPx: number): boolean {
  return widthPx <= 1023;
}

/**
 * Window scrollY so that `targetTop` (getBoundingClientRect().top) sits
 * just below a sticky chapter bar of height `barHeight`.
 */
export function computeMobileChapterScrollTop(
  scrollY: number,
  targetTop: number,
  barHeight: number,
  gapPx = 4,
): number {
  return Math.max(0, scrollY + targetTop - Math.max(0, barHeight) - gapPx);
}
