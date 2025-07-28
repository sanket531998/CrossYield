import { Router } from "express";
import apyRouter from "./apy.routes.ts";

const rootRouter: Router = Router();

rootRouter.use("/apy", apyRouter);

export default rootRouter;
