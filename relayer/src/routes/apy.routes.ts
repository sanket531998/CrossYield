// src/routes/apy.ts
import express from "express";
import { fetchAaveAPYs } from "../services/apy/aave.ts";

const apyRouter = express.Router();

apyRouter.get("/aave", async (req, res) => {
  const apys = await fetchAaveAPYs();
  res.json(apys);
});

export default apyRouter;
