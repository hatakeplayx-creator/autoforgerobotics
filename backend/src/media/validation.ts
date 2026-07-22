import path from "node:path";
import { imageSize } from "image-size";

export const MAX_MEDIA_FILE_BYTES = 4 * 1024 * 1024;
export const MAX_MEDIA_FILES = 8;
export const MAX_MEDIA_REQUEST_BYTES = Math.floor(4.4 * 1024 * 1024);

export const allowedImageTypes = {
  "image/jpeg": { extension: new Set([".jpg", ".jpeg"]), format: "jpg" },
  "image/png": { extension: new Set([".png"]), format: "png" },
  "image/webp": { extension: new Set([".webp"]), format: "webp" },
  "image/avif": { extension: new Set([".avif"]), format: "avif" },
} as const;

export class MediaValidationError extends Error {
  constructor(message: string, readonly status: 413 | 415 | 422 = 415) {
    super(message);
    this.name = "MediaValidationError";
  }
}

export function detectImageMimeType(buffer: Buffer): keyof typeof allowedImageTypes | undefined {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  if (buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp" && ["avif", "avis"].includes(buffer.toString("ascii", 8, 12))) return "image/avif";
  return undefined;
}

export function validateImageFile(file: Pick<Express.Multer.File, "buffer" | "mimetype" | "originalname" | "size">) {
  if (file.size > MAX_MEDIA_FILE_BYTES) throw new MediaValidationError(`Image exceeds the ${MAX_MEDIA_FILE_BYTES / 1024 / 1024} MB limit`, 413);
  const claimed = file.mimetype.toLowerCase() as keyof typeof allowedImageTypes;
  const rule = allowedImageTypes[claimed];
  if (!rule) throw new MediaValidationError("Only JPEG, PNG, WebP, and AVIF images are supported");
  const extension = path.extname(file.originalname).toLowerCase();
  if (!rule.extension.has(extension as never)) throw new MediaValidationError("The filename extension does not match the declared image type");
  const actual = detectImageMimeType(file.buffer);
  if (!actual || actual !== claimed) throw new MediaValidationError("The file signature does not match the declared image type");
  try {
    const dimensions = imageSize(file.buffer);
    if (!dimensions.width || !dimensions.height) throw new Error("dimensions missing");
    if (dimensions.width > 12_000 || dimensions.height > 12_000 || dimensions.width * dimensions.height > 60_000_000) {
      throw new MediaValidationError("Image dimensions exceed the safe decoding limit", 422);
    }
    return { mimeType: actual, format: rule.format, width: dimensions.width, height: dimensions.height };
  } catch (error) {
    if (error instanceof MediaValidationError) throw error;
    throw new MediaValidationError("The image is malformed or cannot be decoded", 422);
  }
}

export function validateImageBatch(files: Array<Pick<Express.Multer.File, "buffer" | "mimetype" | "originalname" | "size">>) {
  if (!files.length) throw new MediaValidationError("At least one image is required", 422);
  if (files.length > MAX_MEDIA_FILES) throw new MediaValidationError(`A maximum of ${MAX_MEDIA_FILES} images may be uploaded`, 422);
  if (files.reduce((sum, file) => sum + file.size, 0) > MAX_MEDIA_REQUEST_BYTES) throw new MediaValidationError("Combined image size exceeds the request limit", 413);
  return files.map(validateImageFile);
}
