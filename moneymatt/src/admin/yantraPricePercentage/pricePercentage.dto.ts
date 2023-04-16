import { body } from "express-validator";

export const percentageDto = [
    body("giveAwayPer")
        .isNumeric().withMessage("Invalid Per!")
];