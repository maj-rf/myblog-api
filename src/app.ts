import express, { Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import * as middleware from './middlewares/middleware';
import { userRouter } from './routes/userRouter';
import { blogRouter } from './routes/blogRouter';
import { commentRouter } from './routes/commentRouter';
import { authRouter } from './routes/authRouter';
import { connectDB } from './config/db';
import { corsOptions } from './config/corsOptions';
import path from 'path';
// MONGODB CONNECTION
connectDB();

// MIDDLEWARES
const app = express();
morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(cors(corsOptions));
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, './dist')));

  app.get('*', (_req: Request, res: Response) =>
    res.sendFile(path.resolve(__dirname, './dist', 'index.html')),
  );
} else {
  app.get('/', (_req, res) => {
    res.json({ message: 'welcome to muni' });
  });
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

//API ROUTES
app.use('/api/blogs', blogRouter);
app.use('/api/users', middleware.verifyJWT, userRouter);
app.use('/api/comments', commentRouter);
app.use('/api/auth', authRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
