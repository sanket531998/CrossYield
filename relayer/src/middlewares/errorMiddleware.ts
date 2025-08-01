// in error middlewares there is a general convention that first argument is error

import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpExceptions } from "../exceptions/root";

export const errorMiddleware = (
  err: HttpExceptions,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.statusCode) {
    // Custom error with statusCode
    return res.status(err.statusCode).json({
      error: err.message,
      errorCode: err.errorCode,
      errors: err.errors || null,
    });
  }
  // Fallback for unknown errors
  res.status(500).json({ error: "Internal Server Error" });
};
