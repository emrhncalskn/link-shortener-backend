import { Request, Response } from "express";
import { ApiResponse, HttpException } from "../utils/response";

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
      if (err instanceof HttpException) {
        err.sendResponse(res);
      } else if (err instanceof Error) {
        ApiResponse.error(res, err.message, 500);
      } else {
        ApiResponse.error(res, "An unexpected error occurred", 500);
      }
    }
  }
}
