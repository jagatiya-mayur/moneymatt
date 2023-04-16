"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const auth_dto_1 = require("./auth.dto");
class AuthRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/signUp", auth_dto_1.signUpDto, validation_middleware_1.default, auth_controller_1.default.signUp);
        this.router.post("/verifySignUpOtp", auth_dto_1.otpInfoBodyDto, validation_middleware_1.default, auth_controller_1.default.verifySignUpOtp);
        this.router.post('/signIn', auth_dto_1.singInInfoDto, validation_middleware_1.default, auth_controller_1.default.signIn);
        this.router.post('/verifySignInOtp', auth_dto_1.verifySignInOtpDto, validation_middleware_1.default, auth_controller_1.default.verifySignInOtp);
        this.router.post('/forgotPassword', auth_dto_1.phoneDto, validation_middleware_1.default, auth_controller_1.default.forgotPassword);
        this.router.post('/resetPassword', auth_dto_1.verifyOtpDto, validation_middleware_1.default, auth_controller_1.default.verifyForgotPassOtp);
        this.router.post('/resendOtp', auth_dto_1.resetOtpBodyDto, validation_middleware_1.default, auth_controller_1.default.resendOtp);
    }
}
exports.default = AuthRoute;
//# sourceMappingURL=auth.routes.js.map