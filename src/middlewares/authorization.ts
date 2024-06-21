import { Request, Response, NextFunction } from "express";
import { UnAuthorizedError } from "../errors/UnauthorizedError";

export const Authorization = (roles: boolean[]) => {
  console.log();

  return (req: Request, res: Response, next: NextFunction) => {
    console.log("roles", res.locals.user.isAdmin);

    if (!res.locals.user) {
      next(new UnAuthorizedError());
    }
    if (!roles.includes(res.locals.user.isAdmin)) {
      next(new UnAuthorizedError());
    }
    next();
  };
};
