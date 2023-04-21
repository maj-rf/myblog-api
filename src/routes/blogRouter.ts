import express, { Request, Response } from 'express';
export const blogRouter = express.Router();

blogRouter.get('/', (_req: Request, res: Response) => {
  res.send('hello from blog route');
});
