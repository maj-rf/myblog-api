import express from 'express';
import { getAllUsers, getCurrentUser } from '../controllers/userController';

export const userRouter = express.Router();

userRouter.get('/', getAllUsers);

userRouter.get('/profile', getCurrentUser);
