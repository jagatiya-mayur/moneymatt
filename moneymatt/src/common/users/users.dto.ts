import { body } from "express-validator";

export const resetPassBodyDto = [
    body("currentPassword")
        .isString()
        .notEmpty().withMessage("Invalid Current Password!")
        .trim(),

    body("newPassword")
        .isString()
        .notEmpty().withMessage("Invalid New Password!")
        .trim()
]