import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import type { CloudinaryConfiguration, MediaStorageDriver } from "./config.js";

export interface StoredMedia {
  provider: "local" | "cloudinary";
  key: string;
  publicId?: string;
  url: string;
  secureUrl: string;
  resourceType: "image";
  format?: string;
  width?: number;
  height?: number;
  bytes: number;
  version?: number;
  originalFilename: string;
}

export class MediaStorageError extends Error {
  readonly status = 503;
  constructor(message = "Media storage is temporarily unavailable") {
    super(message);
    this.name = "MediaStorageError";
  }
}

export interface MediaStorage {
  driver: MediaStorageDriver;
  uploadDir: string;
  rootFolder?: string;
  initialize(): Promise<void>;
  put(input: { publicId: string; data: Buffer; contentType: string; originalFilename: string }): Promise<StoredMedia>;
  delete(publicId: string): Promise<void>;
  metadata(publicId: string): Promise<Partial<StoredMedia>>;
}

function safePublicId(publicId: string, rootFolder?: string): string {
  if (!/^[a-zA-Z0-9/_-]+$/.test(publicId) || publicId.includes("..")) throw new Error("Invalid media public ID");
  if (rootFolder && !publicId.startsWith(`${rootFolder}/`)) throw new Error("Media public ID is outside the configured root folder");
  return publicId;
}

function normalizeCloudinaryError(error: unknown): MediaStorageError {
  const message = error instanceof Error && /timeout/i.test(error.message)
    ? "Media storage timed out"
    : "Media storage is temporarily unavailable";
  return new MediaStorageError(message);
}

function responseToStored(result: UploadApiResponse, originalFilename: string): StoredMedia {
  return {
    provider: "cloudinary",
    key: result.public_id,
    publicId: result.public_id,
    url: result.secure_url,
    secureUrl: result.secure_url,
    resourceType: "image",
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    version: result.version,
    originalFilename,
  };
}

export function createMediaStorage(options: { driver: MediaStorageDriver; uploadDir: string; cloudinary?: CloudinaryConfiguration }): MediaStorage {
  const uploadDir = path.resolve(options.uploadDir);
  const rootFolder = options.cloudinary?.rootFolder;
  if (options.driver === "cloudinary" && !options.cloudinary) throw new Error("Cloudinary storage selected without credentials");
  if (options.cloudinary) cloudinary.config({
    cloud_name: options.cloudinary.cloudName,
    api_key: options.cloudinary.apiKey,
    api_secret: options.cloudinary.apiSecret,
    secure: true,
    hide_sensitive: true,
  });

  return {
    driver: options.driver,
    uploadDir,
    rootFolder,
    async initialize() { if (options.driver === "local") await mkdir(uploadDir, { recursive: true }); },
    async put(input) {
      if (options.driver === "cloudinary") {
        try {
          const publicId = safePublicId(input.publicId, rootFolder);
          const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("Cloudinary upload timeout")), options.cloudinary!.uploadTimeoutMs);
            const stream = cloudinary.uploader.upload_stream({
              public_id: publicId,
              resource_type: "image",
              type: "upload",
              overwrite: false,
              use_filename: false,
              unique_filename: false,
              context: { original_filename: input.originalFilename.slice(0, 255) },
            }, (error, result) => {
              clearTimeout(timer);
              if (error || !result) reject(error ?? new Error("Empty Cloudinary response"));
              else resolve(result);
            });
            stream.end(input.data);
          });
          return responseToStored(result, input.originalFilename);
        } catch (error) { throw normalizeCloudinaryError(error); }
      }
      const key = path.basename(input.publicId);
      if (key !== input.publicId) throw new Error("Local media keys cannot contain folders");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, key), input.data, { flag: "wx" });
      const url = `/uploads/${key}`;
      return { provider: "local", key, url, secureUrl: url, resourceType: "image", bytes: input.data.length, originalFilename: input.originalFilename };
    },
    async delete(publicId) {
      if (options.driver === "cloudinary") {
        const safe = safePublicId(publicId, rootFolder);
        try {
          const result = await cloudinary.uploader.destroy(safe, { resource_type: "image", type: "upload", invalidate: true });
          if (!result || !["ok", "not found"].includes(result.result)) throw new Error("Cloudinary did not confirm deletion");
        } catch (error) { throw normalizeCloudinaryError(error); }
        return;
      }
      if (path.basename(publicId) !== publicId) throw new Error("Invalid local media key");
      await unlink(path.join(uploadDir, publicId)).catch((error: NodeJS.ErrnoException) => { if (error.code !== "ENOENT") throw error; });
    },
    async metadata(publicId) {
      if (options.driver !== "cloudinary") return {};
      const safe = safePublicId(publicId, rootFolder);
      try {
        const result = await cloudinary.api.resource(safe, { resource_type: "image", type: "upload" });
        return responseToStored(result as UploadApiResponse, String(result.original_filename ?? ""));
      } catch (error) { throw normalizeCloudinaryError(error); }
    },
  };
}
