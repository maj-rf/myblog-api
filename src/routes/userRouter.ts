import express from 'express';
import {
  getAllUsers,
  loginUser,
  registerUser,
} from '../controllers/userController';
import { jwtAuth } from '../utils/middleware';
export const userRouter = express.Router();

userRouter.get('/', jwtAuth, getAllUsers);

userRouter.post('/register', registerUser);

userRouter.post('/login', loginUser);
