// src/index.ts
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import type { Express } from "express"; // 👈 only import type
import cors from "cors";

import rootRouter from "./routes/index.routes";

const app: Express = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // if you're using cookies or auth headers
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", rootRouter);
app.get("/", (_req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ CrossYield backend listening at http://localhost:${PORT}`);
});
