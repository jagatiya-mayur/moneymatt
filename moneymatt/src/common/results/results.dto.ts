import { body, query } from "express-validator";
import { gameTypes } from "../../utils/globalConst";

export const resultQueryDto = [
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

export const setResultBodyDto = [
    body("gameType")
        .isIn([
            gameTypes.Bcone,
            gameTypes.Emerd,
            gameTypes.Parity,
            gameTypes.Sapre
        ])
        .notEmpty().withMessage("Invalid game!"),

    body("period")
        .isNumeric().withMessage("Invalid period!")
        .toInt(),

    body("number")
        .isNumeric().withMessage("Invalid number!")
        .toInt()
]