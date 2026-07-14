import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";
export const authenticate = (req, _res, next) => { try {
    const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token)
        throw new Error();
    const data = jwt.verify(token, env.JWT_SECRET);
    req.auth = { userId: data.sub, role: data.role };
    next();
}
catch {
    next(new ApiError(401, "Authentication required"));
} };
export const authorize = (...roles) => (req, _res, next) => req.auth && roles.includes(req.auth.role) ? next() : next(new ApiError(403, "Insufficient permissions"));
