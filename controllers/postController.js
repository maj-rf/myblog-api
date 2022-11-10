const Post = require('../models/Post');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
// GET all Posts
exports.get_posts = async (req, res) => {
  try {
    const posts = await Post.find({ published: true })
      .sort({ createdAt: -1 })
      .populate('author')
      .populate('comments');
    return res.json(posts);
  } catch {
    return res.status(400).json({ error: 'Error getting posts' });
  }
};

// GET all User's Posts
exports.get_user_posts = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });
    return res.json(posts);
  } catch {
    return res.status(400).json({ error: 'Error getting posts' });
  }
};

exports.get_post_detail = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    return res.json({ post });
  } catch {
    return res.status(400).json({ error: 'Error getting posts' });
  }
};

// CREATE Post
exports.create_post = [
  body('title', 'Title is required')
    .trim()
    .isLength({ min: 6, max: 30 })
    .escape(),
  body('content', 'Content is required').trim().isLength({ min: 6 }).escape(),
  body('published', 'Publish Status is required').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    } else {
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        published: req.body.published,
        author: req.body.author,
      });

      post.save((err) => {
        if (err) {
          return next(err);
        }
        res.json({ post });
      });
    }
  },
];

// DELETE Post

// UPDATE Post
