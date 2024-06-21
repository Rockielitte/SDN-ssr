import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthenticatedError } from "../errors/AuthenticatedError";
import memberModel from "../models/member.model";
import { Member } from "../interfaces/member.interface";

const userPass = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.cookies;
  console.log(accessToken);

  if (!accessToken) {
    res.locals.userInfo = null;
    return next();
  }
  const { error, payload } = verifyToken(accessToken);
  if (error) {
    res.locals.userInfo = null;
    return next();
  }

  if (payload && payload.userId) {
    const member: Member = await memberModel.findById(payload.userId).lean();
    console.log(member);
    res.locals.userInfo = member;
    return next();
  }
  res.locals.userInfo = null;
  return next();
};

export default userPass;
