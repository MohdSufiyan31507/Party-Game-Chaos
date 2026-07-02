import type { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { verifyAuthToken } from "../utils/jwt.js";

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      throw new HttpError(401, "Authentication token required");
    }

    const payload = verifyAuthToken(token);
    const user = await UserModel.findById(payload.userId);

    if (!user) {
      throw new HttpError(401, "Authenticated user no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error instanceof HttpError ? error : new HttpError(401, "Invalid token"));
  }
}
