import { NextFunction, Request, Response } from "express";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.json({
    message: "Error from errorHandler",
    error: err.message,
  });
}

export default errorHandler;
