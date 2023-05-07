import { Request, Response } from 'express';
import { User } from '../models/user';

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find({});
  res.json(users);
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = req.user;
  const currentUser = await User.findById(user?._id);
  if (!currentUser) return res.status(400).json({ message: 'User not found' });
  res.json(currentUser);
};
