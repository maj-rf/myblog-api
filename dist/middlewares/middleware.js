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
exports.verifyJWT = exports.errorHandler = exports.unknownEndpoint = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const unknownEndpoint = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.unknownEndpoint = unknownEndpoint;
const errorHandler = (error, _req, res, next) => {
    console.log(error.stack);
    if (error.name === 'CastError')
        return res
            .status(400)
            .json({ message: 'Malformatted ID [blogId, commentId, userID]' });
    const status = res.statusCode != 200 ? res.statusCode : 500;
    res.status(status).json({ message: error.message });
    next();
};
exports.errorHandler = errorHandler;
const verifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    if (!token)
        return res.status(401).json({ message: 'Unauthorized. No JWT Token' });
    const decoded = jsonwebtoken_1.default.verify(token, `${config_1.ACCESS_TOKEN_SECRET}`);
    if (!decoded)
        return res.status(403).json({ message: 'Invalid Token' });
    const user = {
        _id: decoded.id,
        username: decoded.username,
        email: decoded.email,
    };
    req.user = user;
    next();
});
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=middleware.js.map