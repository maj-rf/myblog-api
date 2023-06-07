"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controllers/blogController");
const middleware_1 = require("../middlewares/middleware");
exports.blogRouter = express_1.default.Router();
exports.blogRouter.get('/all', blogController_1.getAllBlogs);
exports.blogRouter.get('/recent', blogController_1.getRecentBlogs);
exports.blogRouter.get('/profile', middleware_1.verifyJWT, blogController_1.getProfileBlogs);
exports.blogRouter.post('/blog', middleware_1.verifyJWT, blogController_1.createBlog);
exports.blogRouter.get('/blog/:id', blogController_1.getOneBlog);
exports.blogRouter.delete('/blog/:id', middleware_1.verifyJWT, blogController_1.deleteBlog);
exports.blogRouter.put('/blog/:id', middleware_1.verifyJWT, blogController_1.updateBlog);
//# sourceMappingURL=blogRouter.js.map