"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetOtpBodyDto = exports.verifySignInOtpDto = exports.singInInfoDto = exports.resetPasswordDto = exports.verifyOtpDto = exports.phoneDto = exports.otpInfoBodyDto = exports.signUpDto = void 0;
const express_validator_1 = require("express-validator");
const globalConst_1 = require("../../utils/globalConst");
exports.signUpDto = [
    (0, express_validator_1.body)("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!")
];
exports.otpInfoBodyDto = [
    (0, express_validator_1.body)("name")
        .isString().withMessage("Invalid name!")
        .notEmpty().withMessage("Name Required!"),
    (0, express_validator_1.body)("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("phone must be 10 digit long!"),
    (0, express_validator_1.body)("otp")
        .isNumeric().withMessage("Invalid otp!")
        .isLength({ min: 5, max: 5 }).withMessage("otp must be 5 digit long!"),
    (0, express_validator_1.body)("deviceId")
        .isString().withMessage("Invlaid deviceId")
        .trim(),
    (0, express_validator_1.body)("email")
        .isEmail().withMessage("Invalid email!")
        .normalizeEmail({ gmail_remove_dots: false }),
    (0, express_validator_1.body)("password")
        .isString().withMessage("Invalid password!")
        .trim()
        .notEmpty().withMessage("Password Required!"),
    (0, express_validator_1.body)("referalCode")
        .optional({ nullable: true })
        .isString().withMessage("Invalid referal code!")
        .notEmpty().withMessage("Referal code required!")
];
exports.phoneDto = [
    (0, express_validator_1.body)("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),
];
exports.verifyOtpDto = [
    (0, express_validator_1.body)("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),
    (0, express_validator_1.body)("otp")
        .isNumeric().withMessage("Invalid otp!")
        .isLength({ min: 5, max: 5 }).withMessage("Invalid otp!"),
    (0, express_validator_1.body)("password")
        .isString()
        .withMessage("Invalid Password!")
        .notEmpty()
        .withMessage("Invalid Password!")
        .trim()
];
exports.resetPasswordDto = [
    (0, express_validator_1.body)("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),
    (0, express_validator_1.body)("password")
        .isString()
        .withMessage("Invalid Password!")
        .notEmpty()
        .withMessage("Invalid Password!")
        .trim()
];
exports.singInInfoDto = [
    (0, express_validator_1.body)("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),
    (0, express_validator_1.body)("password")
        .isString()
        .notEmpty().withMessage("Invalid password!")
        .trim(),
    (0, express_validator_1.body)("deviceId")
        .isString().withMessage("invalid deviceId")
        .trim()
];
exports.verifySignInOtpDto = [
    (0, express_validator_1.body)("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),
    (0, express_validator_1.body)("otp")
        .isString()
        .notEmpty().withMessage("Invalid otp!")
        .trim(),
    (0, express_validator_1.body)("deviceId")
        .isString().withMessage("Invalid deviceId!")
        .trim()
];
exports.resetOtpBodyDto = [
    (0, express_validator_1.body)("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),
    (0, express_validator_1.body)("otpType")
        .isIn([
        globalConst_1.otpType.forgotPassword,
        globalConst_1.otpType.signIn,
        globalConst_1.otpType.signUp
    ]).withMessage("Invalid Otp Type!")
];
//# sourceMappingURL=auth.dto.js.map