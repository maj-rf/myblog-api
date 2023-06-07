"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentBlogs = exports.getProfileBlogs = exports.updateBlog = exports.deleteBlog = exports.getOneBlog = exports.getAllBlogs = exports.createBlog = void 0;
const express_validator_1 = require("express-validator");
const blog_1 = require("../models/blog");
const comment_1 = require("../models/comment");
const he_1 = __importDefault(require("he"));
exports.createBlog = [
    (0, express_validator_1.body)('title', 'Title is required')
        .notEmpty()
        .trim()
        .escape()
        .isLength({ min: 6 })
        .withMessage('Title must be at least 6 characters'),
    (0, express_validator_1.body)('content', 'Content is required')
        .notEmpty()
        .trim()
        .escape()
        .isLength({ min: 6 })
        .withMessage('Content must be at least 6 characters'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: errors.array({ onlyFirstError: true })[0].msg });
        }
        const { title, content, published } = req.body;
        const user = req.user;
        const blog = new blog_1.Blog({
            title,
            content,
            user: user === null || user === void 0 ? void 0 : user._id,
            published: published || false,
            comments: [],
            tags: [],
        });
        const result = yield blog.save();
        res.status(201).json(result);
    }),
];
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blog_1.Blog.find({}).populate({
        path: 'user',
        select: 'username',
    });
    res.json(blogs);
});
exports.getAllBlogs = getAllBlogs;
const getOneBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const blog = yield blog_1.Blog.findById(id).populate({
        path: 'user',
        select: 'username',
    });
    if (!blog)
        return res.status(400).json({ message: 'Blog post not found' });
    blog.title = he_1.default.decode(blog.title);
    blog.content = he_1.default.decode(blog.content);
    res.json(blog);
});
exports.getOneBlog = getOneBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = req.user;
    const blog = yield blog_1.Blog.findById(id).exec();
    if (!blog)
        return res.status(400).json({ message: 'Blog post not found' });
    // blog.user.toString() is the _id of user from mongo
    if (blog.user.toString() !== (user === null || user === void 0 ? void 0 : user._id))
        return res
            .status(403)
            .json({ message: 'Forbidden. You are not the original author.' });
    yield comment_1.Comment.deleteMany({ blog: id });
    yield blog.deleteOne();
    res.json({ message: `Blog [${blog.title}] has been deleted.` });
});
exports.deleteBlog = deleteBlog;
exports.updateBlog = [
    (0, express_validator_1.body)('title', 'Title is required')
        .notEmpty()
        .unescape()
        .trim()
        .escape()
        .isLength({ min: 6 })
        .withMessage('Title must be at least 6 characters'),
    (0, express_validator_1.body)('content', 'Content is required')
        .notEmpty()
        .unescape()
        .trim()
        .escape()
        .isLength({ min: 6 })
        .withMessage('Content must be at least 6 characters'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ message: errors.array({ onlyFirstError: true })[0].msg });
        }
        const id = req.params.id;
        const user = req.user;
        const blog = yield blog_1.Blog.findById(id).exec();
        if (!blog)
            return res.status(400).json({ message: 'Blog post not found' });
        if (blog.user.toString() !== (user === null || user === void 0 ? void 0 : user._id))
            return res
                .status(403)
                .json({ message: 'Forbidden. You are not the original author.' });
        const { title, content, published } = req.body;
        const update = { title, content, published };
        yield blog_1.Blog.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
            context: 'query',
        });
        res.status(202).json({ message: `Blog [${blog.title}] has been updated.` });
    }),
];
const getProfileBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const blogs = yield blog_1.Blog.find({ user: user === null || user === void 0 ? void 0 : user._id }).populate({
        path: 'user',
        select: 'username',
    });
    for (const blog of blogs) {
        blog.title = he_1.default.decode(blog.title);
        blog.content = he_1.default.decode(blog.content);
    }
    res.json(blogs);
});
exports.getProfileBlogs = getProfileBlogs;
const getRecentBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blog_1.Blog.find({ published: true })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate({
        path: 'user',
        select: 'username',
    });
    for (const blog of blogs) {
        blog.title = he_1.default.decode(blog.title);
        blog.content = he_1.default.decode(blog.content);
    }
    res.json(blogs);
});
exports.getRecentBlogs = getRecentBlogs;
//# sourceMappingURL=blogController.js.map