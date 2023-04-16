"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountBodyDto = void 0;
const express_validator_1 = require("express-validator");
exports.accountBodyDto = [
    (0, express_validator_1.body)("accountNo")
        .optional()
        .isNumeric().withMessage("Invalild AccountNo")
        .toInt(),
    (0, express_validator_1.body)("ifscCode")
        .optional()
        .isString().withMessage("Invalild ifscCode")
        .trim()
        .notEmpty().withMessage("IfscCode should not be empty!"),
    (0, express_validator_1.body)("upiId")
        .optional()
        .isString().withMessage("Invalild upiId")
        .trim()
        .notEmpty().withMessage("upiId should not be empty!"),
    (0, express_validator_1.check)('upiQrCode')
        .optional()
        .custom((value, { req }) => {
        if (req.file) {
            return true;
        }
        else {
            return false;
        }
    })
        .withMessage('Upload upiQrCode Media!'),
];
//# sourceMappingURL=account.dto.js.map