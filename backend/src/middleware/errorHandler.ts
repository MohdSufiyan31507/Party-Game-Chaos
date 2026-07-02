import type { ErrorRequestHandler, RequestHandler } from "express";
import { HttpError } from "../utils/httpError.js";

type MongoDuplicateError = Error & {
  code?: number;
};

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const duplicateError = error as MongoDuplicateError;

  if (duplicateError.code === 11000) {
    res.status(409).json({ message: "Email is already registered" });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Something went sideways in the chaos engine" });
};
