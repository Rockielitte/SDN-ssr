import { Response, ErrorRequestHandler, Request } from "express";
import { AppError } from "../errors/AppError";
import { AuthenticatedError } from "../errors/AuthenticatedError";
import { UnAuthorizedError } from "../errors/UnauthorizedError";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { ValidationError } from "../errors/ValidationError";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const renderUrl = res.locals.renderUrl;
  if (error instanceof AppError) {
    if (error instanceof ValidationError) {
      const originalUrl = "." + req.url;
      return res.render(originalUrl, {
        error: error.errors,
        ...error.data,
      });
    }
    if (error instanceof AuthenticatedError) {
      return res.redirect("/auth/login");
    }
    if (error instanceof UnAuthorizedError) {
      return res.redirect("/401");
    }
    if (error instanceof BadRequestError) {
      const originalUrl = "." + req.url;
      return res.render(renderUrl ?? originalUrl, {
        errorMessage: error.message,
        ...error.data,
      });
    }
    if (error instanceof NotFoundError) {
      return res.redirect("/404");
    }
  }
  console.log(`PATH ${req.path}`, error);
  return res.status(500).send("Internal server error");
};

export default errorHandler;
