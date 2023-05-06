import express from 'express';
import { getAllUsers } from '../controllers/userController';

export const userRouter = express.Router();

userRouter.get('/', getAllUsers);
