"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.info = void 0;
const info = (params) => {
    if (process.env.NODE_ENV === 'test')
        return;
    console.log(params);
};
exports.info = info;
const error = (params) => {
    if (process.env.NODE_ENV === 'test')
        return;
    console.error(params);
};
exports.error = error;
//# sourceMappingURL=logger.js.map