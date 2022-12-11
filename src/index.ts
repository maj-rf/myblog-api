import { init } from './config/mongoConfig';
import { passportInit } from './config/passportConfig';
import express from 'express';
import passport from 'passport';

const app = express();
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//mongoDB & passport
init(app);
passportInit(passport);
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/api', apiRouter);
