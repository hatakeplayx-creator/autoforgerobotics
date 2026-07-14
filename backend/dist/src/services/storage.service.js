import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";
const client = env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY) : null;
export async function uploadMedia(file) { if (!client)
    throw new ApiError(503, "Supabase Storage is not configured"); const key = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-")}`; const { error } = await client.storage.from(env.SUPABASE_BUCKET).upload(key, file.buffer, { contentType: file.mimetype, upsert: false }); if (error)
    throw new ApiError(502, error.message); const { data } = client.storage.from(env.SUPABASE_BUCKET).getPublicUrl(key); return { key, url: data.publicUrl }; }
export async function deleteMedia(key) { if (client)
    await client.storage.from(env.SUPABASE_BUCKET).remove([key]); }
