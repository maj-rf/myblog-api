"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const middleware = __importStar(require("./middlewares/middleware"));
const userRouter_1 = require("./routes/userRouter");
const blogRouter_1 = require("./routes/blogRouter");
const commentRouter_1 = require("./routes/commentRouter");
const authRouter_1 = require("./routes/authRouter");
const db_1 = require("./config/db");
const path_1 = __importDefault(require("path"));
// MONGODB CONNECTION
(0, db_1.connectDB)();
// MIDDLEWARES
const app = (0, express_1.default)();
morgan_1.default.token('body', (req) => JSON.stringify(req.body));
if (process.env.NODE_ENV === 'production') {
    const __dirname = path_1.default.resolve();
    app.use(express_1.default.static(path_1.default.join(__dirname, 'dist')));
    app.get('*', (_req, res) => res.sendFile(path_1.default.resolve(__dirname, 'dist', 'index.html')));
}
else {
    app.get('/', (req, res) => {
        res.send('API is running....');
    });
}
app.use((0, cors_1.default)({
    credentials: true,
    origin: `http://localhost:${process.env.PORT}`,
}));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms :body'));
//API ROUTES
app.use('/api/blogs', blogRouter_1.blogRouter);
app.use('/api/users', middleware.verifyJWT, userRouter_1.userRouter);
app.use('/api/comments', commentRouter_1.commentRouter);
app.use('/api/auth', authRouter_1.authRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map