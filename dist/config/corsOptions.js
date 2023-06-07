"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const config_1 = require("./config");
const allowedOrigins = [
    `https://localhost:${config_1.PORT}`,
    'https://muni-api.onrender.com/',
    'https://muni-9n97.onrender.com',
];
exports.corsOptions = {
    origin: allowedOrigins,
    credentials: true,
};
//# sourceMappingURL=corsOptions.js.map