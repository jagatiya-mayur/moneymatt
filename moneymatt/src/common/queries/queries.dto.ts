import { body, query } from "express-validator";
import { gameTypes } from "../../utils/globalConst";

export const newQueryDto = [
    body("email")
        .isEmail()
        .withMessage("Invalid Email!")
        .normalizeEmail({ gmail_remove_dots: false }),

    body("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),

    body("query")
        .isString().withMessage("Invalid query")
        .notEmpty().withMessage("Invalid query!")
];