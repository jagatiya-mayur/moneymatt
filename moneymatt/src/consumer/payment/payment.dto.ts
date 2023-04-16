import { body } from "express-validator";
import { paymentStatus } from "../../utils/globalConst";

export const reqPaymentDto = [
    body("referenceId")
        .isString().withMessage("Invalid ReferenceId!")
        .trim()
        .notEmpty().withMessage("ReferenceId required!"),

    body("date")
        .isString().withMessage("Invalid date!")
        .trim()
        .notEmpty().withMessage("Date required!"),

    body("amount")
        .isNumeric().withMessage("Invalid amount")
];

export const verifyPaymentDto = [
    body("userId")
        .isMongoId().withMessage("Invalid userId!"),

    body("paymentId")
        .isMongoId().withMessage("Invalid paymentId!"),

    body("status")
        .isIn([
            paymentStatus.failed,
            paymentStatus.success
        ]).withMessage("Invalid Status!")
]