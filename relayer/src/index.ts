// src/index.ts
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import type { Express } from "express"; // 👈 only import type

import rootRouter from "./routes/index.routes";

const app: Express = express();

app.use("/api", rootRouter);
app.get("/", (_req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ CrossYield backend listening at http://localhost:${PORT}`);
});
