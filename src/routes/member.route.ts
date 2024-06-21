import express, { Request, Response, NextFunction } from 'express';
import authentication from '../middlewares/authentication';

export const memberRoute = express.Router();

memberRoute.get('/profile', authentication, (req, res, next) => {
  res.send('get profile')
});