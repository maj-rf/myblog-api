import { TUser } from './../models/User';
import { TPost } from './../models/Post';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post';

// interface to include user in http request
interface IUserRequest extends Request {
  user: any;
}

export const getAllPosts = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const posts = await Post.find()
      .sort({ createdAt: 1 })
      .populate('author', 'username');
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};
export const createPost = [
  body('title', 'Blog title is required')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Blog title must be between 5 and 100 characters')
    .escape(),
  body('content', 'Blog content is required')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Blog must not be empty')
    .escape(),
  (req: IUserRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).mapped();
    // If invalid
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    //If valid
    /*   Pick only _id and username from req.user<TUser>
     and only send these as credentials */
    const reqUser = req.user as Pick<TUser, '_id' | 'username'>;
    const authorCredentials = { _id: reqUser._id, username: reqUser.username };
    const newPost: TPost = new Post({
      title: req.body.title,
      content: req.body.content,
      published: req.body.published,
      author: authorCredentials,
      comment: req.body.comments,
    });

    newPost.save((err) => {
      if (err) return next(err);
      res.json({ post: newPost });
    });
  },
];
