"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const middleware_1 = require("../middlewares/middleware");
exports.commentRouter = express_1.default.Router();
exports.commentRouter.get('/recent', commentController_1.getRecentComments);
exports.commentRouter.get('/:id', commentController_1.getAllCommentsForThisBlog);
exports.commentRouter.post('/:id', middleware_1.verifyJWT, commentController_1.createCommentForThisBlog);
//# sourceMappingURL=commentRouter.js.map