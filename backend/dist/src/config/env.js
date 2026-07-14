import "dotenv/config";
import { z } from "zod";
export const env = z.object({ DATABASE_URL: z.string().url(), JWT_SECRET: z.string().min(32), PORT: z.coerce.number().default(4000), CORS_ORIGIN: z.string().min(1), SUPABASE_URL: z.string().url().optional(), SUPABASE_SERVICE_ROLE_KEY: z.string().optional(), SUPABASE_BUCKET: z.string().default("media") }).parse(process.env);
