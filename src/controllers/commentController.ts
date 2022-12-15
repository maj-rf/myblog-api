import { TComment } from '../types/comment';
import { TUser } from '../types/user';
import { ExtendedRequest } from '../types/extReq';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import Comment from '../models/Comment';
import { QueryOptions } from 'mongoose';
import Post from '../models/Post';

export const getAllComments = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  Comment.find({ post: req.postId })
    .sort({ createdAt: 1 })
    .populate('author', 'username')
    .exec((err, comments: TComment[]) => {
      if (err) return next(err);
      res.json({ comments });
    });
};

export const createComment = [
  body('content', 'A comment is required')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Blog must not be empty')
    .escape(),
  (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).mapped();
    // If invalid
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    //If valid
    const reqUser = req.user as Pick<TUser, '_id' | 'username'>;
    const authorCredentials = { _id: reqUser._id, username: reqUser.username };
    const reqBody = req.body as Pick<TComment, 'content' | 'post'>;
    const newComment: TComment = new Comment({
      content: reqBody.content,
      author: authorCredentials,
      post: req.postId,
    });
    newComment.save((err) => {
      if (err) return next(err);
      const updateOption: QueryOptions & { rawResult: true } = {
        new: true,
        upsert: true,
        rawResult: true,
      };

      // Add Comment to specific Post
      Post.findByIdAndUpdate(
        req.postId,
        { $push: { comments: newComment } },
        updateOption,
        (updateErr, updatedPost) => {
          if (updateErr) return next(updateErr);
          // populate comments
          Post.findById(req.postId)
            .populate({
              path: 'comments',
              populate: { path: 'author', select: 'username' },
            })
            .exec((postErr, post) => {
              if (postErr) return next(postErr);
              res.json({ post });
            });
        }
      );
    });
  },
];
