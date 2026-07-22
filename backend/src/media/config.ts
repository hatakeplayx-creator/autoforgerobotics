import { z } from "zod";

export type MediaStorageDriver = "local" | "cloudinary";

export interface CloudinaryConfiguration {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  rootFolder: string;
  uploadTimeoutMs: number;
}

const optional = z.preprocess((value) => value === "" ? undefined : value, z.string().trim().min(1).optional());
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  MEDIA_STORAGE_DRIVER: z.enum(["local", "cloudinary"]).optional(),
  CLOUDINARY_CLOUD_NAME: optional,
  CLOUDINARY_API_KEY: optional,
  CLOUDINARY_API_SECRET: optional,
  CLOUDINARY_ROOT_FOLDER: z.string().trim().regex(/^[a-z0-9_-]+$/i).default("autoforge"),
  CLOUDINARY_UPLOAD_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(120_000).default(30_000),
});

export function loadMediaConfiguration(source: NodeJS.ProcessEnv | Record<string, string | undefined>) {
  const parsed = schema.parse(source);
  const hosted = parsed.NODE_ENV === "production" || parsed.VERCEL_ENV === "preview" || parsed.VERCEL_ENV === "production";
  const driver: MediaStorageDriver = parsed.MEDIA_STORAGE_DRIVER ?? (hosted ? "cloudinary" : "local");
  const values = [parsed.CLOUDINARY_CLOUD_NAME, parsed.CLOUDINARY_API_KEY, parsed.CLOUDINARY_API_SECRET];
  const hasAnyCredential = values.some(Boolean);
  const hasAllCredentials = values.every(Boolean);

  if ((driver === "cloudinary" || hosted || hasAnyCredential) && !hasAllCredentials) {
    throw new Error("CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be configured together");
  }
  if (hosted && driver !== "cloudinary") {
    throw new Error("MEDIA_STORAGE_DRIVER must be cloudinary in Preview and Production");
  }

  const cloudinary: CloudinaryConfiguration | undefined = hasAllCredentials ? {
    cloudName: parsed.CLOUDINARY_CLOUD_NAME!,
    apiKey: parsed.CLOUDINARY_API_KEY!,
    apiSecret: parsed.CLOUDINARY_API_SECRET!,
    rootFolder: parsed.CLOUDINARY_ROOT_FOLDER,
    uploadTimeoutMs: parsed.CLOUDINARY_UPLOAD_TIMEOUT_MS,
  } : undefined;
  return { driver, cloudinary };
}
