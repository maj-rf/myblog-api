import express from 'express';
import { createBlog, getALLBlogs } from '../controllers/blogController';
export const blogRouter = express.Router();

blogRouter.get('/', getALLBlogs);

blogRouter.post('/', createBlog);
