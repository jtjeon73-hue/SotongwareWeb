export { getEbookChapterBody, getEbookDownloadUrl } from "./handlers";
export {
  authorizeEbookChapterAccess,
  authorizeEbookDownloadAccess,
  isAdminFromToken,
  hasActiveProductEntitlement,
  hasActiveMembershipEntitlement,
  hasActiveOwnedEbookEntitlement,
  DEFAULT_GOLDEN_EBOOK_PRODUCT_ID,
} from "./authorize";
export { handleGetEbookChapterBody, EbookChapterAccessError } from "./get-chapter-body";
export {
  handleGetEbookDownloadUrl,
  MemorySignedUrlProvider,
  createGatedGcsSignedUrlProvider,
  createProductionFirebaseSignedUrlProvider,
  createAdminSdkStorageFileAccessor,
  clampDownloadTtlSeconds,
  assertCanonicalPrivateBinaryPath,
  DOWNLOAD_URL_TTL_SECONDS,
  PRIVATE_BINARY_OBJECT_PATH_RE,
  assertEbookDownloadAsset,
} from "./download-delivery";
export {
  LocalPrivateArtifactProvider,
  MemoryEbookContentProvider,
  FUTURE_PRIVATE_STORAGE_LAYOUT,
} from "./content-provider";
export {
  FirestoreProductEntitlementLookup,
  MemoryProductEntitlementLookup,
} from "./firestore-entitlements";
export {
  canonicalEbookChapterObjectPath,
  canonicalEbookBinaryObjectPath,
  EbookStoragePathError,
  PRIVATE_EBOOK_STORAGE_LAYOUT,
} from "./storage-path";
export {
  FirebaseStorageEbookContentProvider,
  MemoryStorageObjectReader,
} from "./storage-provider";
export { createEbookContentProvider, resolveEbookContentProviderMode } from "./provider-factory";
