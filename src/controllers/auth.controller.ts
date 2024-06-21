import { NextFunction, Request, Response } from "express";
import { loginDTO, registerDTO } from "../interfaces/login.interface";
import AuthService from "../services/auth.service";
import AppConfig from "../config/appConfig";
import { log } from "handlebars/runtime";
import commentModel from "../models/comment.model";
import watchModel from "../models/watch.model";
import { NotFoundError } from "../errors/NotFoundError";
import { BadRequestError } from "../errors/BadRequestError";
import { commentValidation } from "../validate/comment.validate";
import memberModel from "../models/member.model";
import { UnAuthorizedError } from "../errors/UnauthorizedError";
import { userValidation } from "../validate/user.validate";
import { ValidationError } from "../errors/ValidationError";
import { passwordValidation } from "../validate/password.validate";
import { hashPassword, isPasswordMatch } from "../utils/passwordHelper";
import { signToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";

export default class AuthController {
  static async loginGoogleHandler(req: Request, res: Response) {
    const client = new OAuth2Client(AppConfig.GG_CLIENT_ID);

    const { credential } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: AppConfig.GG_CLIENT_ID,
      });
      console.log(ticket);

      const payload = ticket.getPayload();
      console.log(payload);

      const memberName = payload.email;
      const member = await memberModel.findOne({ memberName });
      if (!member) {
        return res.render("./auth/login", {
          errorMessage: "Username does not exist or password is incorrect",
          ...req.body,
        });
      }
      const accessToken = signToken({ userId: member._id });
      res.cookie("accessToken", accessToken, { maxAge: AppConfig.JWT_EXPIRE });
      res.redirect("/home");
    } catch (err) {
      console.log(err);

      res.render("./auth/login", {
        errorMessage: "Invalid account",
      });
    }
  }

  static async resetPasswordPage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.render("./auth/resetPassword", {});
    } catch (err) {
      next(err);
    }
  }

  static async resetPasswordHandler(req, res, next) {
    try {
      const { user } = res.locals;
      const { password, newPassword, confirmPassword } = req.body;
      try {
        await passwordValidation.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
      } catch (err: any) {
        const validationErrors = JSON.parse(err.message);
        console.log(validationErrors, "errorMessage");
        const errorMap: Object = {};
        validationErrors.forEach(
          (error) => (errorMap[error.path[1]] = error.message)
        );
        console.log(errorMap, "errorMap");

        res.render("./auth/resetPassword", {
          error: errorMap,
        });
      }

      const isMatch = await isPasswordMatch(password, user.password);
      if (!isMatch)
        return res.render("./auth/resetPassword", {
          errorMessage: "Current password is not correct",
        });
      const newUser = await memberModel.findById(user._id);
      newUser.password = await hashPassword(newPassword);

      await newUser.save();

      res.render("./auth/resetPassword", {
        successMessage: "Password has been changed successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  static async editProfilePage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!res.locals.user) throw new UnAuthorizedError();
      const user = await memberModel.findById(res.locals.user._id);

      try {
        console.log(req.body);
        await userValidation.parseAsync({
          body: {
            name: req.body.name,
            isAdmin: res.locals.user.isAdmin,
            memberName: res.locals.user.memberName,
          },
        });
      } catch (err: any) {
        const validationErrors = JSON.parse(err.message);
        console.log(validationErrors, "errorMessage");
        const errorMap: Object = {};
        validationErrors.forEach(
          (error) => (errorMap[error.path[1]] = error.message)
        );
        console.log(errorMap, "errorMap");

        res.render("./auth/profile", {
          user: { ...user.toObject(), name: req.body.name },
          error: errorMap,
        });
      }

      const { name } = req.body;
      user.name = name;
      await user.save();
      res.locals.user = user.toObject();
      res.render("./auth/profile", {
        userInfo: { ...user.toObject(), name: req.body.name },
        successMessage: "Profile has been updated successfully",
      });
    } catch (err) {
      next(err);
    }
  }
  static async profilePage(req: Request, res: Response, next: NextFunction) {
    const user = await memberModel.findById(res.locals.user._id);
    try {
      res.render("./auth/profile", {
        user: { ...user.toObject(), _id: user._id.toString() },
      });
    } catch (err) {
      next(err);
    }
  }
  static async loginHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const loginDTO: loginDTO = {
        memberName: req.body.memberName,
        password: req.body.password,
      };

      const token = await AuthService.loginHandler(loginDTO);
      res.cookie("accessToken", token, { maxAge: AppConfig.JWT_EXPIRE });
      res.redirect("/home");
    } catch (err) {
      next(err);
    }
  }
  static async registerHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const registerDTO: registerDTO = {
        name: req.body.name,
        memberName: req.body.memberName,
        password: req.body.password,
        isAdmin: false,
      };
      const token = await AuthService.registerHandler(registerDTO);
      res.cookie("accessToken", token, { maxAge: AppConfig.JWT_EXPIRE });
      res.redirect("/home");
    } catch (err) {
      next(err);
    }
  }
  static async loginPage(req: Request, res: Response, next: NextFunction) {
    try {
      res.render("./auth/login", {});
    } catch (err) {
      next(err);
    }
  }
  static async registerPage(req: Request, res: Response, next: NextFunction) {
    try {
      res.render("./auth/register");
    } catch (err) {
      next(err);
    }
  }
  static async logoutHandler(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("accessToken");
      res.redirect("/auth/login");
    } catch (err) {
      next(err);
    }
  }
  static async commentHandler(req: Request, res: Response, next: NextFunction) {
    try {
      res.locals.renderUrl = "./watchDetail";
      const { user } = res.locals;
      const { rating, content, watchId } = req.body;
      const result = await watchModel.findById(watchId);
      if (!result) throw new NotFoundError();
      const watch = await watchModel
        .findById(watchId)
        .populate("brand")
        .populate("comments.author")
        .lean();
      const newWatch = {
        ...watch,
        _id: watch._id.toString(),
        brand: {
          ...watch.brand,
          _id: watch.brand._id.toString(),
        },
      };

      const comments = newWatch.comments.map((comment) => ({
        ...comment,
        _id: comment._id.toString(),
      }));

      try {
        console.log(req.body, "body");

        await commentValidation.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
      } catch (err: any) {
        const validationErrors = JSON.parse(err.message);
        console.log(validationErrors, "errorMessage");
        const errorMap: Object = {};
        validationErrors.forEach(
          (error) => (errorMap[error.path[1]] = error.message)
        );
        console.log(errorMap, "errorMap");

        res.render("./watchDetail", {
          watch: newWatch,
          error: errorMap,
          otherComments: comments,
          userComment: null,
        });
      }

      if (user.isAdmin)
        throw new BadRequestError("Admin can't comment", {
          watch: newWatch,
          otherComments: comments,
          userComment: null,
        });
      const isExist = result.comments.find(
        (cm) => cm.author._id.toString() === user._id.toString()
      );

      if (isExist) throw new BadRequestError("You have already commented");
      else {
        const newComment = commentModel({
          rating,
          content,
          author: user._id,
        });
        result.comments.push(newComment);
        await result.save();

        res.redirect(`/watches/${watchId}`);
      }
    } catch (err) {
      console.log(err);

      next(err);
    }
  }
  static async editCommentHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.locals.renderUrl = "./watchDetail";
      const { user } = res.locals;
      console.log(req.body, user);

      const { rating, content, watchId } = req.body;
      const result = await watchModel.findById(watchId);
      if (!result) throw new NotFoundError();

      const isExist = result.comments.find(
        (cm) => cm.author._id.toString() === user._id.toString()
      );

      if (!isExist) throw new NotFoundError();

      if (isExist) {
        isExist.rating = rating;
        isExist.content = content;
        await result.save();
        res.redirect(`/watches/${watchId}`);
      }
    } catch (err) {
      next(err);
    }
  }
  static async deleteCommentHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { commentId, watchId } = req.params;

      const result = await watchModel.findById(watchId);
      if (!result) throw new NotFoundError();
      const index = result.comments.findIndex(
        (cm) => cm._id.toString() === commentId.toString()
      );
      if (index === -1) throw new NotFoundError();
      result.comments.splice(index, 1);
      await result.save();
      res.redirect(`/watches/${watchId}`);
    } catch (err) {
      next(err);
    }
  }
}
