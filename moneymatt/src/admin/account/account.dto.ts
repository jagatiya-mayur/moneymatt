import { body, check } from 'express-validator';
import { optional } from 'joi';

export const accountBodyDto = [

    body("accountNo")
        .optional()
        .isNumeric().withMessage("Invalild AccountNo")
        .toInt(),

    body("ifscCode")
        .optional()
        .isString().withMessage("Invalild ifscCode")
        .trim()
        .notEmpty().withMessage("IfscCode should not be empty!"),

    body("upiId")
        .optional()
        .isString().withMessage("Invalild upiId")
        .trim()
        .notEmpty().withMessage("upiId should not be empty!"),

    check('upiQrCode')
        .optional()
        .custom((value, { req }) => {
            if (req.file) {
                return true; // return "non-falsy" value to indicate valid data"
            } else {
                return false; // return "falsy" value to indicate invalid data
            }
        })
        .withMessage('Upload upiQrCode Media!'),
];