import { Request, Response } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config';
import { body, validationResult } from 'express-validator';

export const registerUser = [
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
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error('Passwords do not match');
    }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      email,
      password: passwordHash,
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  },
];

// export const registerUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const { username, email, password } = req.body;
//   if (!username || !email || !password) {
//     return res
//       .status(400)
//       .json({ error: 'Missing username, email, or password' });
//   }
//   if (username.length < 6 || password.length < 6) {
//     return res.status(400).json({
//       error: 'Username and Password must be at least 6 characters long.',
//     });
//   }
//   try {
//     const saltRounds = 10;
//     const passwordHash = await bcrypt.hash(password, saltRounds);
//     const user = new User({
//       username,
//       email,
//       password: passwordHash,
//     });
//     const savedUser = await user.save();
//     res.status(201).json(savedUser);
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find({});
  res.json(users);
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const passwordCorrect = user
    ? await bcrypt.compare(password, user.password)
    : false;
  if (!user) {
    return res.status(400).json({ error: 'Email does not exist.' });
  }
  if (user && !passwordCorrect) {
    return res.status(422).json({ error: 'Incorrect password.' });
  }
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, `${SECRET_KEY}`, {
    expiresIn: '1d',
  });

  res.status(200).json({ token, username: user.username, email: user.email });
};
