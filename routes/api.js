const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');

// index
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the blog',
  });
});

// auth
router.post('/signup', authController.post_signup);
router.post('/login', authController.post_login);
router.post('/logout', authController.post_logout);

// posts
router.get('/posts/all', postController.get_posts);
router.get('/posts/all/:username', postController.get_user_posts);
router.get('/posts/post/:postId', postController.get_post_detail);
router.post('/posts/create', postController.create_post);

module.exports = router;
