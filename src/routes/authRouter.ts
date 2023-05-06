import express from 'express';
import {
  login,
  register,
  logout,
  refresh,
} from '../controllers/authController';
import { verifyJWT } from '../middlewares/middleware';

export const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/logout', verifyJWT, logout);
authRouter.get('/refresh', refresh);

// test auth
authRouter.get('/random', verifyJWT, (req, res) => {
  const user = req.user;
  res.json(user);
});
