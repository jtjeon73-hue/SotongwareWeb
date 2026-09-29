import { getStorage } from "firebase-admin/storage";
import { ensureFirebaseAdminApp } from "../firebase-admin-app";
import type { StorageObjectReader } from "./storage-provider";

/**
 * Admin SDK Storage reader — used only inside Cloud Functions.
 * Never wire client SDK to private ebook objects.
 */
export class AdminSdkStorageObjectReader implements StorageObjectReader {
  constructor(private readonly bucketName?: string) {}

  async download(objectPath: string): Promise<Buffer | null> {
    ensureFirebaseAdminApp();
    const bucket = this.bucketName
      ? getStorage().bucket(this.bucketName)
      : getStorage().bucket();
    const file = bucket.file(objectPath);
    const [exists] = await file.exists();
    if (!exists) return null;
    const [buf] = await file.download();
    return buf;
  }
}
