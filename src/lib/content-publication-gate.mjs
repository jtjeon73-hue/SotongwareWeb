/**
 * Content live publication gate (Node + browser-safe).
 * Secret/private Storage URLs must never appear in public catalog fields.
 */

export function contentMediaExists(media) {
  if (!media || media.source === "none") return false;
  if (media.source === "public_asset") return Boolean(media.publicSrc?.trim());
  if (media.source === "external_embed") return Boolean(media.publicSrc?.trim());
  if (media.source === "protected_ref") return Boolean(media.assetRef?.trim());
  return false;
}

export function validateContentLiveGate(item) {
  const errors = [];

  if (!item || item.status !== "live") {
    return { ok: true, errors: [] };
  }

  if (!contentMediaExists(item.media)) {
    errors.push("live requires existing media (source !== none with src/ref)");
  }
  if (item.publication?.rightsStatus !== "cleared") {
    errors.push("live requires rightsStatus === cleared");
  }
  if (!item.publication?.reviewed) {
    errors.push("live requires reviewed === true");
  }
  if (!item.publication?.approvedForPublic) {
    errors.push("live requires approvedForPublic === true");
  }
  if (!item.title?.ko?.trim() || !item.title?.en?.trim()) {
    errors.push("live requires title ko+en");
  }
  if (!item.summary?.ko?.trim() || !item.summary?.en?.trim()) {
    errors.push("live requires summary ko+en");
  }
  if (!item.formatId) {
    errors.push("live requires formatId");
  }
  if (!item.accessTier) {
    errors.push("live requires accessTier");
  }

  const needsPoster =
    item.media?.kind === "shortVideo" ||
    item.media?.kind === "video" ||
    item.media?.kind === "image" ||
    item.media?.kind === "comic";
  if (needsPoster && item.media?.source !== "none" && !item.media?.poster?.trim()) {
    errors.push("live media of this kind requires poster/thumbnail");
  }

  const badUrl = /storage\.googleapis\.com|firebasestorage\.googleapis|X-Goog-Signature|token=/i;
  if (item.media?.publicSrc && badUrl.test(item.media.publicSrc)) {
    errors.push("public catalog must not embed private/signed Storage URLs");
  }
  if (item.media?.poster && badUrl.test(item.media.poster)) {
    errors.push("poster must not be a private/signed Storage URL");
  }

  return { ok: errors.length === 0, errors };
}

export function isCustomerLiveContent(item) {
  return item?.status === "live" && validateContentLiveGate(item).ok;
}

export function assertCatalogLiveGates(items) {
  const errors = [];
  for (const item of items ?? []) {
    const r = validateContentLiveGate(item);
    if (!r.ok) {
      errors.push(...r.errors.map((e) => `${item.slug}: ${e}`));
    }
  }
  return { ok: errors.length === 0, errors };
}

export function resolveContentRenderer(item) {
  if (!isCustomerLiveContent(item) || !contentMediaExists(item.media)) {
    return "preparing";
  }
  return item.media.kind;
}

export function formatIdToUiCategory(formatId) {
  if (formatId === "comicVideo" || formatId === "video") return "video";
  if (formatId === "other") return null;
  if (
    formatId === "shorts" ||
    formatId === "music" ||
    formatId === "comic" ||
    formatId === "image" ||
    formatId === "game"
  ) {
    return formatId;
  }
  return null;
}
