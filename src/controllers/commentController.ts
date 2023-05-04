import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { CustomRequest } from '../types/types';
import { Blog } from '../models/blog';
import { Comment } from '../models/comment';
import { PublicUser, IUser } from '../types/types';
export const getAllCommentsForThisBlog = async (
  req: Request,
  res: Response,
) => {
  const blogId = req.params.id;
  const comments = await Comment.find({ blog: blogId }).populate({
    path: 'user',
    select: 'username',
  });
  res.json(comments);
};

export const createCommentForThisBlog = [
  body('comment_content', 'Comment content is required')
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage('Comment must be at least 2 characters long'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const { comment_content } = req.body;
    const blogId = req.params.id;
    const token = (req as CustomRequest).token as IUser;
    const user: PublicUser = { username: token.username, _id: token.id };
    const blog = await Blog.findById(blogId);
    const comment = new Comment({
      content: comment_content,
      user,
      blog,
    });
    if (!blog) return res.status(400).json({ error: 'Blog does not exist.' });
    const result = await comment.save();
    result.depopulate('blog');
    blog.comments = blog.comments.concat(comment._id);
    await blog.save();
    res.json(result);
  },
];
