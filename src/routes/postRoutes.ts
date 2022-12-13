import express, { Router } from 'express';
import { getAllPosts, createPost } from '../controllers/postController';
import passport from 'passport';
const postRouter = express.Router();

// GET All posts
postRouter.get('/', getAllPosts);

// CREATE Post
postRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  createPost
);

export default postRouter;
