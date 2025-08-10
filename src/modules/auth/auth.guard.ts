import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { HttpException } from "../../utils/response";
import { getTokenFromRequest } from "../../utils/jwt";
import { ERROR_MESSAGES } from "../../constants/error-messages.constant";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const authGuard: RequestHandler = (req, _res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return next(HttpException.unauthorized(ERROR_MESSAGES.TOKEN_REQUIRED));
  }
  try {
    (req as any).user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(HttpException.unauthorized(ERROR_MESSAGES.INVALID_TOKEN));
  }
};
