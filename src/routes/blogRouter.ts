import express from 'express';
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getOneBlog,
  updateBlog,
} from '../controllers/blogController';
export const blogRouter = express.Router();

blogRouter.get('/', getAllBlogs);

blogRouter.post('/', createBlog);

blogRouter.get('/:id', getOneBlog);

blogRouter.delete('/:id', deleteBlog);

blogRouter.put('/:id', updateBlog);
