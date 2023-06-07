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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.getAllUsers = void 0;
const user_1 = require("../models/user");
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.User.find({});
    res.json(users);
});
exports.getAllUsers = getAllUsers;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const currentUser = yield user_1.User.findById(user === null || user === void 0 ? void 0 : user._id);
    if (!currentUser)
        return res.status(400).json({ message: 'User not found' });
    res.json(currentUser);
});
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=userController.js.map