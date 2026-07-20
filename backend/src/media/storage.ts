import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

export type MediaStorageDriver = "local" | "vercel-blob";

export interface StoredMedia {
  key: string;
  url: string;
}

interface MediaStorageOptions {
  driver: MediaStorageDriver;
  uploadDir: string;
  blobToken?: string;
}

export function createMediaStorage(options: MediaStorageOptions) {
  const uploadDir = path.resolve(options.uploadDir);

  return {
    driver: options.driver,
    uploadDir,
    async initialize(): Promise<void> {
      if (options.driver === "local") await mkdir(uploadDir, { recursive: true });
    },
    async put(key: string, data: Buffer, contentType: string): Promise<StoredMedia> {
      if (options.driver === "vercel-blob") {
        const blob = await put(`media/${key}`, data, {
          access: "public",
          contentType,
          addRandomSuffix: false,
          token: options.blobToken,
        });
        return { key: blob.pathname, url: blob.url };
      }

      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, key), data, { flag: "wx" });
      return { key, url: `/uploads/${key}` };
    },
    async delete(key: string, url: string): Promise<void> {
      if (options.driver === "vercel-blob") {
        if (/^https:\/\/[^/]+\.blob\.vercel-storage\.com\//i.test(url)) {
          await del(url, { token: options.blobToken });
        }
        return;
      }

      if (path.basename(key) === key) {
        await unlink(path.join(uploadDir, key)).catch(() => undefined);
      }
    },
  };
}
