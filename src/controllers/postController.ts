import { TPost } from './../models/Post';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post';

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
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    // If invalid
    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
      return;
    }
    //If valid
    const newPost: TPost = new Post({
      title: req.body.title,
      content: req.body.content,
      published: req.body.published,
      author: req.user,
      comment: req.body.comments,
    });

    newPost.save((err) => {
      if (err) return next(err);
      res.json({ post: newPost });
    });
  },
];
