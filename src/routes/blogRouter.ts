import express from 'express';
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getOneBlog,
  getProfileBlogs,
  getRecentBlogs,
  updateBlog,
} from '../controllers/blogController';
import { verifyJWT } from '../middlewares/middleware';
export const blogRouter = express.Router();

blogRouter.get('/all', getAllBlogs);

blogRouter.get('/recent', getRecentBlogs);

blogRouter.get('/profile', verifyJWT, getProfileBlogs);

blogRouter.post('/blog', verifyJWT, createBlog);

blogRouter.get('/blog/:id', getOneBlog);

blogRouter.delete('/blog/:id', verifyJWT, deleteBlog);

blogRouter.put('/blog/:id', verifyJWT, updateBlog);
