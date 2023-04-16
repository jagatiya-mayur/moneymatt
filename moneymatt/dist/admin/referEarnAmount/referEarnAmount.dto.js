"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amountsDto = void 0;
const express_validator_1 = require("express-validator");
exports.amountsDto = [
    (0, express_validator_1.body)("minAmount")
        .isNumeric().withMessage("Invalid min amount!")
        .toInt(),
    (0, express_validator_1.body)("earnAmount")
        .isNumeric().withMessage("Invalid earn amount!")
        .toInt(),
];
//# sourceMappingURL=referEarnAmount.dto.js.map