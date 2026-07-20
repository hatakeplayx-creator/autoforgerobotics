import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { z } from "zod";
import { connectMongoDB, disconnectMongoDB } from "../src/mongodb/connection.js";
import { mongo } from "../src/mongodb/database.js";

const environment = z.object({
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
  UPLOAD_DIR: z.string().min(1).default("backend/uploads"),
}).parse(process.env);

async function main(): Promise<void> {
  await connectMongoDB();
  const uploadDir = path.resolve(environment.UPLOAD_DIR);
  const localMedia = (await mongo.media.findMany()).filter((item) => item.url.startsWith("/uploads/"));
  let migrated = 0;
  const missing: string[] = [];

  for (const item of localMedia) {
    const localKey = path.basename(item.url);
    try {
      const data = await readFile(path.join(uploadDir, localKey));
      const blob = await put(`media/${localKey}`, data, {
        access: "public",
        contentType: item.mimeType,
        addRandomSuffix: false,
        allowOverwrite: false,
        token: environment.BLOB_READ_WRITE_TOKEN,
      });
      await mongo.media.update({ where: { id: item.id }, data: { key: blob.pathname, url: blob.url } });
      migrated += 1;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        missing.push(localKey);
        continue;
      }
      throw error;
    }
  }

  console.log(JSON.stringify({ event: "media_blob_migration_complete", migrated, missing }, null, 2));
  if (missing.length) process.exitCode = 2;
}

main().catch((error: unknown) => {
  console.error("Media migration failed", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}).finally(async () => {
  await disconnectMongoDB();
});
