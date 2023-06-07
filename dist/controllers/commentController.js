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
exports.getRecentComments = exports.createCommentForThisBlog = exports.getAllCommentsForThisBlog = void 0;
const express_validator_1 = require("express-validator");
const comment_1 = require("../models/comment");
const blog_1 = require("../models/blog");
const he_1 = __importDefault(require("he"));
const getAllCommentsForThisBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const comments = yield comment_1.Comment.find({ blog: blogId }).populate({
        path: 'user',
        select: 'username',
    });
    if (!comments)
        return res
            .status(400)
            .json({ message: 'Blog post not found. Cannot get comments' });
    for (const comment of comments) {
        comment.content = he_1.default.decode(comment.content);
    }
    res.json(comments);
});
exports.getAllCommentsForThisBlog = getAllCommentsForThisBlog;
exports.createCommentForThisBlog = [
    (0, express_validator_1.body)('comment_content', 'Comment content is required')
        .notEmpty()
        .trim()
        .escape()
        .isLength({ min: 2 })
        .withMessage('Comment must be at least 2 characters long'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ message: errors.array({ onlyFirstError: true })[0].msg });
        }
        const blog = yield blog_1.Blog.findById(req.params.id).exec();
        if (!blog)
            return res
                .status(400)
                .json({ message: 'Blog post not found. Cannot get comments' });
        const { comment_content } = req.body;
        const user = req.user;
        const comment = new comment_1.Comment({
            content: comment_content,
            user: user === null || user === void 0 ? void 0 : user._id,
            blog: req.params.id,
        });
        const result = yield comment.save();
        res.status(201).json(result);
    }),
];
const getRecentComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield comment_1.Comment.find({})
        .sort({ createdAt: -1 })
        .limit(6)
        .populate({
        path: 'user',
        select: 'username',
    })
        .populate({
        path: 'blog',
        select: 'title published',
        match: { published: true },
    });
    const newComments = comments.filter((comment) => comment.blog !== null);
    if (!comments)
        return res
            .status(400)
            .json({ message: 'Server error. Cannot get comments' });
    for (const comment of newComments) {
        comment.content = he_1.default.decode(comment.content);
    }
    res.json(newComments);
});
exports.getRecentComments = getRecentComments;
//# sourceMappingURL=commentController.js.map