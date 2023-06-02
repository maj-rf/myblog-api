import { Request, Response } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { signAccessToken } from '../utils/jwt.utils';
import { body, validationResult } from 'express-validator';

export const login = [
  body('email', 'Email is required')
    .notEmpty()
    .trim()
    .escape()
    .normalizeEmail()
    .isEmail(),
  body('password', 'Password is required')
    .notEmpty()
    .unescape()
    .trim()
    .escape(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: errors.array({ onlyFirstError: true })[0].msg });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const passwordCorrect = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!user) {
      return res.status(400).json({ message: 'Email does not exist' });
    }
    if (!passwordCorrect) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    const userForToken = {
      username: user.username,
      id: user._id,
      email: user.email,
    };
    signAccessToken(res, userForToken);
    res
      .status(200)
      .json({ id: user._id, username: user.username, email: user.email });
  },
];

export const register = [
  body('username', 'Username is required')
    .notEmpty()
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Username must be at least 6 characters'),
  body('email', 'Email is required')
    .notEmpty()
    .trim()
    .escape()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email address.')
    .custom(async (mail) => {
      const existingEmail = await User.findOne({ email: mail });
      if (existingEmail) {
        throw new Error('Email is already in use');
      }
    }),
  body('password', 'Password is required')
    .notEmpty()
    .unescape()
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirm_pass')
    .trim()
    .escape()
    .custom(async (value, { req }) => {
      if (value !== req.body.password)
        throw new Error('Passwords do not match');
    }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: errors.array({ onlyFirstError: true })[0].msg });
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

    const userForToken = {
      username: user.username,
      id: user._id,
      email: user.email,
    };
    signAccessToken(res, userForToken);
    res
      .status(201)
      .json({ id: user._id, username: user.username, email: user.email });
  },
];

export const logout = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.jwt)
    return res.status(401).json({ message: 'No JWT, Unauthorized' });
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: 'Succesfully Logged Out' });
};
