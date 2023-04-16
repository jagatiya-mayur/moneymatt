"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setResultBodyDto = exports.resultQueryDto = void 0;
const express_validator_1 = require("express-validator");
const globalConst_1 = require("../../utils/globalConst");
exports.resultQueryDto = [
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
exports.setResultBodyDto = [
    (0, express_validator_1.body)("gameType")
        .isIn([
        globalConst_1.gameTypes.Bcone,
        globalConst_1.gameTypes.Emerd,
        globalConst_1.gameTypes.Parity,
        globalConst_1.gameTypes.Sapre
    ])
        .notEmpty().withMessage("Invalid game!"),
    (0, express_validator_1.body)("period")
        .isNumeric().withMessage("Invalid period!")
        .toInt(),
    (0, express_validator_1.body)("number")
        .isNumeric().withMessage("Invalid number!")
        .toInt()
];
//# sourceMappingURL=results.dto.js.map