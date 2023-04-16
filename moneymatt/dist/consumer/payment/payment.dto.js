"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentDto = exports.reqPaymentDto = void 0;
const express_validator_1 = require("express-validator");
const globalConst_1 = require("../../utils/globalConst");
exports.reqPaymentDto = [
    (0, express_validator_1.body)("referenceId")
        .isString().withMessage("Invalid ReferenceId!")
        .trim()
        .notEmpty().withMessage("ReferenceId required!"),
    (0, express_validator_1.body)("date")
        .isString().withMessage("Invalid date!")
        .trim()
        .notEmpty().withMessage("Date required!"),
    (0, express_validator_1.body)("amount")
        .isNumeric().withMessage("Invalid amount")
];
exports.verifyPaymentDto = [
    (0, express_validator_1.body)("userId")
        .isMongoId().withMessage("Invalid userId!"),
    (0, express_validator_1.body)("paymentId")
        .isMongoId().withMessage("Invalid paymentId!"),
    (0, express_validator_1.body)("status")
        .isIn([
        globalConst_1.paymentStatus.failed,
        globalConst_1.paymentStatus.success
    ]).withMessage("Invalid Status!")
];
//# sourceMappingURL=payment.dto.js.map