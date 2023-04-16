"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.percentageDto = void 0;
const express_validator_1 = require("express-validator");
exports.percentageDto = [
    (0, express_validator_1.body)("giveAwayPer")
        .isNumeric().withMessage("Invalid Per!")
];
//# sourceMappingURL=pricePercentage.dto.js.map