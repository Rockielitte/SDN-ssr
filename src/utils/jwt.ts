import jwt from 'jsonwebtoken';
import AppConfig from '../config/appConfig';

export type AccessToken = {
  userId: string;
};

export const signToken = (
  payload: AccessToken,
) => {
  return jwt.sign(payload, AppConfig.JWT_SECRET, {
    expiresIn: AppConfig.JWT_EXPIRE,
  });
};

export const verifyToken = <T extends object = AccessToken>(
  token: string,
) => {
  try {
    const payload = jwt.verify(token, AppConfig.JWT_SECRET, {
    }) as T;
    return {
      payload,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
