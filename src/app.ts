import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import * as logger from './utils/logger';
import { MONGO_URI } from './config/config';
import * as middleware from './utils/middleware';

logger.info(`connecting to: ${MONGO_URI}`);

mongoose
  .connect(`${MONGO_URI}`)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error(`error connecting to MongoDB: ${error.message}`);
  });

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

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
