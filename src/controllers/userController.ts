import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Post from '../models/Post';

export const post_register = [
  body('username', 'Username is required')
    .trim()
    .escape()
    .custom(async (username) => {
      try {
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
          throw new Error('Username is already in use.');
        }
      } catch (err) {
        console.log(err);
      }
    }),
  body('email', 'Email is required')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid Email')
    .custom(async (email) => {
      try {
        const usedEmail = await User.findOne({ email: email });
        if (usedEmail) throw new Error('Email is already in use.');
      } catch (err) {
        console.log(err);
      }
    }),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage('Minimum length of 6 characters'),
  body('confirm-pass')
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return false;
      }
      return true;
    })
    .withMessage('Passwords do not match'),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        });
        newUser.save((err) => {
          if (err) return next(err);
          res.status(200).json({ message: 'Account created!' });
        });
      });
    }
  },
];

export const post_logout = function (req: Response, res: Response) {
  res.redirect('/');
};

export const get_user_detail = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const post_count = await Post.countDocuments({ author: req.params.id }).catch(
    (err) => next(err)
  );
  const recent_posts = await Post.find({ author: req.params.id })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('author', 'username email')
    .catch((err) => next(err));

  res.json({ post_count, recent_posts });
};

// export const getUserPost = async function (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const post = await Post.findById(req.params.postid).catch((err) => next(err));
//   res.json({ post });
// };

export const delete_user = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // req.params.id is the User's/Authors ObjectId.
  // delete User and all User Messages in DB.
  await User.findByIdAndRemove(req.params.id).catch((err) => next(err));
  await Post.deleteMany({ author: req.params.id });
  res.clearCookie('jwt');
  res.json({ message: 'Account deleted' });
};
