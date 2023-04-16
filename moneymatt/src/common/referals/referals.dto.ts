import { body, query } from "express-validator";

export const queryDto = [
    query("phone")
        .isNumeric().withMessage("Invalid Phone")
        .notEmpty().withMessage("Phone required!")
]