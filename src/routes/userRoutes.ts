import { getUserProfileAndPosts } from './../controllers/userController';
//import { getUserPost } from './../controllers/userController';
import express from 'express';
import passport from 'passport';

const userRouter = express.Router();

// GET User Profile and All Posts
userRouter.get(
  '/:id/posts',
  passport.authenticate('jwt', { session: false }),
  getUserProfileAndPosts
);

// GET One User Post
// userRouter.get(
//   '/:id/posts/:postid',
//   passport.authenticate('jwt', { session: false }),
//   getUserPost
// );

export default userRouter;
