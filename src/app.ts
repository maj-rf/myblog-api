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

// MONGODB CONNECTION
connectDB();

// MIDDLEWARES
const app = express();
morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(
  cors({
    credentials: true,
    origin: `http://localhost:${process.env.PORT}`,
  }),
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

//API ROUTES
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'hello' });
});

app.use('/api/blogs', middleware.verifyJWT, blogRouter);
app.use('/api/users', middleware.verifyJWT, userRouter);
app.use('/api/comments', middleware.verifyJWT, commentRouter);
app.use('/api/auth', authRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
