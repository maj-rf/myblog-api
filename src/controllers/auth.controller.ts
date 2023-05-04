import { Request, Response } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from '../config/config';
import { PayloadWithPublicUser } from '../types/types';
import { signAccessToken, signRefreshToken } from '../utils/jwt.utils';
import { body, validationResult } from 'express-validator';

export const login = [
  body('email', 'Email is required').trim().escape().normalizeEmail().isEmail(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const passwordCorrect = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!user) {
      return res.status(400).json({ message: 'Email does not exist.' });
    }
    if (!passwordCorrect) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }
    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const accessToken = signAccessToken(userForToken, '15m');
    const refreshToken = signRefreshToken(userForToken, '30d');
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.send({ accessToken });
  },
];

export const register = [
  body('username', 'Username is required')
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Username must be at least 6 characters'),
  body('email')
    .trim()
    .escape()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email address.')
    .custom(async (mail) => {
      const existingEmail = await User.findOne({ email: mail });
      if (existingEmail) {
        throw new Error('Email is already in use. Try again.');
      }
    }),
  body('password', 'Password is required')
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirm_pass')
    .trim()
    .escape()
    .custom(async (value, { req }) => {
      console.log(value);
      if (value !== req.body.password)
        throw new Error('Passwords do not match');
    }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    const { username, email, password } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      email,
      password: passwordHash,
    });

    await user.save();
    res.status(201).json({ message: 'Succesfully registered' });
  },
];

export const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  console.log(cookies.jwt);
  if (!cookies.jwt)
    return res.status(401).json({ message: 'No JWT, Unauthorized' });
  const refreshToken = cookies.jwt;
  const decoded = jwt.verify(
    refreshToken,
    `${REFRESH_TOKEN_SECRET}`,
  ) as PayloadWithPublicUser;
  if (!decoded) return res.status(403).json({ message: 'Forbidden' });
  const user = await User.findById(decoded.id);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  const accessToken = signAccessToken(userForToken, '15m');
  res.json({ accessToken });
};

export const logout = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.jwt)
    return res.status(401).json({ message: 'No JWT, Unauthorized' });
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  res.json({ message: 'Succesfully Logged Out' });
};
