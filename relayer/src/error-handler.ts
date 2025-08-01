// IN argument we have function type which comes in TS
// this method will return a function
// the benefit of this function is that we dont have to write try and catch again and again

import { NextFunction, Request, Response } from "express";
import { ErrorCodes, HttpExceptions } from "./exceptions/root.ts";
import { InternalException } from "./exceptions/internal-exception.ts";
import { User } from "@prisma/client";
import { ZodError } from "zod";
import { BadRequestException } from "./exceptions/bad-request.ts";

interface ExtendedRequest extends Request {
  user?: User;
}

export const errorHandler = (
  method: (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpExceptions;

      if (error instanceof HttpExceptions) {
        exception = error;
      } else if (error instanceof ZodError) {
        exception = new BadRequestException(
          "Unprocessable entity",
          ErrorCodes.UNPROCESSABLE_ENTITY
        );
      } else {
        exception = new InternalException(
          "Something went wrong",
          error,
          ErrorCodes.INTERNAL_EXCEPTIONS
        );
      }

      next(exception); // 🔁 This will go to Express's error middleware
    }
  };
};
