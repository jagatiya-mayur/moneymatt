import { body } from "express-validator";

export const amountsDto = [
    body("minAmount")
        .isNumeric().withMessage("Invalid min amount!")
        .toInt(),

    body("earnAmount")
        .isNumeric().withMessage("Invalid earn amount!")
        .toInt(),
];