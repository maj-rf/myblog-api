import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { PayloadWithPublicUser } from '../types/types';
import { ACCESS_TOKEN_SECRET } from '../config/config';

export const unknownEndpoint = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler: ErrorRequestHandler = (
  error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(error.stack);
  if (error.name === 'CastError')
    return res
      .status(400)
      .json({ message: 'Malformatted ID [blogId, commentId, userID]' });
  const status = res.statusCode != 200 ? res.statusCode : 500;
  res.status(status).json({ message: error.message });
  next();
};

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token: string = req.cookies.jwt;
  if (!token)
    return res.status(401).json({ message: 'Unauthorized. No JWT Token' });
  const decoded = jwt.verify(
    token,
    `${ACCESS_TOKEN_SECRET}`,
  ) as PayloadWithPublicUser;
  if (!decoded) return res.status(403).json({ message: 'Invalid Token' });
  const user = {
    _id: decoded.id,
    username: decoded.username,
    email: decoded.email,
  };
  req.user = user;
  next();
};
