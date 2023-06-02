import express from 'express';
import { login, register, logout } from '../controllers/authController';
import { verifyJWT } from '../middlewares/middleware';

export const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/logout', verifyJWT, logout);
