import { body, query } from "express-validator";
import { yantras } from "../../utils/globalConst";

export const newRecordBodyDto = [
    body("periodId")
        .isMongoId().withMessage("Invalid Game Type!"),

    body("contractMoney")
        .isNumeric().withMessage("Invalid Contract Money!"),

    body("yantra")
        .isIn(yantras).withMessage("Invalid yantra!")
];

export const recordQueryDto = [
    query("page")
        .isNumeric().withMessage("Invalid page!")
        .toInt()
];