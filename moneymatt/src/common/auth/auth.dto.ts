import { body } from "express-validator";
import { otpType } from "../../utils/globalConst";

export const signUpDto = [
    body("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!")
];

export const otpInfoBodyDto = [
    body("name")
        .isString().withMessage("Invalid name!")
        .notEmpty().withMessage("Name Required!"),

    body("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("phone must be 10 digit long!"),

    body("otp")
        .isNumeric().withMessage("Invalid otp!")
        .isLength({ min: 5, max: 5 }).withMessage("otp must be 5 digit long!"),

    body("deviceId")
        .isString().withMessage("Invlaid deviceId")
        .trim(),

    body("email")
        .isEmail().withMessage("Invalid email!")
        .normalizeEmail({ gmail_remove_dots: false }),

    body("password")
        .isString().withMessage("Invalid password!")
        .trim()
        .notEmpty().withMessage("Password Required!"),

    body("referalCode")
        .optional({ nullable: true })
        .isString().withMessage("Invalid referal code!")
        .notEmpty().withMessage("Referal code required!")
];

export const phoneDto = [
    body("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),
]

export const verifyOtpDto = [
    body("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),

    body("otp")
        .isNumeric().withMessage("Invalid otp!")
        .isLength({ min: 5, max: 5 }).withMessage("Invalid otp!"),

    body("password")
        .isString()
        .withMessage("Invalid Password!")
        .notEmpty()
        .withMessage("Invalid Password!")
        .trim()
];

export const resetPasswordDto = [
    body("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),

    body("password")
        .isString()
        .withMessage("Invalid Password!")
        .notEmpty()
        .withMessage("Invalid Password!")
        .trim()
];

export const singInInfoDto = [
    body("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),

    body("password")
        .isString()
        .notEmpty().withMessage("Invalid password!")
        .trim(),

    body("deviceId")
        .isString().withMessage("invalid deviceId")
        .trim()
];

export const verifySignInOtpDto = [
    body("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),

    body("otp")
        .isString()
        .notEmpty().withMessage("Invalid otp!")
        .trim(),

    body("deviceId")
        .isString().withMessage("Invalid deviceId!")
        .trim()
];

export const resetOtpBodyDto = [
    body("phone")
        .isString()
        .isNumeric().withMessage("Invalid Phone!")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid Phone!"),

    body("otpType")
        .isIn([
            otpType.forgotPassword,
            otpType.signIn,
            otpType.signUp
        ]).withMessage("Invalid Otp Type!")
]