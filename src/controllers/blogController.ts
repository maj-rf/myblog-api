import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { CustomRequest } from '../types';
import { Blog } from '../models/blog';
import { PublicUser, IUser } from '../types';
export const createBlog = [
  body('title', 'Title is required.')
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Title must be at least 6 characters.'),
  body('content', 'Content is required.')
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Content must be at least 6 characters.'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const { title, content } = req.body;
    const token = (req as CustomRequest).token as IUser;
    const user: PublicUser = { username: token.username, _id: token.id };
    const blog = new Blog({
      title,
      content,
      user,
      published: false,
      comments: [],
      tags: [],
    });
    const result = await blog.save();
    res.status(201).json(result);
  },
];

export const getALLBlogs = async (req: Request, res: Response) => {
  const blogs = await Blog.find({}).populate({
    path: 'user',
    select: 'username',
  });
  res.json(blogs);
};
