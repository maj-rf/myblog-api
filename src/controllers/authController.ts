import { Request, Response, NextFunction } from 'express';

//@desc  Register new user
//@route POST /api/users/register
//@access Public
export const registerUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: 'Register User' });
};

//@desc  Login user
//@route POST /api/users/login
//@access Public
export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Login User' });
};

//@desc  Get user data
//@route GET /api/users/me
//@access Public
export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: 'Login User' });
};
