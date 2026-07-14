import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate, authorize } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import * as c from "../controllers/catalog.controller.js";
export const catalogRouter = Router();
const admin = [authenticate, authorize(Role.ADMIN)];
catalogRouter.route("/products").get(asyncHandler(c.listProducts)).post(...admin, asyncHandler(c.createProduct));
catalogRouter.route("/products/:id").get(asyncHandler(c.getProduct)).patch(...admin, asyncHandler(c.updateProduct)).delete(...admin, asyncHandler(c.removeProduct));
for (const [path, controller] of [["/categories", c.categories], ["/brands", c.brands]])
    catalogRouter.route(path).get(asyncHandler(controller.list)).post(...admin, asyncHandler(controller.create));
catalogRouter.route("/categories/:id").patch(...admin, asyncHandler(c.categories.update)).delete(...admin, asyncHandler(c.categories.remove));
catalogRouter.route("/brands/:id").patch(...admin, asyncHandler(c.brands.update)).delete(...admin, asyncHandler(c.brands.remove));
