import { body, query } from "express-validator";
import { colors, gameTypes } from "../../utils/globalConst";

export const newRecordBodyDto = [
    body("periodId")
        .isMongoId().withMessage("Invalid Game Type!"),

    body("contractMoney")
        .isNumeric().withMessage("Invalid Contract Money!"),

    body("number")
        .optional({ nullable: true })
        .isInt({ min: 0, max: 9 }).withMessage("Invalid Number!"),

    body("color")
        .optional({ nullable: true })
        .isIn([
            colors.green,
            colors.red,
            colors.violet
        ]).withMessage("Invalid color!")
];

export const recordQueryDto = [
    query("game")
        .isIn([
            gameTypes.Bcone,
            gameTypes.Emerd,
            gameTypes.Parity,
            gameTypes.Sapre
        ])
        .notEmpty().withMessage("Invalid game!"),

    query("page")
        .isNumeric().withMessage("Invalid page!")
        .toInt()
];