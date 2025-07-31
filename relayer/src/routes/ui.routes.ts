import { Router } from "express";
import {
  getAPYFromDefiLlama,
  getEthUserTokensAndBalance,
  getEthTokenBalancesCovalent,
  getAptosUserTokensAndBalances,
  getAllAPYsForTokens,
} from "../controllers/ui.controller";

export const uiRoutes: Router = Router();

uiRoutes.get("/balances/eth/:address", getEthUserTokensAndBalance);
uiRoutes.get("/balances/aptos/:address", getAptosUserTokensAndBalances);

uiRoutes.get("/getEthTokenBalanceCovalent/eth", getEthTokenBalancesCovalent);

uiRoutes.get("/getAPYFromDefiLlama", getAPYFromDefiLlama);

uiRoutes.get("/getAllAPYsForTokens", getAllAPYsForTokens);
