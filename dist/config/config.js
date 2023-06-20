"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUD_SECRET = exports.CLOUD_KEY = exports.CLOUD_NAME = exports.ACCESS_TOKEN_SECRET = exports.MONGO_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || '3003';
// Use test DB if running tests
exports.MONGO_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI;
// for JWTs
exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
// for Cloudinary
exports.CLOUD_NAME = process.env.CLOUD_NAME;
exports.CLOUD_KEY = process.env.CLOUD_KEY;
exports.CLOUD_SECRET = process.env.CLOUD_SECRET;
//# sourceMappingURL=config.js.map