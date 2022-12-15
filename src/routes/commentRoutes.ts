import express from 'express';
import {
  createComment,
  getAllComments,
} from '../controllers/commentController';
import passport from 'passport';

const commentRouter = express.Router();

commentRouter.get('/', getAllComments);

commentRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  createComment
);

export default commentRouter;
