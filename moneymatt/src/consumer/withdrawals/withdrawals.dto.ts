import { body } from "express-validator";
import { withdrawStatus } from "../../utils/globalConst";

export const withdrawBodyDto = [
    body("upiId")
        .isString().withMessage("Invalid upiId")
        .notEmpty().withMessage("UpiId required!"),

    body("amount")
        .isNumeric().withMessage("Invalid amount!")
        .toInt(),
    
    body("date")
        .isString().withMessage("Invalid date!")
        .trim()
        .notEmpty().withMessage("Date required!"),
];

export const verifyWithraw = [
    body("withdrawId")
        .isMongoId().withMessage("Invalid withdrawId!"),

    body("userId")
        .isMongoId().withMessage("Invalid userId!"),

    body("status")
        .isIn([
            withdrawStatus.failed,
            withdrawStatus.success
        ]).withMessage("Invalid status")
]
