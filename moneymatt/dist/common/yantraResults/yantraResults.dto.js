"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultQueryDto = exports.setResultBodyDto = void 0;
const express_validator_1 = require("express-validator");
const globalConst_1 = require("../../utils/globalConst");
exports.setResultBodyDto = [
    (0, express_validator_1.body)("yantra")
        .isIn(globalConst_1.yantras)
        .notEmpty().withMessage("Invalid game!"),
    (0, express_validator_1.body)("period")
        .isNumeric().withMessage("Invalid period!")
        .toInt()
];
exports.resultQueryDto = [
    (0, express_validator_1.query)("page")
        .isNumeric().withMessage("Invalid page!")
        .toInt()
];
//# sourceMappingURL=yantraResults.dto.js.map