import { join } from "node:path";
import { LocalPrivateArtifactProvider } from "./content-provider";
import { AdminSdkStorageObjectReader } from "./admin-storage-reader";
import { FirebaseStorageEbookContentProvider } from "./storage-provider";
import type { EbookContentProvider } from "./types";
import { isFunctionsEmulatorRuntime } from "../commerce/emulator-runtime";

export type EbookContentProviderMode = "local" | "storage";

export function resolveEbookContentProviderMode(
  env: NodeJS.ProcessEnv = process.env,
): EbookContentProviderMode {
  const explicit = (env.EBOOK_CONTENT_PROVIDER || "").trim().toLowerCase();
  const inEmulator =
    env.FUNCTIONS_EMULATOR === "true" || isFunctionsEmulatorRuntime();
  const onCloud =
    Boolean(env.K_SERVICE || env.FUNCTION_TARGET) && env.FUNCTIONS_EMULATOR !== "true";

  if (explicit === "local") {
    // Production cloud must never fall back to local filesystem.
    if (onCloud && env.ALLOW_EBOOK_LOCAL_PROVIDER !== "true") {
      throw new Error("ebook_content_provider_local_forbidden_in_production");
    }
    return "local";
  }
  if (explicit === "storage") return "storage";
  if (onCloud) return "storage";
  if (inEmulator) return "local";
  // Default for unspecified local tooling
  return "local";
}

export function createEbookContentProvider(
  env: NodeJS.ProcessEnv = process.env,
): EbookContentProvider {
  const mode = resolveEbookContentProviderMode(env);
  const revision = Number(env.EBOOK_PRIVATE_REVISION || 2);

  if (mode === "storage") {
    return new FirebaseStorageEbookContentProvider(
      new AdminSdkStorageObjectReader(env.EBOOK_STORAGE_BUCKET || undefined),
      revision,
    );
  }

  const root =
    env.EBOOK_PRIVATE_ROOT ||
    join(__dirname, "..", "..", "..", "artifacts", "ebook-private");
  return new LocalPrivateArtifactProvider(root, revision);
}
