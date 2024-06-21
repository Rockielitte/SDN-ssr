import express, { Request, Response, NextFunction } from "express";
import AuthController from "../controllers/auth.controller";
import validate from "../middlewares/validate";
import { loginValidate } from "../validate/login.validate";

import { registerValidate } from "../validate/register.validate";

import { dashboardRoutes } from "./dashboard.route";
import authentication from "../middlewares/authentication";
import { commentValidation } from "../validate/comment.validate";
import { userValidation } from "../validate/user.validate";

export const authRouter = express.Router();

authRouter.get("/login", AuthController.loginPage);
authRouter.get("/register", AuthController.registerPage);
authRouter.post("/login", validate(loginValidate), AuthController.loginHandler);
authRouter.post("/login-google", AuthController.loginGoogleHandler);
authRouter.post(
  "/register",
  validate(registerValidate),
  AuthController.registerHandler
);
authRouter.get("/logout", AuthController.logoutHandler);
authRouter.get("/logout", AuthController.logoutHandler);
authRouter.post(
  "/comment",
  authentication,

  AuthController.commentHandler
);
authRouter.put("/comment", authentication, AuthController.editCommentHandler);
authRouter.delete(
  "/:watchId/comment/:commentId",
  authentication,
  AuthController.deleteCommentHandler
);
authRouter.get("/profile", authentication, AuthController.profilePage);
authRouter.get(
  "/resetPassword",
  authentication,
  AuthController.resetPasswordPage
);
authRouter.put(
  "/resetPassword",
  authentication,
  AuthController.resetPasswordHandler
);

authRouter.put("/profile", authentication, AuthController.editProfilePage);
authRouter.use("/dashboard", dashboardRoutes);
// authRouter.get('/register', async (req, res, next) => {
//   memberModel.create({memberName: 'tom', password: await hashPassword('123456'), name: 'tommy'})
//   res.send('ok')
// })
