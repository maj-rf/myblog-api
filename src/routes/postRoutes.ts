import express, { Router } from 'express';
import {
  getAllPosts,
  createPost,
  getCurrentUserPosts,
  deletePost,
  updatePost,
} from '../controllers/postController';
import passport from 'passport';
const postRouter = express.Router();

// GET All posts
postRouter.get('/all', getAllPosts);

// GET All User posts
postRouter.get('/all/:username', getCurrentUserPosts);

// CREATE Post
postRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  createPost
);

// DELETE Post
postRouter.delete(
  '/:id/delete',
  passport.authenticate('jwt', { session: false }),
  deletePost
);

// Update Post
postRouter.put(
  '/:id/update',
  passport.authenticate('jwt', { session: false }),
  updatePost
);

export default postRouter;
