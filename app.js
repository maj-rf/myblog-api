const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const passport = require('passport');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();
const mongoInitialize = require('./config/mongoConfig');
const passportInitialize = require('./config/passportConfig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// MongoDB
const mongoose = require('mongoose');
mongoInitialize(mongoose);

// Passport + JWT
passportInitialize(passport);
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
