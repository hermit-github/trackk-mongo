import express from "express";
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../validations";
import { UserController } from "../controllers";
import { checkRoles, validate } from "../middlewares";
import { authenticate } from "../middlewares";
import { USER_ROLES } from "../utils";

const router = express.Router();

router
  .route("/")
  .get(authenticate, checkRoles(USER_ROLES.ADMIN), UserController.getAllUsers)
  .post(validate(createUserSchema), UserController.createUser);

router.route("/login").post(validate(loginUserSchema), UserController.login);

router.route("/logout").get(UserController.logout);

router
    .route("/:id")
    .put(authenticate,checkRoles(USER_ROLES.ADMIN),validate(updateUserSchema),UserController.updateUser)
    .delete(authenticate,checkRoles(USER_ROLES.ADMIN),UserController.deleteUser);

export { router as userRouter };
