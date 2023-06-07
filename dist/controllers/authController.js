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
exports.logout = exports.register = exports.login = void 0;
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_utils_1 = require("../utils/jwt.utils");
const express_validator_1 = require("express-validator");
exports.login = [
    (0, express_validator_1.body)('email', 'Email is required')
        .notEmpty()
        .trim()
        .escape()
        .normalizeEmail()
        .isEmail(),
    (0, express_validator_1.body)('password', 'Password is required')
        .notEmpty()
        .unescape()
        .trim()
        .escape(),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: errors.array({ onlyFirstError: true })[0].msg });
        }
        const { email, password } = req.body;
        const user = yield user_1.User.findOne({ email });
        const passwordCorrect = user
            ? yield bcrypt_1.default.compare(password, user.password)
            : false;
        if (!user) {
            return res.status(400).json({ message: 'Email does not exist' });
        }
        if (!passwordCorrect) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        const userForToken = {
            username: user.username,
            id: user._id,
            email: user.email,
        };
        (0, jwt_utils_1.signAccessToken)(res, userForToken);
        res
            .status(200)
            .json({ id: user._id, username: user.username, email: user.email });
    }),
];
exports.register = [
    (0, express_validator_1.body)('username', 'Username is required')
        .notEmpty()
        .trim()
        .escape()
        .isLength({ min: 6 })
        .withMessage('Username must be at least 6 characters'),
    (0, express_validator_1.body)('email', 'Email is required')
        .notEmpty()
        .trim()
        .escape()
        .normalizeEmail()
        .isEmail()
        .withMessage('Invalid email address.')
        .custom((mail) => __awaiter(void 0, void 0, void 0, function* () {
        const existingEmail = yield user_1.User.findOne({ email: mail });
        if (existingEmail) {
            throw new Error('Email is already in use');
        }
    })),
    (0, express_validator_1.body)('password', 'Password is required')
        .notEmpty()
        .unescape()
        .trim()
        .escape()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('confirm_pass')
        .trim()
        .escape()
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        if (value !== req.body.password)
            throw new Error('Passwords do not match');
    })),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: errors.array({ onlyFirstError: true })[0].msg });
        }
        const { username, email, password } = req.body;
        const saltRounds = 10;
        const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
        const user = new user_1.User({
            username,
            email,
            password: passwordHash,
        });
        yield user.save();
        const userForToken = {
            username: user.username,
            id: user._id,
            email: user.email,
        };
        (0, jwt_utils_1.signAccessToken)(res, userForToken);
        res
            .status(201)
            .json({ id: user._id, username: user.username, email: user.email });
    }),
];
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies.jwt)
        return res.status(401).json({ message: 'No JWT, Unauthorized' });
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ message: 'Succesfully Logged Out' });
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map