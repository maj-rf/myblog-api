import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Blog } from '../models/blog';
import { Comment } from '../models/comment';
import he from 'he';

export const createBlog = [
  body('title', 'Title is required')
    .notEmpty()
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Title must be at least 6 characters'),
  body('content', 'Content is required')
    .notEmpty()
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Content must be at least 6 characters'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: errors.array({ onlyFirstError: true })[0].msg });
    }
    const { title, content, published } = req.body;
    const user = req.user;
    const blog = new Blog({
      title,
      content,
      user: user?._id,
      published: published || false,
      comments: [],
      tags: [],
    });
    const result = await blog.save();
    res.status(201).json(result);
  },
];

export const getAllBlogs = async (req: Request, res: Response) => {
  const blogs = await Blog.find({}).populate({
    path: 'user',
    select: 'username',
  });
  res.json(blogs);
};

export const getOneBlog = async (req: Request, res: Response) => {
  const id = req.params.id;
  const blog = await Blog.findById(id).populate({
    path: 'user',
    select: 'username',
  });
  if (!blog) return res.status(400).json({ message: 'Blog post not found' });
  blog.title = he.decode(blog.title);
  blog.content = he.decode(blog.content);
  res.json(blog);
};

export const deleteBlog = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const blog = await Blog.findById(id).exec();
  if (!blog) return res.status(400).json({ message: 'Blog post not found' });
  // blog.user.toString() is the _id of user from mongo
  if (blog.user.toString() !== user?._id)
    return res
      .status(403)
      .json({ message: 'Forbidden. You are not the original author.' });
  await Comment.deleteMany({ blog: id });
  await blog.deleteOne();
  res.json({ message: `Blog [${blog.title}] has been deleted.` });
};

export const updateBlog = [
  body('title', 'Title is required')
    .notEmpty()
    .unescape()
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Title must be at least 6 characters'),
  body('content', 'Content is required')
    .notEmpty()
    .unescape()
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Content must be at least 6 characters'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: errors.array({ onlyFirstError: true })[0].msg });
    }

    const id = req.params.id;
    const user = req.user;
    const blog = await Blog.findById(id).exec();
    if (!blog) return res.status(400).json({ message: 'Blog post not found' });
    if (blog.user.toString() !== user?._id)
      return res
        .status(403)
        .json({ message: 'Forbidden. You are not the original author.' });
    const { title, content, published } = req.body;
    const update = { title, content, published };
    await Blog.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    res.status(202).json({ message: `Blog [${blog.title}] has been updated.` });
  },
];

export const getProfileBlogs = async (req: Request, res: Response) => {
  const user = req.user;
  const blogs = await Blog.find({ user: user?._id }).populate({
    path: 'user',
    select: 'username',
  });

  for (const blog of blogs) {
    blog.title = he.decode(blog.title);
    blog.content = he.decode(blog.content);
  }

  res.json(blogs);
};

export const getRecentBlogs = async (req: Request, res: Response) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(6).populate({
    path: 'user',
    select: 'username',
  });

  for (const blog of blogs) {
    blog.title = he.decode(blog.title);
    blog.content = he.decode(blog.content);
  }

  res.json(blogs);
};
