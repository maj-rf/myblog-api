import { init } from './config/mongoConfig';
import express, { Request, Response } from 'express';

const app = express();
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
//mongoDB
init(app);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/api', apiRouter);
