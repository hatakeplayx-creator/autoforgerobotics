import { Router } from "express";
import { catalogRouter } from "./catalog.routes.js";
import { commerceRouter } from "./commerce.routes.js";
export const apiRouter = Router();
apiRouter.use(catalogRouter);
apiRouter.use(commerceRouter);
