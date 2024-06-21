import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthenticatedError } from "../errors/AuthenticatedError";
import memberModel from "../models/member.model";
import { Member } from "../interfaces/member.interface";

const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken } = req.cookies;
  console.log(accessToken);
  if (!accessToken) {
    return next(new AuthenticatedError());
  }
  const { error, payload } = verifyToken(accessToken);
  if (error) {
    return next(new AuthenticatedError());
  }

  if (payload && payload.userId) {
    const member: Member = await memberModel.findById(payload.userId).lean();
    res.locals.user = member;
    return next();
  }
  return next(new AuthenticatedError());
};

export default authentication;
