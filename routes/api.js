const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the blog',
  });
});

router.post('/signup', authController.post_signup);
router.post('/login', authController.post_login);
router.post('/logout', authController.post_logout);

module.exports = router;
