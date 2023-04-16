"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utils/logger");
const errorMiddleware = (error, req, res, next) => {
    try {
        const status = error.status || 500;
        const message = error.message || 'Something went wrong';
        logger_1.logger.error(`[${req.method}] ${req.path} ===> StatusCode:: ${status}, Message:: ${message}, \n Stack:: ${error.stack || 'something went wrong'}`);
        return res.status(status).json({ statusCode: status, hasError: true, message, stack: error.stack || "something went wrong" });
    }
    catch (error) {
        next(error);
    }
};
exports.default = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map