import { Router } from "express";
import {
  getAPYFromDefiLlama,
  getEthUserTokensAndBalance,
  getEthTokenBalancesCovalent,
  getAptosUserTokensAndBalances,
  getAllAPYsForTokens,
  addWalletToUser,
  createUserIntent,
  getAptosApys,
  submitIntent,
} from "../controllers/ui.controller";
import { errorHandler } from "../error-handler";

export const uiRoutes: Router = Router();

uiRoutes.get("/balances/eth/:address", getEthUserTokensAndBalance);
uiRoutes.get("/balances/aptos/:address", getAptosUserTokensAndBalances);

uiRoutes.get("/getEthTokenBalanceCovalent/eth", getEthTokenBalancesCovalent);

uiRoutes.get("/getAPYFromDefiLlama", getAPYFromDefiLlama);
uiRoutes.get("/getAptosApys", errorHandler(getAptosApys));

uiRoutes.get("/getAllAPYsForTokens", getAllAPYsForTokens);

// Prisma routes
uiRoutes.post("/addWalletToUser", errorHandler(addWalletToUser));
uiRoutes.post("/createUserIntent", errorHandler(createUserIntent));

uiRoutes.post("/submitIntent", errorHandler(submitIntent));
