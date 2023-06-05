import express from 'express';
import {
  createCommentForThisBlog,
  getAllCommentsForThisBlog,
  getRecentComments,
} from '../controllers/commentController';
import { verifyJWT } from '../middlewares/middleware';

export const commentRouter = express.Router();

commentRouter.get('/recent', getRecentComments);

commentRouter.get('/:id', getAllCommentsForThisBlog);

commentRouter.post('/:id', verifyJWT, createCommentForThisBlog);
