import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/api-response";

export abstract class BaseController {
  protected async handleRequest(
    req: Request,
    res: Response,
    action: () => Promise<any>
  ): Promise<void> {
    try {
      const result = await action();
      ApiResponse.success(res, result);
    } catch (err) {
      if (err instanceof Error) {
        ApiResponse.error(res, err.message, 500);
      } else {
        ApiResponse.error(res, "An unexpected error occurred", 500);
      }
    }
  }
}
