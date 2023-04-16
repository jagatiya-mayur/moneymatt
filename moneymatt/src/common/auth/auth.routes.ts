import { Router } from "express";

import validationMiddleware from "../../middlewares/validation.middleware";

import Route from "../interface/routes.interface";
import authController from "./auth.controller";
import { otpInfoBodyDto, signUpDto, phoneDto, verifyOtpDto, singInInfoDto, resetOtpBodyDto, verifySignInOtpDto } from "./auth.dto";

class AuthRoute implements Route {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/signUp", signUpDto, validationMiddleware, authController.signUp);
        this.router.post("/verifySignUpOtp", otpInfoBodyDto, validationMiddleware, authController.verifySignUpOtp);
        this.router.post('/signIn', singInInfoDto, validationMiddleware, authController.signIn);
        this.router.post('/verifySignInOtp', verifySignInOtpDto, validationMiddleware, authController.verifySignInOtp);
        this.router.post('/forgotPassword', phoneDto, validationMiddleware, authController.forgotPassword);
        this.router.post('/resetPassword', verifyOtpDto, validationMiddleware, authController.verifyForgotPassOtp);
        this.router.post('/resendOtp', resetOtpBodyDto, validationMiddleware, authController.resendOtp);
    }
}

export default AuthRoute;   
