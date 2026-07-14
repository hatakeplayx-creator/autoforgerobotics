import { z } from "zod";
export const idParams = z.object({ id: z.string().cuid() });
export const pagination = z.object({ page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().min(1).max(100).default(20), q: z.string().trim().max(150).optional() });
