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
    (0, express_validator_1.body)("number")
        .optional({ nullable: true })
        .isInt({ min: 0, max: 9 }).withMessage("Invalid Number!"),
    (0, express_validator_1.body)("color")
        .optional({ nullable: true })
        .isIn([
        globalConst_1.colors.green,
        globalConst_1.colors.red,
        globalConst_1.colors.violet
    ]).withMessage("Invalid color!")
];
exports.recordQueryDto = [
    (0, express_validator_1.query)("game")
        .isIn([
        globalConst_1.gameTypes.Bcone,
        globalConst_1.gameTypes.Emerd,
        globalConst_1.gameTypes.Parity,
        globalConst_1.gameTypes.Sapre
    ])
        .notEmpty().withMessage("Invalid game!"),
    (0, express_validator_1.query)("page")
        .isNumeric().withMessage("Invalid page!")
        .toInt()
];
//# sourceMappingURL=records.dto.js.map