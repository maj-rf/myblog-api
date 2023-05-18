import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../config/config';
import { PublicUser } from '../types/types';
import { Response } from 'express';

export const signAccessToken = (res: Response, payload: PublicUser) => {
  const token = jwt.sign(payload, `${ACCESS_TOKEN_SECRET}`, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
  });
};
