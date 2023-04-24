import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { CustomRequest } from '../types';
//import jwt from 'jsonwebtoken';
//import { SECRET_KEY } from '../config/config';
import { Blog } from '../models/blog';
import { User } from '../models/user';
import { JwtPayload } from 'jsonwebtoken';

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
    const token = (req as CustomRequest).token as JwtPayload;
    const user = await User.findById(token.id);
    console.log(user);
    if (user) {
      const blog = new Blog({
        title,
        content,
        user,
        published: false,
        comments: [],
        tags: [],
      });
      const result = await blog.save();
      user.blog = user.blog.concat(blog._id);
      await user.save();
      res.status(201).json(result);
    }
  },
];

export const getALLBlogs = async (req: Request, res: Response) => {
  const blogs = await Blog.find({});
  res.json(blogs);
};
