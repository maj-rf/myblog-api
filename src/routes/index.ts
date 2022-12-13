import express, { Request, Response } from 'express';
const indexRouter = express.Router();

//index
indexRouter.get('/', (req: Request, res: Response) => {
  res.redirect('/api');
});

indexRouter.get('/api', (req: Request, res: Response) => {
  res.send({ message: 'welcome to the api' });
});

export default indexRouter;
