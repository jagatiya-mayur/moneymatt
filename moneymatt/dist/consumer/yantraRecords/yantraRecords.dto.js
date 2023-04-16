"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordQueryDto = exports.newRecordBodyDto = void 0;
const express_validator_1 = require("express-validator");
const globalConst_1 = require("../../utils/globalConst");
exports.newRecordBodyDto = [
    (0, express_validator_1.body)("periodId")
        .isMongoId().withMessage("Invalid Game Type!"),
    (0, express_validator_1.body)("contractMoney")
        .isNumeric().withMessage("Invalid Contract Money!"),
    (0, express_validator_1.body)("yantra")
        .isIn(globalConst_1.yantras).withMessage("Invalid yantra!")
];
exports.recordQueryDto = [
    (0, express_validator_1.query)("page")
        .isNumeric().withMessage("Invalid page!")
        .toInt()
];
//# sourceMappingURL=yantraRecords.dto.js.map