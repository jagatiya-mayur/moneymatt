"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newQueryDto = void 0;
const express_validator_1 = require("express-validator");
exports.newQueryDto = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Invalid Email!")
        .normalizeEmail({ gmail_remove_dots: false }),
    (0, express_validator_1.body)("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),
    (0, express_validator_1.body)("query")
        .isString().withMessage("Invalid query")
        .notEmpty().withMessage("Invalid query!")
];
//# sourceMappingURL=queries.dto.js.map