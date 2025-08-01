// src/index.ts
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import type { ErrorRequestHandler, Express } from "express"; // 👈 only import type
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import rootRouter from "./routes/index.routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app: Express = express();
const PORT = process.env.PORT || 5050;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // if you're using cookies or auth headers
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

// whenever any controller throws any exception this middleware will catch it
app.use(errorMiddleware as ErrorRequestHandler);

app.listen(PORT, () => {
  console.log(`✅ CrossYield backend listening at http://localhost:${PORT}`);
});
