import { Router } from "express";
import apyRouter from "./apy.routes.ts";
import { uiRoutes } from "./ui.routes.ts";

const rootRouter: Router = Router();

rootRouter.use("/apy", apyRouter);
rootRouter.use("/ui", uiRoutes);

export default rootRouter;
