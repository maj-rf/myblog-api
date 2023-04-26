import express from 'express';
import {
  createCommentForThisBlog,
  getAllCommentsForThisBlog,
} from '../controllers/commentController';

export const commentRouter = express.Router();

commentRouter.get('/:id', getAllCommentsForThisBlog);

commentRouter.post('/:id', createCommentForThisBlog);
