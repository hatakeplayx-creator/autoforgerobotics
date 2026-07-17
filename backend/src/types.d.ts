import type { Role } from "./mongodb/database.js";
declare global { namespace Express { interface Request { user?: { sub: string; role: Role } } } }
export {};
