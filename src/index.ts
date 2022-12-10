import { init } from './config/mongoConfig';
import express, { Request, Response } from 'express';

const app = express();

//mongoDB
init(app);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});
