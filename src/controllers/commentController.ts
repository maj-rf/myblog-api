import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Comment } from '../models/comment';
import { Blog } from '../models/blog';
export const getAllCommentsForThisBlog = async (
  req: Request,
  res: Response,
) => {
  const blogId = req.params.id;
  const comments = await Comment.find({ blog: blogId }).populate({
    path: 'user',
    select: 'username',
  });
  if (!comments)
    return res
      .status(400)
      .json({ message: 'Blog post not found. Cannot get comments' });
  res.json(comments);
};

export const createCommentForThisBlog = [
  body('comment_content', 'Comment content is required')
    .notEmpty()
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage('Comment must be at least 2 characters long'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: errors.array({ onlyFirstError: true })[0].msg });
    }

    const blog = await Blog.findById(req.params.id).exec();
    if (!blog)
      return res
        .status(400)
        .json({ message: 'Blog post not found. Cannot get comments' });
    const { comment_content } = req.body;
    const user = req.user;

    const comment = new Comment({
      content: comment_content,
      user: user?._id,
      blog: req.params.id,
    });

    const result = await comment.save();
    res.status(201).json(result);
  },
];

export const getRecentComments = async (req: Request, res: Response) => {
  const comments = await Comment.find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .populate({
      path: 'user',
      select: 'username',
    })
    .populate({
      path: 'blog',
      select: 'title',
    });

  if (!comments)
    return res
      .status(400)
      .json({ message: 'Server error. Cannot get comments' });
  res.json(comments);
};
