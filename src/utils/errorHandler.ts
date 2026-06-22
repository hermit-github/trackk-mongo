import { NextFunction, Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

class APIError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string = "error occurred",
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const apiErrorHandler = (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("==================XXX=====================");
  console.error(`Request Url : ${req.url}`)
  console.error(err);
  console.error("==================XXX=====================");

  // Send a JSON response with the error details
  res.status(err.statusCode || StatusCodes.BAD_REQUEST).json({
    success: false,
    message: err.message,
  });
};

export const handleNotFound = (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: ReasonPhrases.NOT_FOUND,
  });
};

export const returnAPIError = (next: NextFunction, e: unknown) => {
  let message = (e as APIError).message;
  let status = (e as APIError).statusCode || StatusCodes.BAD_REQUEST;
  return next(new APIError(message, status));
};

export default APIError;