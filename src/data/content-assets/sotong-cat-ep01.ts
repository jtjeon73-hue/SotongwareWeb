/**
 * Sotong Cat Ep.1 — public asset import contract.
 * Place approved WebP files under public/contents/sotong-cat/ep01/
 * Do not invent placeholder bitmaps; missing files keep the episode preparing.
 */

export const SOTONG_CAT_EP01_SLUG = "sotong-cat-alarm-war-ep1";
export const SOTONG_CAT_SERIES_ID = "sotong-cat";
export const SOTONG_CAT_EP01_DIR = "contents/sotong-cat/ep01";
export const SOTONG_CAT_EP01_PUBLIC_BASE = `/${SOTONG_CAT_EP01_DIR}`;

/** Relative to `public/` */
export const SOTONG_CAT_EP01_REQUIRED_FILES = [
  "contents/sotong-cat/ep01/poster.webp",
  "contents/sotong-cat/ep01/thumbnail.webp",
  "contents/sotong-cat/ep01/panel-01.webp",
  "contents/sotong-cat/ep01/panel-02.webp",
  "contents/sotong-cat/ep01/panel-03.webp",
  "contents/sotong-cat/ep01/panel-04.webp",
  "contents/sotong-cat/ep01/panel-05.webp",
  "contents/sotong-cat/ep01/panel-06.webp",
  "contents/sotong-cat/ep01/panel-07.webp",
  "contents/sotong-cat/ep01/panel-08.webp",
] as const;

export const SOTONG_CAT_EP01_OPTIONAL_FILES = [
  "contents/sotong-cat/ep01/captions-ko.json",
] as const;

export function sotongCatEp01PanelPublicPath(panelIndex1Based: number): string {
  const n = String(panelIndex1Based).padStart(2, "0");
  return `${SOTONG_CAT_EP01_PUBLIC_BASE}/panel-${n}.webp`;
}

export function sotongCatEp01PosterPublicPath(): string {
  return `${SOTONG_CAT_EP01_PUBLIC_BASE}/poster.webp`;
}

export function sotongCatEp01ThumbnailPublicPath(): string {
  return `${SOTONG_CAT_EP01_PUBLIC_BASE}/thumbnail.webp`;
}
