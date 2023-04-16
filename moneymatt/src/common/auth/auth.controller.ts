import { Request, Response, NextFunction } from "express";

import { statusCode } from "../../utils/globalConst";
import { responseHandler } from "../../utils/utils";
import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";

import authService from "./auth.service";
import { User, UserDoc } from "../users/users.interface";
import { ForgotPassBody, ResendOtpBody, SignInDetails, SignInResponse, SingInOtpData, SingUpDetails, VerifyOtpData, VerifySignUpOtp } from "./auth.interface";

let instance: null | AuthController = null;

class AuthController {

    static getInstance(): AuthController {
        if (instance == null) {
            instance = new AuthController();
        }
        return instance;
    }

    public async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { phone } = req.body;

            await authService.singUp(phone);

            return res
                .status(statusCode.OK)
                .json(responseHandler(null, statusCode.OK, 'Otp Sent Successfully'));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async verifySignUpOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const otpInfo: VerifySignUpOtp = req.body;

            const { user, jwt } = await authService.verifySignUpOtp(otpInfo);

            return res.
                status(statusCode.OK)
                .json(responseHandler({ user, jwt }, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const phone: string = req.body.phone;

            await authService.forgotPassword(phone);

            return res.
                status(statusCode.OK)
                .json(responseHandler(null, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async verifyForgotPassOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { phone, otp, password } = req.body;
            const otpInfo: VerifyOtpData = {
                phone,
                otp
            }

            await authService.verifyForgotPassOtp(otpInfo, password);

            return res
                .status(statusCode.OK)
                .json(responseHandler(null, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { phone, password } = req.body;

            await authService.resetPassword(phone, password);

            return res
                .status(statusCode.OK)
                .json(responseHandler(null, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { phone, password, deviceId }: SignInDetails = req.body;

            const response: SignInResponse | null = await authService.signIn(phone, password, deviceId);

            return res
                .status(response ? statusCode.OK : statusCode.CREATED)
                .json(responseHandler(
                    response ? { ...response } : null,
                    response ? statusCode.OK : statusCode.CREATED,
                    response ? "SignIn Successfully" : "Otp send"
                ));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async verifySignInOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const otpInfo: SingInOtpData = req.body;

            const { user, jwt } = await authService.verifySignInOtp(otpInfo);

            return res.
                status(statusCode.OK)
                .json(responseHandler({ user, jwt }, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async resendOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { phone, otpType }: ResendOtpBody = req.body;

            await authService.resendOtp(phone, otpType);

            return res
                .status(statusCode.OK)
                .json(responseHandler(null, statusCode.OK, "success"));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default AuthController.getInstance();