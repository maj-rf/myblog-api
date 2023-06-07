"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const signAccessToken = (res, payload) => {
    const token = jsonwebtoken_1.default.sign(payload, `${config_1.ACCESS_TOKEN_SECRET}`, {
        expiresIn: '30d',
    });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
    });
};
exports.signAccessToken = signAccessToken;
//# sourceMappingURL=jwt.utils.js.map