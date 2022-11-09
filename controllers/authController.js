const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// User Signup POST
exports.post_signup = [
  body('username', 'Username is required')
    .trim()
    .escape()
    .custom(async (username) => {
      try {
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
          throw new Error('Username already in use');
        }
      } catch (err) {
        throw new Error(err);
      }
    }),
  body('email', 'Email is required')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid Email')
    .custom(async (email) => {
      try {
        const usedEmail = await User.findOne({ email: email });
        if (usedEmail) throw new Error('Email is already in use.');
      } catch (err) {
        throw new Error(err);
      }
    }),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage('Minimum length of 6 characters'),
  body('confirm-pass')
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return false;
      }
      return true;
    })
    .withMessage('Passwords do not match'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        });
        newUser.save((err) => {
          if (err) return next(err);
          res.status(200).json({ message: 'Account created!' });
        });
      });
    }
  },
];

// User Login POST
exports.post_login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(400).json({
          message: info,
          user: user,
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) res.send(err);
        const body = {
          _id: user._id,
          username: user.username,
          email: user.email,
        };
        const token = jwt.sign({ user: body }, process.env.SECRET_KEY, {
          expiresIn: '2d',
        });

        return res.json({
          token,
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res);
};

exports.post_logout = function (req, res) {
  req.logout;
  res.redirect('/');
};
