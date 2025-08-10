import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape, ZodError } from "zod";
import { ApiResponse } from "./response";
import { ERROR_MESSAGES } from "../constants/error-messages.constant";

export const validate =
  (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors for better readability
        const formattedErrors = error.issues.map((err) => ({
          message: err.message,
          value: err.input,
        }));

        const errorMessage = formattedErrors
          .map((err) => err.message)
          .join(", ");

        ApiResponse.error(res, errorMessage, 400);
      } else {
        ApiResponse.error(res, ERROR_MESSAGES.VALIDATION_ERROR, 400);
      }
    }
  };
