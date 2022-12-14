import { delete_user, get_user_detail } from './../controllers/userController';
//import { getUserPost } from './../controllers/userController';
import express from 'express';
import passport from 'passport';

const userRouter = express.Router();

// GET User Profile and All Posts
userRouter.get(
  '/:id/posts',
  passport.authenticate('jwt', { session: false }),
  get_user_detail
);

// GET One User Post
// userRouter.get(
//   '/:id/posts/:postid',
//   passport.authenticate('jwt', { session: false }),
//   getUserPost
// );

// DELETE User and All Postss
userRouter.delete('/:id/delete', delete_user);
export default userRouter;
