"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const middleware_1 = require("../middlewares/middleware");
exports.authRouter = express_1.default.Router();
exports.authRouter.post('/login', authController_1.login);
exports.authRouter.post('/register', authController_1.register);
exports.authRouter.post('/logout', middleware_1.verifyJWT, authController_1.logout);
//# sourceMappingURL=authRouter.js.map