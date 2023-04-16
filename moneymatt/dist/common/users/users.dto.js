"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassBodyDto = void 0;
const express_validator_1 = require("express-validator");
exports.resetPassBodyDto = [
    (0, express_validator_1.body)("currentPassword")
        .isString()
        .notEmpty().withMessage("Invalid Current Password!")
        .trim(),
    (0, express_validator_1.body)("newPassword")
        .isString()
        .notEmpty().withMessage("Invalid New Password!")
        .trim()
];
//# sourceMappingURL=users.dto.js.map