"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryDto = void 0;
const express_validator_1 = require("express-validator");
exports.queryDto = [
    (0, express_validator_1.query)("phone")
        .isNumeric().withMessage("Invalid Phone")
        .notEmpty().withMessage("Phone required!")
];
//# sourceMappingURL=referals.dto.js.map