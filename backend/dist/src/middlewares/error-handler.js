import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";
export const notFound = (_req, res) => res.status(404).json({ message: "Route not found" });
export const errorHandler = (error, _req, res, _next) => { console.error(error); if (error instanceof ZodError)
    return res.status(422).json({ message: "Validation failed", errors: error.flatten() }); if (error instanceof ApiError)
    return res.status(error.status).json({ message: error.message, details: error.details }); return res.status(500).json({ message: "Internal server error" }); };
