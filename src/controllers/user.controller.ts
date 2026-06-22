import { Request, Response, NextFunction } from "express";
import APIError from "../utils/errorHandler";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync";
import User from "../models/user";
import bcrypt from "bcrypt";
import { COOKIE_NAME, USER_ROLES } from "../utils";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export class UserController {
  // update a user

  static createUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email }).exec();

        if (existingUser) {
          throw new APIError(
            "User with same email exists",
            StatusCodes.CONFLICT,
          );
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
          name,
          email,
          password: hashedPassword,
          roles: [USER_ROLES.EMPLOYEE],
        });

        const userObj = user.toObject();

        res.status(StatusCodes.CREATED).json({
          message: "User created successfully",
          data: { ...userObj, password: undefined },
        });
      } catch (err) {
        const error = err as APIError;
        next(error);
      }
    },
  );

  static updateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.params.id;

        const { name, email, isActive, roles } = req.body;

        const user = await User.findById(userId).exec();

        if (!user) {
          throw new APIError("User not found");
        }

        const duplicateUser = await User.findOne({ email }).lean().exec();

        if(duplicateUser && duplicateUser?._id.toString() !== userId){
          throw new APIError("Duplicate username",StatusCodes.CONFLICT);
        }

        user.email = email;
        user.name = name;
        user.isActive = isActive;
        user.roles = roles;

        await user.save();

        res.status(StatusCodes.ACCEPTED).json({
          success: true,
          message: "User Updated",
        });
      } catch (error) {
        const err = error as APIError;
        next(err);
      }
    },
  );

  static deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.params.id;

        const user = await User.findById(userId).exec();

        if (!user) {
          throw new APIError("User not found");
        }

        user.isActive = false;

        await user.save();

        res.status(StatusCodes.OK).json({
          success: true,
          message: "Deleted user",
        });
      } catch (error) {
        const err = error as APIError;
        next(err);
      }
    },
  );

  static login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).exec();

        if (!user) {
          throw new APIError("Invalid credentials", StatusCodes.NOT_FOUND);
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          throw new APIError("Invalid credentials", StatusCodes.BAD_REQUEST);
        }

        const tokenPayload = {
          userId: user.id,
        };

        const token = await jwt.sign(tokenPayload, env.tokenSecret, {
          expiresIn: "1h",
        });

        res.cookie(COOKIE_NAME, token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(StatusCodes.OK).json({
          success: true,
          message: "Logged in!",
        });
      } catch (error) {
        const err = error as APIError;
        next(err);
      }
    },
  );

  static logout = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.clearCookie(COOKIE_NAME);

        res.status(StatusCodes.OK).json({
          success: true,
          message: "Logged out!",
        });
      } catch (error) {
        const err = error as APIError;
        next(err);
      }
    },
  );

  static getAllUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const users = await User.find({ isActive: true })
          .sort({ createdAt: -1 })
          .select("-password")
          .lean()
          .exec();

        res.status(StatusCodes.OK).json({
          message: "Users fetched successfully",
          data: users,
        });
      } catch (err) {
        const error = err as APIError;
        next(error);
      }
    },
  );
}
