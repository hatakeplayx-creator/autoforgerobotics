import type { Role } from "@prisma/client";
declare global { namespace Express { interface Request { user?: { sub: string; role: Role } } } }
export {};
