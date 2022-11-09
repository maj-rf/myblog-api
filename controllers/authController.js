const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

// User Signup POST
exports.signup = [
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
    passport.authenticate('signup', { session: false }, (err, user, info) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({
          username: req.body.username,
          errors: errors.array(),
        });
      }
      if (err) return next(err);
      res.json({ message: 'Successful account registration!', user: req.user });
    })(req, res, next);
  },
];

// User Login POST
exports.login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
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

exports.logout = function (req, res) {
  req.logout;
  res.redirect('/');
};
