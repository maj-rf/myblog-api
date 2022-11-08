const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const mongoInitialize = require('./config/mongoConfig');

// MongoDB
const mongoose = require('mongoose');
mongoInitialize(mongoose);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

console.log('hello');

app.listen('3001', () => {
  console.log('Server is running at port: 3000');
});

module.exports = app;
