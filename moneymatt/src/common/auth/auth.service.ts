import { sign } from "jsonwebtoken";
import { Types } from "mongoose";
import { hashSync } from "bcrypt";

import HttpException from "../../exceptions/HttpException";
import env from "../../configs/env.config";

import { otpType, role, statusCode } from "../../utils/globalConst";
import { User, UserDoc } from "../users/users.interface";
import usersService from "../users/users.service";
import { DataStoredInToken, SignInResponse, SingInOtpData, SingUpDetails, VerifyOtpData, VerifySignUpOtp } from "./auth.interface";
import { Otp, OtpDoc } from "../otps/otps.interface";
import otspsService from "../otps/otsps.service";
import { fast2sms } from "../../utils/fast2Sms";
import { Device } from "../../consumer/devices/devices.interface";

import devicesService from "../../consumer/devices/devices.service";
import referalsService from "../referals/referals.service";
import { generateReferalCode } from "../../utils/utils";


let instance: null | AuthService = null;

class AuthService {

    static getInstance(): AuthService {
        if (instance == null) {
            instance = new AuthService();
        }

        return instance;
    }

    async singUp(phone: string): Promise<void> {
        const newUser: User = await usersService.createAccount(phone);

        const otpDetail: Otp = await otspsService.createOtp(newUser._id!, otpType.signUp);

        await fast2sms(otpDetail.shortCode, phone);
    }

    public async verifySignUpOtp(otpInfo: VerifySignUpOtp): Promise<{ user: UserDoc, jwt: string }> {
        let referencingUser: Types.ObjectId | null = null;
        const otpDetails: OtpDoc | null = await otspsService.getOtpInfo(otpInfo, otpType.signUp);

        if (!otpDetails || (otpDetails && !otpDetails.user))
            throw new HttpException(statusCode.NOT_FOUND, "Invalid OTP!");

        if (otpInfo.referalCode) {
            referencingUser = await referalsService.validateReferalCode(otpInfo.referalCode);
        }
        const referalCode = generateReferalCode();

        const verifiedUserDetails: UserDoc | null = await usersService.updateUser(
            otpDetails.user._id!,
            {
                name: otpInfo.name,
                isPhoneVerified: true,
                email: otpInfo.email,
                password: hashSync(otpInfo.password, 10),
                referalCode,
                isRefered: otpInfo.referalCode ? true : false
            }
        );
        delete verifiedUserDetails?.password;

        await otpDetails.delete();

        const jwt = this.createToken(verifiedUserDetails!);

        if (otpInfo.deviceId != "") {
            await devicesService.addDeviceId(verifiedUserDetails?._id!, otpInfo.deviceId);
        }

        if (otpInfo.referalCode) {
            // add user under referencing user
            await referalsService.addReferal(verifiedUserDetails?._id!, referencingUser!);
        }

        return { user: verifiedUserDetails!, jwt };
    }

    public async forgotPassword(phone: string): Promise<void> {
        const userDetails: UserDoc | null = await usersService.getVerfiedUserByPhone(phone);

        if (!userDetails)
            throw new HttpException(statusCode.NOT_FOUND, "User not Exists!");

        const otpDetail: any = await otspsService.createOtp(userDetails._id, otpType.forgotPassword);

        await fast2sms(otpDetail.shortCode, userDetails.phone!);

        return;
    }

    public createToken(user: UserDoc): string {
        const dataStoredInToken: DataStoredInToken = { userId: user._id! };
        const secret: string = env.JWT_SECRET_KEY;
        // const expiresIn: number = 60 * 60 * 24 * 7;

        return sign(dataStoredInToken, secret, {});
    }

    public async verifyForgotPassOtp(otpInfo: VerifyOtpData, password: string): Promise<void> {
        const otpDetails: OtpDoc | null = await otspsService.getOtpInfo(otpInfo, otpType.forgotPassword);

        if (!otpDetails || (otpDetails && !otpDetails.user))
            throw new HttpException(statusCode.NOT_FOUND, "Invalid OTP!");

        await otpDetails.delete();
        await this.resetPassword(otpInfo.phone, password);
        return;
    }

    public async resetPassword(phone: string, password: string): Promise<void> {
        const userDetails: UserDoc | null = await usersService.getVerfiedUserByPhone(phone);

        if (!userDetails)
            throw new HttpException(statusCode.NOT_FOUND, "User not Exists!");

        await usersService.changePassword(userDetails, password);
        return;
    }

    public async signIn(phone: string, password: string, deviceId: string): Promise<SignInResponse | null> {
        const userDetails: UserDoc | null = await usersService.getVerfiedUserByPhone(phone);
        let deviceInfo: Device | null = null;

        if (!userDetails?.isPhoneVerified) {
            throw new HttpException(statusCode.CONFLICT, "Phone dosen't exists!");
        }

        const isPasswordCorrect = usersService.checkPassword(userDetails, password);

        if (!isPasswordCorrect) {
            throw new HttpException(statusCode.UNAUTHORIZED, "Wrong password!");
        }

        if (deviceId != "") {
            deviceInfo = await devicesService.findDeviceId(userDetails?._id, deviceId);
        }

        if (deviceInfo || userDetails.role == role.admin) {
            const jwt = this.createToken(userDetails);

            return {
                user: userDetails,
                jwt
            }
        } else {
            const otpDetail: any = await otspsService.createOtp(userDetails._id, otpType.signIn);

            await fast2sms(otpDetail.shortCode, userDetails.phone!);

            return null;
        }
    }

    public async verifySignInOtp(otpInfo: SingInOtpData): Promise<{ user: UserDoc, jwt: string }> {
        const otpDetails: OtpDoc | null = await otspsService.getOtpInfo(otpInfo, otpType.signIn);

        if (!otpDetails || (otpDetails && !otpDetails.user))
            throw new HttpException(statusCode.NOT_FOUND, "Invalid OTP!");

        const verifiedUserDetails: UserDoc | null = await usersService.getVerifiedUserById(otpDetails.user._id!);

        await otpDetails.delete();

        const jwt = this.createToken(verifiedUserDetails!);

        if (otpInfo.deviceId != "") {
            await devicesService.addDeviceId(verifiedUserDetails?._id!, otpInfo.deviceId);
        }

        return { user: verifiedUserDetails!, jwt };
    }

    public async resendOtp(phone: string, otpType: otpType): Promise<any> {
        const userDetails: UserDoc | null = await usersService.getVerfiedUserByPhone(phone);

        if (!userDetails) {
            throw new HttpException(statusCode.CONFLICT, "Phone dosen't exists!");
        }

        const otpDetail: any = await otspsService.createOtp(userDetails._id, otpType);

        await fast2sms(otpDetail.shortCode, phone);
    }


}

export default AuthService.getInstance();