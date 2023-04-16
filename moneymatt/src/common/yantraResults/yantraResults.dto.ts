import { body, query } from "express-validator";
import { yantras } from "../../utils/globalConst";

export const setResultBodyDto = [
    body("yantra")
        .isIn(yantras)
        .notEmpty().withMessage("Invalid game!"),

    body("period")
        .isNumeric().withMessage("Invalid period!")
        .toInt()
];

export const resultQueryDto = [
    query("page")
        .isNumeric().withMessage("Invalid page!")
        .toInt()
];