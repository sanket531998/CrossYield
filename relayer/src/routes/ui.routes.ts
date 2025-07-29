import { Router } from "express";
import {
  getAPYFromDefiLlama,
  getEthTokenBalance,
  getEthTokenBalancesCovalent,
} from "../controllers/ui.controller";

export const uiRoutes: Router = Router();

uiRoutes.get("/balances/eth/:address", getEthTokenBalance);

uiRoutes.get(
  "/getEthTokenBalanceCovalent/eth/:address",
  getEthTokenBalancesCovalent
);

uiRoutes.get("/getAPYFromDefiLlama", getAPYFromDefiLlama);
