import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, COOKIE_NAME, UserRequest } from "../utils";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";
import User from "../models/user";

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded: any = await jwt.verify(token, env.tokenSecret);

    const { userId } = decoded;

    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User not found!",
      });
    }

    const userReq: UserRequest = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      isActive: user.isActive,
    };

    req.user = userReq;

    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid token",
    });
  }
}

export function checkRoles(...roles: string[]) {
  return async function (req: AuthRequest, res: Response, next: NextFunction) {
    const userRoles = req.user?.roles || [];

    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You don't have access to this route",
      });
    }

    next();
  };
}
