import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
morgan.token('body', (req: Request) => JSON.stringify(req.body));

app.use(cors());
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'hello' });
});

export default app;
