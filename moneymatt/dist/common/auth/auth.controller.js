"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalConst_1 = require("../../utils/globalConst");
const utils_1 = require("../../utils/utils");
const auth_service_1 = __importDefault(require("./auth.service"));
let instance = null;
class AuthController {
    static getInstance() {
        if (instance == null) {
            instance = new AuthController();
        }
        return instance;
    }
    async signUp(req, res, next) {
        try {
            const { phone } = req.body;
            await auth_service_1.default.singUp(phone);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(null, globalConst_1.statusCode.OK, 'Otp Sent Successfully'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async verifySignUpOtp(req, res, next) {
        try {
            const otpInfo = req.body;
            const { user, jwt } = await auth_service_1.default.verifySignUpOtp(otpInfo);
            return res.
                status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)({ user, jwt }, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const phone = req.body.phone;
            await auth_service_1.default.forgotPassword(phone);
            return res.
                status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(null, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async verifyForgotPassOtp(req, res, next) {
        try {
            const { phone, otp, password } = req.body;
            const otpInfo = {
                phone,
                otp
            };
            await auth_service_1.default.verifyForgotPassOtp(otpInfo, password);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(null, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const { phone, password } = req.body;
            await auth_service_1.default.resetPassword(phone, password);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(null, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async signIn(req, res, next) {
        try {
            const { phone, password, deviceId } = req.body;
            const response = await auth_service_1.default.signIn(phone, password, deviceId);
            return res
                .status(response ? globalConst_1.statusCode.OK : globalConst_1.statusCode.CREATED)
                .json((0, utils_1.responseHandler)(response ? Object.assign({}, response) : null, response ? globalConst_1.statusCode.OK : globalConst_1.statusCode.CREATED, response ? "SignIn Successfully" : "Otp send"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async verifySignInOtp(req, res, next) {
        try {
            const otpInfo = req.body;
            const { user, jwt } = await auth_service_1.default.verifySignInOtp(otpInfo);
            return res.
                status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)({ user, jwt }, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async resendOtp(req, res, next) {
        try {
            const { phone, otpType } = req.body;
            await auth_service_1.default.resendOtp(phone, otpType);
            return res
                .status(globalConst_1.statusCode.OK)
                .json((0, utils_1.responseHandler)(null, globalConst_1.statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = AuthController.getInstance();
//# sourceMappingURL=auth.controller.js.map