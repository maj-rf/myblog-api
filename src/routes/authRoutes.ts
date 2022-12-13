import { auth_login_post } from '../controllers/authController';
import { post_register } from '../controllers/userController';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/login', auth_login_post);
authRouter.post('/register', post_register);

export default authRouter;
