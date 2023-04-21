import express, { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET;

export const userRouter = express.Router();

userRouter.get('/', async (_req: Request, res: Response) => {
  const users = await User.find({});
  res.json(users);
});

userRouter.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Missing username, email, or password' });
    }
    if (username.length < 6 || password.length < 6) {
      return res.status(400).json({
        error: 'Username and Password must be at least 6 characters long.',
      });
    }
    try {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const user = new User({
        username,
        email,
        password: passwordHash,
      });
      const savedUser = await user.save();
      res.status(201).json(savedUser);
    } catch (error) {
      next(error);
    }
  },
);

userRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const passwordCorrect = user
    ? await bcrypt.compare(password, user.password)
    : false;
  if (!user) {
    return res.status(400).json({ error: 'Email does not exist.' });
  }
  if (!passwordCorrect) {
    return res.status(400).json({ error: 'Incorrect password.' });
  }
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, `${secretKey}`, {
    expiresIn: 60 * 60,
  });

  res.status(200).json({ token, username: user.username, email: user.email });
});
