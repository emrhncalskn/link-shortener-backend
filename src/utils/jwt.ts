import { Request } from "express";

export function getTokenFromRequest(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return undefined;
}
