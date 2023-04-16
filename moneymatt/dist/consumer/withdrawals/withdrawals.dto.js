"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWithraw = exports.withdrawBodyDto = void 0;
const express_validator_1 = require("express-validator");
const globalConst_1 = require("../../utils/globalConst");
exports.withdrawBodyDto = [
    (0, express_validator_1.body)("upiId")
        .isString().withMessage("Invalid upiId")
        .notEmpty().withMessage("UpiId required!"),
    (0, express_validator_1.body)("amount")
        .isNumeric().withMessage("Invalid amount!")
        .toInt(),
    (0, express_validator_1.body)("date")
        .isString().withMessage("Invalid date!")
        .trim()
        .notEmpty().withMessage("Date required!"),
];
exports.verifyWithraw = [
    (0, express_validator_1.body)("withdrawId")
        .isMongoId().withMessage("Invalid withdrawId!"),
    (0, express_validator_1.body)("userId")
        .isMongoId().withMessage("Invalid userId!"),
    (0, express_validator_1.body)("status")
        .isIn([
        globalConst_1.withdrawStatus.failed,
        globalConst_1.withdrawStatus.success
    ]).withMessage("Invalid status")
];
//# sourceMappingURL=withdrawals.dto.js.map