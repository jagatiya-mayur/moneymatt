"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const validationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const error = errors['errors'].map((error) => {
            return error["msg"];
        });
        return next(new HttpException_1.default(400, error.join(", ")));
    }
    next();
};
exports.default = validationMiddleware;
//# sourceMappingURL=validation.middleware.js.map